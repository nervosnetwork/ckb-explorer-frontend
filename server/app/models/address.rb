class Address < ApplicationRecord
  PREFIX_MAINNET = "ckb".freeze
  PREFIX_TESTNET = "ckt".freeze

  has_one :lock_script
  has_many :cell_outputs
  has_many :account_books
  has_many :ckb_transactions, through: :account_books
  validates_presence_of :balance, :cell_consumed, :ckb_transactions_count
  validates :balance, :cell_consumed, :ckb_transactions_count, numericality: { greater_than_or_equal_to: 0 }

  attribute :lock_hash, :ckb_hash

  def self.find_or_create_address(lock_script)
    address_hash = CkbUtils.generate_address(lock_script)
    lock_hash = lock_script.to_hash

    Rails.cache.fetch(lock_hash, expires_in: 1.day) do
      transaction(requires_new: true) { Address.create(address_hash: address_hash, balance: 0, cell_consumed: 0, lock_hash: lock_hash) }
    rescue ActiveRecord::RecordNotUnique
      Address.find_by(lock_hash: lock_hash)
    end
  end

  def self.find_address!(query_key)
    if QueryKeyUtils.valid_hex?(query_key)
      address = Address.find_by!(lock_hash: query_key)
      LockHashSerializer.new(address)
    else
      address = Address.find_by!(address_hash: query_key)
      AddressSerializer.new(address)
    end
  rescue ActiveRecord::RecordNotFound
    raise Api::V1::Exceptions::AddressNotFoundError
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
#  lock_hash              :binary
#
# Indexes
#
#  index_addresses_on_address_hash  (address_hash) UNIQUE
#  index_addresses_on_lock_hash     (lock_hash) UNIQUE
#
