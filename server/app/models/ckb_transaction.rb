class CkbTransaction < ApplicationRecord
  paginates_per 10
  max_paginates_per 100

  enum status: { inauthentic: 0, authentic: 1, abandoned: 2 }

  belongs_to :block
  has_many :account_books
  has_many :addresses, through: :account_books
  has_many :cell_inputs
  has_many :cell_outputs

  validates_presence_of :transaction_fee, :status
  validates :transaction_fee, numericality: { greater_than_or_equal_to: 0 }

  attribute :tx_hash, :ckb_hash

  scope :recent, -> { order(block_timestamp: :desc) }
end

# == Schema Information
#
# Table name: ckb_transactions
#
#  id              :bigint           not null, primary key
#  tx_hash         :binary
#  deps            :jsonb
#  block_id        :bigint
#  block_number    :bigint
#  block_timestamp :bigint
#  display_inputs  :jsonb
#  display_outputs :jsonb
#  status          :integer
#  transaction_fee :integer
#  version         :integer
#  witnesses       :string           is an Array
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_ckb_transactions_on_block_id            (block_id)
#  index_ckb_transactions_on_tx_hash             (tx_hash) UNIQUE
#  index_ckb_transactions_on_tx_hash_and_status  (tx_hash,status)
#
