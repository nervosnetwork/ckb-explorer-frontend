module CKB
  module Utils
    def self.calculate_cell_min_capacity(output)
      output = output.deep_symbolize_keys
      capacity = 8 + output[:data].bytesize + calculate_script_capacity(output[:lock])
      if type = output[:type]
        capacity += calculate_script_capacity(type)
      end
      capacity
    end

    def self.calculate_script_capacity(script)
      capacity = 1 + (script[:args] || []).map { |arg| arg.bytesize }.reduce(0, &:+)
      if script[:binary_hash]
        capacity += CKB::Utils.hex_to_bin(script[:binary_hash]).bytesize
      end
      capacity
    end

    def self.block_cell_consumed(commit_transactions)
      commit_transactions.reduce(0) do |memo, commit_transaction|
        memo + commit_transaction["outputs"].reduce(0) { |inside_memo, output| inside_memo + CKB::Utils.calculate_cell_min_capacity(output) }
      end
    end

    def self.total_cell_capacity(commit_transactions)
      commit_transactions.reduce(0) do |memo, commit_transaction|
        memo + commit_transaction["outputs"].reduce(0) { |inside_memo, output| inside_memo + output["capacity"] }
      end
    end

    def self.miner_hash(cellbase)
      CKB::Utils.json_script_to_type_hash(cellbase["outputs"].first["lock"].symbolize_keys)
    end

    def self.miner_reward(cellbase)
      cellbase["outputs"].first["capacity"]
    end

    def self.transaction_fee(transaction)
      output_capacities = transaction["outputs"].map { |output| output["capacity"] }.reduce(0, &:+)
      input_capacities = transaction["inputs"].map { |input| CKB::Utils.cell_input_capacity(input) }.reduce(0, &:+)
      input_capacities.zero? ? 0 : (input_capacities - output_capacities)
    end

    def self.total_transaction_fee(transactions)
      transactions.reduce(0) { |memo, transaction| memo + CKB::Utils.transaction_fee(transaction) }
    end

    def self.get_unspent_cells(lock_hash)
      to = CkbSync::Api.instance.get_tip_block_number.to_i
      results = []
      current_from = 1

      while current_from <= to
        current_to = [current_from + 100, to].min
        cells = CkbSync::Api.instance.get_cells_by_lock_hash(lock_hash, current_from, current_to)
        results.concat(cells)
        current_from = current_to + 1
      end
      results
    end

    # TODO Can be changed to calculate by local cell
    def self.get_balance(lock_hash)
      CKB::Utils.get_unspent_cells(lock_hash).reduce(0) { |memo, cell| memo + cell[:capacity] }
    end

    # TODO Can be changed to calculate by local cell
    def self.account_cell_consumed(lock_hash)
      outputs =
        CKB::Utils.get_unspent_cells(lock_hash).map do |cell|
          out_point = cell[:out_point]
          previous_transaction_hash = out_point[:hash]
          previous_output_index = out_point[:index]
          if CellOutput::BASE_HASH != previous_transaction_hash
            previous_transacton = CkbTransaction.find_by(tx_hash: previous_transaction_hash)

            # TODO may be no need to do this. when testnet is repaired, check it.
            if previous_transacton.present?
              previous_output = previous_transacton.cell_outputs.order(:id)[previous_output_index]
              previous_output
            end
          end
        end

      outputs.compact.reduce(0) { |memo, output| memo + CKB::Utils.calculate_cell_min_capacity(output.to_node_cell_output) }
    end

    def self.cell_input_capacity(cell_input)
      outpoint = cell_input["previous_output"]
      previous_transaction_hash = outpoint["hash"]
      previous_output_index = outpoint["index"]
      if CellOutput::BASE_HASH == previous_transaction_hash
        0
      else
        previous_transacton = CkbTransaction.find_by(tx_hash: previous_transaction_hash)
        previous_output = previous_transacton.cell_outputs.order(:id)[previous_output_index]
        previous_output.capacity
      end
    end
  end
end
