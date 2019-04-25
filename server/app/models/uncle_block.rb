class UncleBlock < ApplicationRecord
  belongs_to :block

  validates_presence_of :difficulty, :block_hash, :number, :parent_hash, :seal, :timestamp, :transactions_root, :txs_proposal, :uncles_count, :uncles_hash, :version

  attribute :block_hash, :ckb_hash
  attribute :parent_hash, :ckb_hash
  attribute :transactions_root, :ckb_hash
  attribute :txs_proposal, :ckb_hash
  attribute :uncles_hash, :ckb_hash
  attribute :proposals, :ckb_array_hash, hash_length: ENV["DEFAULT_SHORT_HASH_LENGTH"]
end

# == Schema Information
#
# Table name: uncle_blocks
#
#  id                :bigint(8)        not null, primary key
#  difficulty        :string(66)
#  block_hash        :binary
#  number            :bigint(8)
#  parent_hash       :binary
#  seal              :jsonb
#  timestamp         :bigint(8)
#  transactions_root :binary
#  proposals_root    :binary
#  uncles_count      :integer
#  uncles_hash       :binary
#  version           :integer
#  proposals         :binary
#  proposals_count   :integer
#  block_id          :bigint(8)
#  witnesses_root    :binary
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_uncle_blocks_on_block_hash  (block_hash) UNIQUE
#  index_uncle_blocks_on_block_id    (block_id)
#
