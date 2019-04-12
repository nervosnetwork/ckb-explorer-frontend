module CkbSync
  class Validator
    class << self
      def call(block_hash)
        node_block = CkbSync::Api.instance.get_block(block_hash).deep_stringify_keys
        local_block = Block.find_by(number: node_block.dig("header", "number"))

        ApplicationRecord.transaction do
          if local_block.present?
            local_block.verify!(node_block)
            update_account_balance_and_cell_consumed!(local_block)
          else
            CkbSync::Persist.save_block(node_block, "authentic")
          end
        end
      end

      private

      def update_account_balance_and_cell_consumed!(local_block)
        accounts =
          local_block.contained_accounts.map do |account|
            account.balance = CKB::Utils.get_balance(account.address_hash)
            account.cell_consumed = CKB::Utils.account_cell_consumed(account.address_hash)
            account
          end

        Account.import! accounts, on_duplicate_key_update: [:balance]
      end
    end
  end
end
