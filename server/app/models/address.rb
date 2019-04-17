class Address < ApplicationRecord
  has_many :account_books
  has_many :ckb_transactions, through: :account_books
  validates_presence_of :address_hash, :balance, :cell_consumed, :ckb_transactions_count
  validates :balance, :cell_consumed, :ckb_transactions_count, numericality: { greater_than_or_equal_to: 0 }

  attribute :address_hash, :ckb_hash

  def self.find_or_create_address(ckb_transaction, verify_script)
    address_hash = CKB::Utils.json_script_to_type_hash(verify_script)

    if Address.where(address_hash: address_hash).exists?
      address = Address.find_by(address_hash: address_hash)
    else
      address = Address.create(address_hash: address_hash, balance: 0, cell_consumed: 0)
    end

    ckb_transaction.addresses << address.increment!("ckb_transactions_count")
    address
  end
end

# == Schema Information
#
# Table name: addresses
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
#  index_addresses_on_address_hash  (address_hash) UNIQUE
#
