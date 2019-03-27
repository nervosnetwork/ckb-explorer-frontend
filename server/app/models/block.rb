class Block < ApplicationRecord
  has_many :ckb_transactions, counter_cache: :transactions_count
  has_many :uncle_blocks
end

# == Schema Information
#
# Table name: blocks
#
#  id                          :bigint(8)        not null, primary key
#  cellbase_id                 :binary
#  difficulty                  :binary
#  block_hash                  :binary
#  number                      :integer
#  parent_hash                 :binary
#  seal                        :jsonb
#  timestamp                   :integer
#  txs_commit                  :binary
#  txs_proposal                :binary
#  uncles_count                :integer
#  uncles_hash                 :binary
#  uncle_block_hashes          :string
#  version                     :integer
#  proposal_transactions       :binary
#  proposal_transactions_count :integer
#  cell_consumed               :integer
#  miner_hash                  :binary
#  status                      :integer
#  reward                      :integer
#  total_transaction_fee       :integer
#  transactions_count          :integer
#  total_cell_capacity         :integer
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
# Indexes
#
#  index_blocks_on_block_hash             (block_hash) UNIQUE
#  index_blocks_on_block_hash_and_status  (block_hash,status)
#  index_blocks_on_number_and_status      (number,status)
#
