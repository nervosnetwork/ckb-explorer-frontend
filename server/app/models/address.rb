class Address < ApplicationRecord
  PREFIX_MAINNET = "ckb".freeze
  PREFIX_TESTNET = "ckt".freeze

  has_one :lock_script
  has_many :account_books
  has_many :ckb_transactions, through: :account_books
  validates_presence_of :balance, :cell_consumed, :ckb_transactions_count
  validates :balance, :cell_consumed, :ckb_transactions_count, numericality: { greater_than_or_equal_to: 0 }

  def self.find_or_create_address(ckb_transaction, lock_script)
    address_hash = Utils::CkbUtils.generate_address(lock_script)

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
#  id                     :bigint           not null, primary key
#  balance                :bigint
#  address_hash           :binary
#  cell_consumed          :decimal(64, 2)
#  ckb_transactions_count :bigint           default(0)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_addresses_on_address_hash  (address_hash)
#
