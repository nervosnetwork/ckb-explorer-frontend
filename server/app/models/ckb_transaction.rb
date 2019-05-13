class CkbTransaction < ApplicationRecord
  paginates_per 10
  max_paginates_per 100

  enum status: { inauthentic: 0, authentic: 1, abandoned: 2 }
  enum display_inputs_status: { ungenerated: 0, generated: 1 }
  enum transaction_fee_status: { uncalculated: 0, calculated: 1 }

  belongs_to :block
  has_many :account_books
  has_many :addresses, through: :account_books
  has_many :cell_inputs
  has_many :cell_outputs

  validates_presence_of :status, :display_inputs_status, :transaction_fee_status

  attribute :tx_hash, :ckb_hash

  scope :recent, -> { order(block_timestamp: :desc) }
  scope :available, -> { where("status in (?,?)", statuses[:inauthentic], statuses[:authentic]) }
end

# == Schema Information
#
# Table name: ckb_transactions
#
#  id                     :bigint           not null, primary key
#  tx_hash                :binary
#  deps                   :jsonb
#  block_id               :bigint
#  block_number           :decimal(30, )
#  block_timestamp        :decimal(30, )
#  display_inputs         :jsonb
#  display_outputs        :jsonb
#  status                 :integer
#  transaction_fee        :decimal(30, )
#  version                :integer
#  witnesses              :string           is an Array
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  display_inputs_status  :integer          default("ungenerated")
#  transaction_fee_status :integer          default("uncalculated")
#
# Indexes
#
#  index_ckb_transactions_on_block_id                (block_id)
#  index_ckb_transactions_on_display_inputs_status   (display_inputs_status)
#  index_ckb_transactions_on_transaction_fee_status  (transaction_fee_status)
#  index_ckb_transactions_on_tx_hash                 (tx_hash) UNIQUE
#  index_ckb_transactions_on_tx_hash_and_status      (tx_hash,status)
#
