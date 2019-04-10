class Account < ApplicationRecord
  has_many :account_books
  has_many :ckb_transactions, through: :account_books
  validates_presence_of :address_hash, :balance, :cell_consumed, :ckb_transactions_count
  validates :balance, :cell_consumed, :ckb_transactions_count, numericality: { greater_than_or_equal_to: 0 }

  attribute :address_hash, :ckb_hash

  def self.find_or_create_account(ckb_transaction, verify_script)
    address_hash = CKB::Utils.json_script_to_type_hash(verify_script)
    if Account.where(address_hash: address_hash).exists?
      account = Account.find_by(address_hash: address_hash)
    else
      account = Account.create(address_hash: address_hash, balance: 0, cell_consumed: 0)
    end
    ckb_transaction.accounts << account.increment!("ckb_transactions_count")
    account
  end
end

# == Schema Information
#
# Table name: accounts
#
#  id                     :bigint(8)        not null, primary key
#  balance                :bigint(8)
#  address_hash           :binary
#  cell_consumed          :decimal(64, 2)
#  ckb_transactions_count :bigint(8)        default(0)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_accounts_on_address_hash  (address_hash) UNIQUE
#
