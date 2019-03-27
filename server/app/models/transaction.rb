class Transaction < ApplicationRecord
  belongs_to :block
  has_many :accounts, through: :account_books
  has_many :cell_inputs
  has_many :cell_outputs
end

# == Schema Information
#
# Table name: transactions
#
#  id              :bigint(8)        not null, primary key
#  tx_hash         :binary
#  deps            :jsonb
#  block_id        :bigint(8)
#  block_number    :integer
#  block_timestamp :integer
#  display_input   :jsonb
#  display_output  :jsonb
#  status          :integer
#  transaction_fee :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_transactions_on_block_id            (block_id)
#  index_transactions_on_tx_hash             (tx_hash) UNIQUE
#  index_transactions_on_tx_hash_and_status  (tx_hash,status)
#
