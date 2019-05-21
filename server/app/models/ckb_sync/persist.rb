module CkbSync
  class Persist
    class << self
      def call(block_hash, sync_type = "inauthentic")
        node_block = CkbSync::Api.instance.get_block(block_hash).to_h.deep_stringify_keys
        save_block(node_block, sync_type)
      end

      def sync(block_number)
        node_block = CkbSync::Api.instance.get_block_by_number(block_number).to_h.deep_stringify_keys
        save_block(node_block, "inauthentic")
      end

      def save_block(node_block, sync_type)
        ckb_transaction_and_display_cell_hashes = []
        local_block = build_block(node_block, sync_type)
        node_block["uncles"].map(&:to_h).map(&:deep_stringify_keys).each do |uncle_block|
          build_uncle_block(uncle_block.to_h, local_block)
        end

        build_ckb_transactions(local_block, node_block["transactions"], sync_type, ckb_transaction_and_display_cell_hashes)

        local_block.ckb_transactions_count = ckb_transaction_and_display_cell_hashes.size

        ApplicationRecord.transaction do
          Block.import! [local_block], recursive: true, batch_size: 1500
          SyncInfo.find_by!(name: sync_tip_block_number_type(sync_type), value: local_block.number).update!(status: "synced")

          ckb_transactions = assign_display_info_to_ckb_transaction(ckb_transaction_and_display_cell_hashes)
          calculate_transaction_fee(node_block["transactions"], ckb_transactions)
          CkbTransaction.import! ckb_transactions, batch_size: 1500, on_duplicate_key_update: [:transaction_fee, :display_inputs, :display_outputs, :display_inputs_status, :transaction_fee_status]

          local_block.total_transaction_fee = ckb_transactions.reduce(0) { |memo, ckb_transaction| memo + ckb_transaction.transaction_fee }
          local_block.save!
        end

        local_block
      end

      def update_ckb_transaction_info_and_fee
        display_inputs_ckb_transaction_ids = CkbTransaction.ungenerated.limit(500).ids.map { |ids| [ids] }
        Sidekiq::Client.push_bulk("class" => UpdateTransactionDisplayInputsWorker, "args" => display_inputs_ckb_transaction_ids, "queue" => "transaction_info_updater") if display_inputs_ckb_transaction_ids.present?

        transaction_fee_ckb_transaction_ids = CkbTransaction.uncalculated.limit(500).ids.map { |ids| [ids] }
        Sidekiq::Client.push_bulk("class" => UpdateTransactionFeeWorker, "args" => display_inputs_ckb_transaction_ids, "queue" => "transaction_info_updater") if transaction_fee_ckb_transaction_ids.present?
      end

      def update_ckb_transaction_display_inputs(ckb_transaction)
        display_inputs = []
        ckb_transaction.cell_inputs.find_each do |cell_input|
          display_inputs << build_display_input(cell_input)
        end
        assign_display_inputs(ckb_transaction, display_inputs)

        ckb_transaction.save
      end

      def update_transaction_fee(ckb_transaction)
        transaction_fee = CkbUtils.ckb_transaction_fee(ckb_transaction)
        assign_ckb_transaction_fee(ckb_transaction, transaction_fee)

        ApplicationRecord.transaction do
          ckb_transaction.save!
          block = ckb_transaction.block
          total_transaction_fee = 0
          block.ckb_transactions.find_each do |transaction|
            total_transaction_fee += transaction.transaction_fee
          end
          block.total_transaction_fee = total_transaction_fee
          block.save!
        end
      end

      private

      def assign_ckb_transaction_fee(ckb_transaction, transaction_fee)
        if transaction_fee.present?
          ckb_transaction.transaction_fee = transaction_fee
          ckb_transaction.transaction_fee_status = "calculated"
        end
      end

      def assign_display_inputs(ckb_transaction, display_inputs)
        should_assign = true
        display_inputs.each do |display_input|
          if display_input.blank?
            should_assign = false
            break
          end
        end

        if should_assign
          ckb_transaction.display_inputs = display_inputs
          ckb_transaction.display_inputs_status = "generated"
        end
      end

      def calculate_transaction_fee(transactions, ckb_transactions)
        transactions.each_with_index do |transaction, index|
          transaction_fee = CkbUtils.transaction_fee(transaction)
          assign_ckb_transaction_fee(ckb_transactions[index], transaction_fee)
        end
      end

      def build_ckb_transactions(local_block, transactions, sync_type, ckb_transaction_and_display_cell_hashes)
        ckb_transaction_count_info = {}

        transactions.each do |transaction|
          addresses = Set.new
          ckb_transaction_and_display_cell_hash = { transaction: nil, inputs: [], outputs: [] }
          ckb_transaction = build_ckb_transaction(local_block, transaction, sync_type)
          ckb_transaction_and_display_cell_hash[:transaction] = ckb_transaction

          build_cell_inputs(transaction["inputs"], ckb_transaction, ckb_transaction_and_display_cell_hash)
          build_cell_outputs(transaction["outputs"], ckb_transaction, ckb_transaction_and_display_cell_hash, addresses)

          ckb_transaction_and_display_cell_hashes << ckb_transaction_and_display_cell_hash

          addresses_arr = addresses.to_a
          ckb_transaction.addresses << addresses_arr
          addresses_arr.each do |address|
            if ckb_transaction_count_info[address.id].present?
              ckb_transaction_count = ckb_transaction_count_info[address.id]
              ckb_transaction_count_info[address.id] = ckb_transaction_count + 1
            else
              ckb_transaction_count_info.merge!({ address.id => 1 })
            end
          end
        end

        update_addresses_ckb_transactions_count(ckb_transaction_count_info)
      end

      def update_addresses_ckb_transactions_count(ckb_transaction_count_info)
        ckb_transaction_count_info.each do |address_id, ckb_transaction_count|
          address = Address.find(address_id)
          address.increment!("ckb_transactions_count", ckb_transaction_count)
        end
      end

      def build_cell_inputs(node_inputs, ckb_transaction, ckb_transaction_and_display_cell_hash)
        node_inputs.each do |input|
          cell_input = build_cell_input(ckb_transaction, input)
          ckb_transaction_and_display_cell_hash[:inputs] << cell_input
        end
      end

      def build_cell_outputs(node_outputs, ckb_transaction, ckb_transaction_and_display_cell_hash, addresses)
        node_outputs.each do |output|
          address = Address.find_or_create_address(output["lock"])
          cell_output = build_cell_output(ckb_transaction, output, address)
          lock_script = build_lock_script(cell_output, output["lock"], address)
          type_script = build_type_script(cell_output, output["type"])
          cell_output.node_cell_output = {
            capacity: cell_output.capacity,
            data: cell_output.data,
            lock: lock_script.to_node_lock,
            type: type_script&.to_node_type
          }
          ckb_transaction_and_display_cell_hash[:outputs] << cell_output
          addresses << address
        end
      end

      def sync_tip_block_number_type(sync_type)
        "#{sync_type}_tip_block_number"
      end

      def assign_display_info_to_ckb_transaction(ckb_transaction_and_display_cell_hashes)
        ckb_transaction_and_display_cell_hashes.map do |ckb_transaction_and_display_cell_hash|
          transaction = ckb_transaction_and_display_cell_hash[:transaction]

          display_inputs = ckb_transaction_and_display_cell_hash[:inputs].map(&method(:build_display_input))
          assign_display_inputs(transaction, display_inputs)

          transaction.display_outputs = ckb_transaction_and_display_cell_hash[:outputs].map { |output| { id: output.id, capacity: output.capacity, address_hash: output.address_hash } }
          transaction
        end
      end

      def build_display_input(cell_input)
        cell = cell_input.previous_output["cell"]

        if cell.blank?
          { id: nil, from_cellbase: true, capacity: cell_input.ckb_transaction.block.reward, address_hash: nil }
        else
          previous_cell_output = cell_input.previous_cell_output

          return if previous_cell_output.blank?

          address_hash = previous_cell_output.address_hash
          { id: previous_cell_output.id, from_cellbase: false, capacity: previous_cell_output.capacity, address_hash: address_hash }
        end
      end

      def build_type_script(cell_output, type_script)
        return if type_script.blank?

        cell_output.build_type_script(
          args: type_script["args"],
          code_hash: type_script["code_hash"]
        )
      end

      def build_lock_script(cell_output, verify_script, address)
        cell_output.build_lock_script(
          args: verify_script["args"],
          code_hash: verify_script["code_hash"],
          address: address
        )
      end

      def build_cell_input(ckb_transaction, input)
        ckb_transaction.cell_inputs.build(
          previous_output: input["previous_output"],
          since: input["since"],
          args: input["args"]
        )
      end

      def build_cell_output(ckb_transaction, output, address)
        ckb_transaction.cell_outputs.build(
          capacity: output["capacity"],
          data: output["data"],
          address: address,
          block: ckb_transaction.block
        )
      end

      def uncle_block_hashes(node_block_uncles)
        node_block_uncles.map { |uncle| uncle.to_h.dig("header", "hash") }
      end

      def build_block(node_block, sync_type)
        header = node_block["header"]
        epoch_info = CkbUtils.get_epoch_info(header["epoch"])
        Block.new(
          difficulty: header["difficulty"],
          block_hash: header["hash"],
          number: header["number"],
          parent_hash: header["parent_hash"],
          seal: header["seal"],
          timestamp: header["timestamp"],
          transactions_root: header["transactions_root"],
          proposals_hash: header["proposals_hash"],
          uncles_count: header["uncles_count"],
          uncles_hash: header["uncles_hash"],
          uncle_block_hashes: uncle_block_hashes(node_block["uncles"]),
          version: header["version"],
          proposals: node_block["proposals"],
          proposals_count: node_block["proposals"].count,
          cell_consumed: CkbUtils.block_cell_consumed(node_block["transactions"]),
          total_cell_capacity: CkbUtils.total_cell_capacity(node_block["transactions"]),
          miner_hash: CkbUtils.miner_hash(node_block["transactions"].first),
          status: sync_type,
          reward: CkbUtils.miner_reward(header["epoch"].first),
          total_transaction_fee: 0,
          witnesses_root: header["witness_root"],
          epoch: header["epoch"],
          start_number: epoch_info.start_number,
          length: epoch_info.length
        )
      end

      def build_uncle_block(uncle_block, local_block)
        header = uncle_block["header"]
        local_block.uncle_blocks.build(
          difficulty: header["difficulty"],
          block_hash: header["hash"],
          number: header["number"],
          parent_hash: header["parent_hash"],
          seal: header["seal"],
          timestamp: header["timestamp"],
          transactions_root: header["transactions_root"],
          proposals_hash: header["proposals_hash"],
          uncles_count: header["uncles_count"],
          uncles_hash: header["uncles_hash"],
          version: header["version"],
          proposals: uncle_block["proposals"],
          proposals_count: uncle_block["proposals"].count,
          witnesses_root: header["witness_root"],
          epoch: header["epoch"]
        )
      end

      def build_ckb_transaction(local_block, transaction, sync_type)
        local_block.ckb_transactions.build(
          tx_hash: transaction["hash"],
          deps: transaction["deps"],
          version: transaction["version"],
          block_number: local_block.number,
          block_timestamp: local_block.timestamp,
          status: sync_type,
          transaction_fee: 0,
          witnesses: transaction["witnesses"]
        )
      end
    end
  end
end
