class Block < ApplicationRecord
  enum status: { inauthentic: 0, authentic: 1, abandoned: 2 }

  has_many :ckb_transactions
  has_many :uncle_blocks

  def verify!(node_block_hash)
    if verified?(node_block_hash)
      authenticate!
    else
      abandon!
      CkbSync::Persist.save_block(node_block, "authentic")
    end
  end

  private

  def verified?(node_block_hash)
    block_hash == node_block_hash
  end

  def authenticate!
    update_columns(status: "authentic")
  end

  def abandon!
    update_columns(status: "abandoned")
  end
end

# == Schema Information
#
# Table name: blocks
#
#  id                          :bigint(8)        not null, primary key
#  cellbase_id                 :binary
#  difficulty                  :binary
#  block_hash                  :binary
#  number                      :bigint(8)
#  parent_hash                 :binary
#  seal                        :jsonb
#  timestamp                   :bigint(8)
#  txs_commit                  :binary
#  txs_proposal                :binary
#  uncles_count                :integer
#  uncles_hash                 :binary
#  uncle_block_hashes          :binary
#  version                     :integer
#  proposal_transactions       :binary
#  proposal_transactions_count :integer
#  cell_consumed               :bigint(8)
#  miner_hash                  :binary
#  status                      :integer
#  reward                      :integer
#  total_transaction_fee       :integer
#  ckb_transactions_count      :bigint(8)        default(0)
#  total_cell_capacity         :bigint(8)
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
# Indexes
#
#  index_blocks_on_block_hash             (block_hash) UNIQUE
#  index_blocks_on_block_hash_and_status  (block_hash,status)
#  index_blocks_on_number_and_status      (number,status)
#
