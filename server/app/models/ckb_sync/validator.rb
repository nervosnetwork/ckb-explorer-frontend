module CkbSync
  class Validator
    class << self
      def validate(block_number)
        node_block = CkbSync::Api.instance.get_block_by_number(block_number)
        local_block = Block.find_by(number: node_block.header.number)

        ApplicationRecord.transaction do
          return if local_block.blank?

          local_block.verify!(node_block)
          update_address_balance_and_ckb_transactions_count!(local_block)
        end
      end

      def call(block_hash)
        node_block = CkbSync::Api.instance.get_block(block_hash)
        local_block = Block.find_by(number: node_block.header.number)

        ApplicationRecord.transaction do
          return if local_block.blank?

          local_block.verify!(node_block)
          update_address_balance_and_ckb_transactions_count!(local_block)
        end
      end

      private

      def update_address_balance_and_ckb_transactions_count!(local_block)
        addresses = []
        local_block.contained_addresses.each do |address|
          address.balance = address.cell_outputs.live.sum(:capacity)
          address.ckb_transactions_count = address.ckb_transactions.available.distinct.count

          addresses << address if address.changed?
        end

        if addresses.present?
          Address.import! addresses, on_duplicate_key_update: [:balance, :ckb_transactions_count], validate: false
        end
      end
    end
  end
end
