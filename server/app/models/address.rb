class Address < ApplicationRecord
  PREFIX_MAINNET = "ckb".freeze
  PREFIX_TESTNET = "ckt".freeze

  has_one :lock_script
  has_many :cell_outputs
  has_many :account_books
  has_many :ckb_transactions, through: :account_books
  validates_presence_of :balance, :cell_consumed, :ckb_transactions_count
  validates :balance, :cell_consumed, :ckb_transactions_count, numericality: { greater_than_or_equal_to: 0 }

  def self.find_or_create_address(lock_script)
    address_hash = CkbUtils.generate_address(lock_script)

    Rails.cache.fetch(address_hash.to_s, expires_in: 1.day) do
      transaction(requires_new: true) { Address.create(address_hash: address_hash, balance: 0, cell_consumed: 0) }
    rescue ActiveRecord::RecordNotUnique
      Address.find_by(address_hash: address_hash)
    end
  end
end

# == Schema Information
#
# Table name: addresses
#
#  id                     :bigint           not null, primary key
#  balance                :decimal(30, )
#  address_hash           :binary
#  cell_consumed          :decimal(30, )
#  ckb_transactions_count :decimal(30, )    default(0)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_addresses_on_address_hash  (address_hash) UNIQUE
#
