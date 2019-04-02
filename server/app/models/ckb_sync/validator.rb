class CkbSync::Validator
  class << self
    def call(block_hash)
      node_block = CkbSync::Api.get_block(block_hash).deep_stringify_keys
      local_block = Block.find_by(number: node_block.dig("header", "number"))
      ApplicationRecord.transaction do
        local_block.verify!(block.dig("header", "hash"))
        update_account_balance_and_cell_consumed!(local_block)
      end
    end

    private

    def update_account_balance_and_cell_consumed!(local_block)
      accounts = local_block.contained_accounts.map do |account|
        account.balance = CKB::Utils.get_balance(account.address_hash)
        account.cell_consumed = CKB::Utils.account_cell_consumed(account.address_hash)
        account
      end

      Account.import! accounts, on_duplicate_key_update: [:balance]
    end
  end
end
