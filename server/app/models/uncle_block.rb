class UncleBlock < ApplicationRecord
  belongs_to :block
end

# == Schema Information
#
# Table name: uncle_blocks
#
#  id                          :bigint(8)        not null, primary key
#  difficulty                  :binary
#  block_hash                  :binary
#  number                      :bigint(8)
#  parent_hash                 :binary
#  seal                        :jsonb
#  timestamp                   :bigint(8)
#  txs_commit                  :binary
#  txs_proposal                :binary
#  uncles_hash                 :binary
#  version                     :integer
#  proposal_transactions       :binary
#  proposal_transactions_count :integer
#  miner_hash                  :binary
#  status                      :integer
#  reward                      :integer
#  total_transaction_fee       :integer
#  block_id                    :bigint(8)
#  cellbase                    :jsonb
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
# Indexes
#
#  index_uncle_blocks_on_block_hash             (block_hash) UNIQUE
#  index_uncle_blocks_on_block_hash_and_status  (block_hash,status)
#  index_uncle_blocks_on_block_id               (block_id)
#
