module CkbSync
  class Validator
    class << self
      def validate(block_number)
        node_block = CkbSync::Api.instance.get_block_by_number(block_number).to_h.deep_stringify_keys
        local_block = Block.find_by(number: node_block.dig("header", "number"))

        ApplicationRecord.transaction do
          return if local_block.blank?

          local_block.verify!(node_block)
          update_cell_status!(local_block)
          update_address_balance_and_cell_consumed!(local_block)
        end
      end

      def call(block_hash)
        node_block = CkbSync::Api.instance.get_block(block_hash).to_h.deep_stringify_keys
        local_block = Block.find_by(number: node_block.dig("header", "number"))

        ApplicationRecord.transaction do
          return if local_block.blank?

          local_block.verify!(node_block)
          update_cell_status!(local_block)
          update_address_balance_and_cell_consumed!(local_block)
        end
      end

      private

      def update_cell_status!(local_block)
        cell_inputs = []
        local_block.ckb_transactions.find_each do |ckb_transaction|
          cell_inputs.concat ckb_transaction.cell_inputs
        end
        cell_inputs.map { |cell_input| cell_input.previous_cell_output&.update(status: :dead) }
      end

      def update_address_balance_and_cell_consumed!(local_block)
        addresses =
          local_block.contained_addresses.map do |address|
            address.balance = CkbUtils.get_balance(address.address_hash) || 0
            address.cell_consumed = CkbUtils.address_cell_consumed(address.address_hash) || 0
            address
          end

        Address.import! addresses.select(&:changed?), on_duplicate_key_update: [:balance, :cell_consumed]
      end
    end
  end
end
