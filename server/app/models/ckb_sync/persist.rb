class CkbSync::Persist
  class << self
    def call(block_hash, sync_type)
      node_block = CkbSync::Api.get_block(block_hash).deep_stringify_keys
      save_block(node_block, sync_type)
    end

    def save_block(node_block, sync_type)
      ckb_transactions_with_display_cell = []
      local_block = build_block(node_block, sync_type)
      node_block["uncles"].each do |uncle_block|
        build_uncle_block(uncle_block, local_block)
      end
      commit_transactions = node_block["commit_transactions"]
      ckb_transactions_with_display_cell_item = {transaction: nil, inputs: [], outputs: []}
      commit_transactions.each do |transaction|
        ckb_transaction = build_ckb_transaction(local_block, transaction, sync_type)
        ckb_transactions_with_display_cell_item[:transaction] = ckb_transaction
        transaction["inputs"].each do |input|
          cell_input = build_cell_input(ckb_transaction, input)
          ckb_transactions_with_display_cell_item[:inputs] << cell_input
        end
        transaction["outputs"].each do |output|
          cell_output = build_cell_output(ckb_transaction, output)
          account = Account.find_or_create_account(ckb_transaction, output["lock"].symbolize_keys)
          build_lock_script(cell_output, output["lock"], account)
          build_type_script(cell_output, output["type"])
          ckb_transactions_with_display_cell_item[:outputs] << cell_output
        end
        ckb_transactions_with_display_cell << ckb_transactions_with_display_cell_item
      end
      local_block.ckb_transactions_count = ckb_transactions_with_display_cell.size
      ApplicationRecord.transaction do
        Block.import! [local_block], recursive: true, batch_size: 1500
        SyncInfo.find_by!(name: sync_tip_block_number_type(sync_type)).update!(status: "synced")
        ckb_transactions = assign_display_info_to_ckb_transaction(ckb_transactions_with_display_cell)
        CkbTransaction.import! ckb_transactions, batch_size: 1500, on_duplicate_key_update: [:display_inputs, :display_outputs]
      end
    end

    private

    def sync_tip_block_number_type(sync_type)
      "#{sync_type}_tip_block_number"
    end

    def assign_display_info_to_ckb_transaction(ckb_transactions)
      ckb_transactions.map do |ckb_transaction|
        transaction = ckb_transaction[:transaction]
        transaction.display_inputs = ckb_transaction[:inputs].map { |input| build_display_input(input) }
        transaction.display_outputs = ckb_transaction[:outputs].map { |output| { id: output.id, capacity: output.capacity } }
        transaction
      end
    end

    def build_display_input(cell_input)
      outpoint = cell_input.previous_output
      previous_transaction_hash = outpoint["hash"]
      previous_output_index = outpoint["index"]
      if CellOutput::BASE_HASH == previous_transaction_hash
        { id: nil, capacity: CellOutput::INITIAL_BLOCK_REWARD }
      else
        previous_transacton = CkbTransaction.find_by(tx_hash: previous_transaction_hash)
        previous_output = previous_transacton.cell_outputs.order(:id)[previous_output_index]
        { id: previous_output.id, capacity: previous_output.capacity }
      end
    end

    def build_type_script(cell_output, type_script)
      return if type_script.blank?
      cell_output.build_type_script(
        args: type_script["args"],
        binary_hash: type_script["binary_hash"],
        version: type_script["version"]
      )
    end

    def build_lock_script(cell_output, verify_script, account)
      cell_output.build_lock_script(
        args: verify_script["args"],
        binary_hash: verify_script["binary_hash"],
        version: verify_script["version"],
        account_id: account.id
      )
    end

    def build_cell_input(ckb_transaction, input)
      ckb_transaction.cell_inputs.build(
        previous_output: input["previous_output"],
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
        cellbase_id: header["cellbase_id"],
        difficulty: header["difficulty"],
        block_hash: header["hash"],
        number: header["number"],
        parent_hash: header["parent_hash"],
        seal: header["seal"],
        timestamp: header["timestamp"],
        txs_commit: header["txs_commit"],
        txs_proposal: header["txs_proposal"],
        uncles_count: header["uncles_count"],
        uncles_hash: header["uncles_hash"],
        uncle_block_hashes: uncle_block_hashes(node_block["uncles"]),
        version: header["version"],
        proposal_transactions: node_block["proposal_transactions"],
        proposal_transactions_count: node_block["proposal_transactions"].count,
        cell_consumed: CKB::Utils.block_cell_consumed(node_block["commit_transactions"]),
        total_cell_capacity: CKB::Utils.total_cell_capacity(node_block["commit_transactions"]),
        miner_hash: CKB::Utils.miner_hash(node_block["commit_transactions"].first),
        status: sync_type,
        reward: CKB::Utils.miner_reward(node_block["commit_transactions"].first),
        total_transaction_fee: CKB::Utils.total_transaction_fee(node_block["commit_transactions"])
      )
    end

    def build_uncle_block(uncle_block, local_block)
      header = uncle_block["header"]
      local_block.uncle_blocks.build(
        cellbase_id: header["cellbase_id"],
        difficulty: header["difficulty"],
        block_hash: header["hash"],
        number: header["number"],
        parent_hash: header["parent_hash"],
        seal: header["seal"],
        timestamp: header["timestamp"],
        txs_commit: header["txs_commit"],
        txs_proposal: header["txs_proposal"],
        uncles_count: header["uncles_count"],
        uncles_hash: header["uncles_hash"],
        version: header["version"],
        proposal_transactions: uncle_block["proposal_transactions"],
        proposal_transactions_count: uncle_block["proposal_transactions"].count,
        miner_hash: CKB::Utils.miner_hash(uncle_block["cellbase"]),
        reward: CKB::Utils.miner_reward(uncle_block["cellbase"]) #TODO uncle reward 获取方式待定
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
        transaction_fee: CKB::Utils.transaction_fee(transaction)
      )
    end
  end
end
