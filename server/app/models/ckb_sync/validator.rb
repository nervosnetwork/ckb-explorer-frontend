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
          update_address_balance_and_ckb_transactions_count!(local_block)
        end
      end

      def call(block_hash)
        node_block = CkbSync::Api.instance.get_block(block_hash).to_h.deep_stringify_keys
        local_block = Block.find_by(number: node_block.dig("header", "number"))

        ApplicationRecord.transaction do
          return if local_block.blank?

          local_block.verify!(node_block)
          update_cell_status!(local_block)
          update_address_balance_and_ckb_transactions_count!(local_block)
        end
      end

      private

      def update_cell_status!(local_block)
        cell_output_ids = CellInput.where(ckb_transaction: local_block.ckb_transactions).select("previous_cell_output_id")

        CellOutput.where(id: cell_output_ids).update_all(status: :dead)
      end

      def update_address_balance_and_ckb_transactions_count!(local_block)
        addresses = []
        local_block.contained_addresses.each do |address|
          address.balance = address.cell_outputs.live.sum(:capacity)
          address.ckb_transactions_count = CellOutput.where(address: address).select("ckb_transaction_id").distinct.count

          addresses << address if address.changed?
        end

        if addresses.present?
          Address.import! addresses, on_duplicate_key_update: [:balance]
        end
      end
    end
  end
end
