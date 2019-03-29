class CkbSync::Persist
  class << self
    def call(block_hash, sync_type)
      node_block = CkbSync::Api.get_block(block_hash).deep_stringify_keys
      save_block(node_block, sync_type)
    end

    def save_block(node_block, sync_type)
      blocks = []
      local_block = build_block(node_block, sync_type)
      node_block["uncles"].each do |uncle_block|
        build_uncle_block(uncle_block, local_block)
      end
      commit_transactions = node_block["commit_transactions"]
      commit_transactions.each do |transaction|
        ckb_transaction = build_transaction(local_block, transaction, sync_type)
        transaction["inputs"].each do |input|
          cell_input = build_cell_input(ckb_transaction, transaction)
          account = find_or_build_account(ckb_transaction, input["unlock"].except("args").symbolize_keys)      #
          build_lock_script(cell_input, input["unlock"], account)
        end
        transaction["outputs"].each do |output|
          cell_output = build_cell_output(ckb_transaction, output)
          # build_lock_script(cell_output, output, account) #TODO 等 script 改版后会从 output 上拿数据创建 lock_script
          build_type_script(cell_output, output["type"]) #TODO 等 script 改版后会在 output 上拿数据 type_script
        end
      end
      blocks << local_block

      ApplicationRecord.transaction do
        Block.import! blocks, recursive: true
        SyncInfo.find_by!(name: sync_tip_block_number_type).update!(status: "synced")
      end
    end

    private

    def sync_tip_block_number_type
      "local_#{sync_type}_tip_block_number"
    end

    def find_or_build_account(ckb_transaction, verify_script_json_object)
      address_hash = CKB::Utils.json_script_to_type_hash(verify_script_json_object)
      if Account.where(address_hash: address_hash).exists?
        account = Account.find_by(address_hash: address_hash)
        #TODO call update balance worker
      else
        account = ckb_transaction.accounts.build(address_hash: address_hash, balance: 0, cell_consumed: 0)
      end
      account
    end

    def build_uncle_block(uncle_block, local_block)
      uncle_block_header = uncle_block["header"]
      local_block.uncle_blocks.build(
        cellbase: uncle_block["cellbase"],
        difficulty: uncle_block_header["difficulty"],
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
        miner_hash: "", #TODO
        reward: 0 #TODO
      )
    end

    #TODO 更改数据结构
    def build_type_script(cell_output, type_script_json_object)
      return if type_script_json_object.blank?
      cell_output.build_type_script(
        args: type_script_json_object["args"],
        binary: type_script_json_object["binary"],
        reference: type_script_json_object["reference"],
        signed_args: type_script_json_object["signed_args"],
        version: type_script_json_object["version"]
      )
    end

    #TODO 等 script 改版后从 cell_output 拿数据
    def build_lock_script(cell_input, verify_script_json_object, account)
      cell_input.build_lock_script(
        args: verify_script_json_object["args"],
        binary: verify_script_json_object["binary"],
        reference: verify_script_json_object["reference"],
        signed_args: verify_script_json_object["signed_args"],
        version: verify_script_json_object["version"],
        cell_output_id: 1,
        account_id: account.id
      )
    end

    def build_cell_input(ckb_transaction, input)
      ckb_transaction.cell_inputs.build(
        previous_output: input["previous_output"],
        unlock: input["unlock"]
      )

    end

    def build_cell_output(ckb_transaction, output)
      ckb_transaction.cell_outputs.build(
        capacity: output["capacity"],
        data: output["data"]
      )
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
        uncle_block_hashes: "", #TODO
        version: header["version"],
        proposal_transactions: node_block["proposal_transactions"],
        proposal_transactions_count: node_block["proposal_transactions"].count,
        cell_consumed: 0, #TODO
        total_cell_capacity: 0, #TODO
        miner_hash: "", #TODO
        status: sync_type,
        reward: 0, #TODO
        total_transaction_fee: 0 #TODO
      )
    end

    def build_transaction(local_block, transaction, sync_type)
      local_block.ckb_transactions.build(
        tx_hash: transaction["hash"],
        deps: transaction["deps"],
        version: transaction["version"],
        block_number: local_block.number,
        block_timestamp: local_block.timestamp,
        display_input: "", # TODO,
        display_output: "", #TODO
        status: sync_type,
        transaction_fee: 0 #TODO
      )
    end
  end
end
