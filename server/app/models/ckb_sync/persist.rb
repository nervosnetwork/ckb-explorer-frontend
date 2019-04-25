module CkbSync
  class Persist
    class << self
      def call(block_hash, sync_type)
        node_block = CkbSync::Api.instance.get_block(block_hash).deep_stringify_keys
        save_block(node_block, sync_type)
      end

      def save_block(node_block, sync_type)
        ckb_transaction_and_display_cell_hashes = []
        local_block = build_block(node_block, sync_type)
        node_block["uncles"].each do |uncle_block|
          build_uncle_block(uncle_block, local_block)
        end

        build_ckb_transactions(local_block, node_block["transactions"], sync_type, ckb_transaction_and_display_cell_hashes)

        local_block.ckb_transactions_count = ckb_transaction_and_display_cell_hashes.size

        ApplicationRecord.transaction do
          Block.import! [local_block], recursive: true, batch_size: 1500
          SyncInfo.find_by!(name: sync_tip_block_number_type(sync_type)).update!(status: "synced")

          ckb_transactions = assign_display_info_to_ckb_transaction(ckb_transaction_and_display_cell_hashes)
          calculate_transaction_fee(node_block["transactions"], ckb_transactions)
          CkbTransaction.import! ckb_transactions, batch_size: 1500, on_duplicate_key_update: [:display_inputs, :display_outputs]

          local_block.total_transaction_fee = ckb_transactions.reduce(0) { |memo, ckb_transaction| memo + ckb_transaction.transaction_fee }
          local_block.save!
        end

        local_block
      end

      private

      def calculate_transaction_fee(transactions, ckb_transactions)
        transactions.each_with_index do |transaction, index|
          ckb_transactions[index].transaction_fee = Utils::CkbUtils.transaction_fee(transaction)
        end
      end

      def build_ckb_transactions(local_block, transactions, sync_type, ckb_transaction_and_display_cell_hashes)
        transactions.each do |transaction|
          ckb_transaction_and_display_cell_hash = { transaction: nil, inputs: [], outputs: [] }
          ckb_transaction = build_ckb_transaction(local_block, transaction, sync_type)
          ckb_transaction_and_display_cell_hash[:transaction] = ckb_transaction

          build_cell_inputs(transaction["inputs"], ckb_transaction, ckb_transaction_and_display_cell_hash)
          build_cell_outputs(transaction["outputs"], ckb_transaction, ckb_transaction_and_display_cell_hash)

          ckb_transaction_and_display_cell_hashes << ckb_transaction_and_display_cell_hash
        end
      end

      def build_cell_inputs(node_inputs, ckb_transaction, ckb_transaction_and_display_cell_hash)
        node_inputs.each do |input|
          cell_input = build_cell_input(ckb_transaction, input)
          ckb_transaction_and_display_cell_hash[:inputs] << cell_input
        end
      end

      def build_cell_outputs(node_outputs, ckb_transaction, ckb_transaction_and_display_cell_hash)
        node_outputs.each do |output|
          cell_output = build_cell_output(ckb_transaction, output)
          address = Address.find_or_create_address(ckb_transaction, output["lock"])
          build_lock_script(cell_output, output["lock"], address)
          build_type_script(cell_output, output["type"])
          ckb_transaction_and_display_cell_hash[:outputs] << cell_output
        end
      end

      def sync_tip_block_number_type(sync_type)
        "#{sync_type}_tip_block_number"
      end

      def assign_display_info_to_ckb_transaction(ckb_transaction_and_display_cell_hashes)
        ckb_transaction_and_display_cell_hashes.map do |ckb_transaction_and_display_cell_hash|
          transaction = ckb_transaction_and_display_cell_hash[:transaction]
          transaction.display_inputs = ckb_transaction_and_display_cell_hash[:inputs].map { |input| build_display_input(input) }
          transaction.display_outputs = ckb_transaction_and_display_cell_hash[:outputs].map { |output| { id: output.id, capacity: output.capacity, address_hash: output.address_hash } }
          transaction
        end
      end

      def build_display_input(cell_input)
        outpoint = cell_input.previous_output
        previous_transaction_hash = outpoint["hash"]
        previous_output_index = outpoint["index"]
        if CellOutput::BASE_HASH == previous_transaction_hash
          { id: nil, from_cellbase: true, capacity: CellOutput::INITIAL_BLOCK_REWARD, address_hash: nil }
        else
          previous_transacton = CkbTransaction.find_by(tx_hash: previous_transaction_hash)
          previous_output = previous_transacton.cell_outputs.order(:id)[previous_output_index]
          address_hash = previous_output.address_hash
          { id: previous_output.id, from_cellbase: false, capacity: previous_output.capacity, address_hash: address_hash }
        end
      end

      def build_type_script(cell_output, type_script)
        return if type_script.blank?

        cell_output.build_type_script(
          args: type_script["args"],
          binary_hash: type_script["binary_hash"],
        )
      end

      def build_lock_script(cell_output, verify_script, address)
        cell_output.build_lock_script(
          args: verify_script["args"],
          binary_hash: verify_script["binary_hash"],
          address: address
        )
      end

      def build_cell_input(ckb_transaction, input)
        ckb_transaction.cell_inputs.build(
          previous_output: input["previous_output"],
          valid_since: input["valid_since"],
          args: input["args"]
        )
      end

      def build_cell_output(ckb_transaction, output)
        ckb_transaction.cell_outputs.build(
          capacity: output["capacity"],
          data: output["data"]
        )
      end

      def uncle_block_hashes(node_block_uncles)
        node_block_uncles.map { |uncle| uncle.dig("header", "hash") }
      end

      def build_block(node_block, sync_type)
        header = node_block["header"]
        Block.new(
          difficulty: header["difficulty"],
          block_hash: header["hash"],
          number: header["number"],
          parent_hash: header["parent_hash"],
          seal: header["seal"],
          timestamp: header["timestamp"],
          transactions_root: header["transactions_root"],
          txs_proposal: header["txs_proposal"],
          uncles_count: header["uncles_count"],
          uncles_hash: header["uncles_hash"],
          uncle_block_hashes: uncle_block_hashes(node_block["uncles"]),
          version: header["version"],
          proposals: node_block["proposals"],
          proposals_count: node_block["proposals"].count,
          cell_consumed: Utils::CkbUtils.block_cell_consumed(node_block["transactions"]),
          total_cell_capacity: Utils::CkbUtils.total_cell_capacity(node_block["transactions"]),
          miner_hash: Utils::CkbUtils.miner_hash(node_block["transactions"].first),
          status: sync_type,
          reward: Utils::CkbUtils.miner_reward(node_block["transactions"].first),
          total_transaction_fee: 0,
          witnesses_root: header["witnesses_root"]
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
          txs_proposal: header["txs_proposal"],
          uncles_count: header["uncles_count"],
          uncles_hash: header["uncles_hash"],
          version: header["version"],
          proposals: uncle_block["proposals"],
          proposals_count: uncle_block["proposals"].count,
          witnesses_root: header["witnesses_root"]
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
