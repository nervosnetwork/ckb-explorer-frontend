module Utils
  class CkbUtils
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
      if script[:code_hash]
        capacity += CKB::Utils.hex_to_bin(script[:code_hash]).bytesize
      end
      capacity
    end

    def self.block_cell_consumed(transactions)
      transactions.reduce(0) do |memo, transaction|
        memo + transaction["outputs"].reduce(0) { |inside_memo, output| inside_memo + calculate_cell_min_capacity(output) }
      end
    end

    def self.total_cell_capacity(transactions)
      transactions.reduce(0) do |memo, transaction|
        memo + transaction["outputs"].reduce(0) { |inside_memo, output| inside_memo + output["capacity"].to_i }
      end
    end

    def self.miner_hash(cellbase)
      lock_script = cellbase["outputs"].first["lock"]
      generate_address(lock_script)
    end

    def self.generate_address(lock_script)
      return if !use_default_lock_script?(lock_script)

      first_arg = lock_script.stringify_keys["args"].first

      target_pubkey_blake160_bin = [CKB::Utils.hex_to_bin(first_arg)].pack("H*")
      target_pubkey_blake160 = CKB::Utils.bin_to_hex(target_pubkey_blake160_bin)
      target_pubkey_blake160_bin = [target_pubkey_blake160[2..-1]].pack("H*")
      type = ["01"].pack("H*")
      bin_idx = ["P2PH".each_char.map { |c| c.ord.to_s(16) }.join].pack("H*")
      payload = type + bin_idx + target_pubkey_blake160_bin
      CKB::ConvertAddress.encode(Address::PREFIX_TESTNET, payload)
    end

    def self.use_default_lock_script?(lock_script)
      first_arg = lock_script.stringify_keys["args"].first
      code_hash = lock_script.stringify_keys["code_hash"]

      return false if code_hash.blank?

      code_hash == LockScript::SYSTEM_SCRIPT_CELL_HASH && CKB::Utils.valid_hex_string?(first_arg)
    end

    def self.parse_address(address_hash)
      decoded_prefix, data = CKB::ConvertAddress.decode(address_hash)
      raise "Invalid prefix" if decoded_prefix != Address::PREFIX_TESTNET

      raise "Invalid type/bin-idx" if data.slice(0..4) != ["0150325048"].pack("H*")

      CKB::Utils.bin_to_hex(data.slice(5..-1))
    end

    def self.miner_reward(cellbase)
      cellbase["outputs"].first["capacity"].to_i
    end

    def self.transaction_fee(transaction)
      output_capacities = transaction["outputs"].map { |output| output["capacity"].to_i }.reduce(0, &:+)
      input_capacities = transaction["inputs"].map { |input| cell_input_capacity(input) }.reduce(0, &:+)
      input_capacities.zero? ? 0 : (input_capacities - output_capacities)
    end

    def self.get_unspent_cells(address_hash)
      return if address_hash.blank?

      address = Address.find_by(address_hash: address_hash)
      address.cell_outputs.live
    end

    def self.lock_hash(address_hash)
      return if address_hash.blank?

      lock = CKB::Utils.generate_lock(parse_address(address_hash), LockScript::SYSTEM_SCRIPT_CELL_HASH)
      CKB::Utils.json_script_to_type_hash(lock)
    end

    def self.get_balance(address_hash)
      return if address_hash.blank?

      get_unspent_cells(address_hash).reduce(0) { |memo, cell| memo + cell.capacity }
    end

    def self.address_cell_consumed(address_hash)
      return if address_hash.blank?

      get_unspent_cells(address_hash).reduce(0) { |memo, output| memo + calculate_cell_min_capacity(output.to_node_cell_output) }
    end

    def self.cell_input_capacity(cell_input)
      outpoint = cell_input["previous_output"]
      previous_transaction_hash = outpoint["tx_hash"]
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
