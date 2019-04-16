class Block < ApplicationRecord
  paginates_per 10
  max_paginates_per 100

  enum status: { inauthentic: 0, authentic: 1, abandoned: 2 }

  has_many :ckb_transactions
  has_many :uncle_blocks

  validates_presence_of :difficulty, :block_hash, :number, :parent_hash, :seal, :timestamp, :txs_commit, :txs_proposal, :uncles_count, :uncles_hash, :version, :cell_consumed, :reward, :total_transaction_fee, :ckb_transactions_count, :total_cell_capacity, :status, on: :create
  validates :reward, :total_transaction_fee, :ckb_transactions_count, :total_cell_capacity, :cell_consumed, numericality: { greater_than_or_equal_to: 0 }

  attribute :block_hash, :ckb_hash
  attribute :parent_hash, :ckb_hash
  attribute :txs_commit, :ckb_hash
  attribute :txs_proposal, :ckb_hash
  attribute :uncles_hash, :ckb_hash
  attribute :miner_hash, :ckb_hash
  attribute :uncle_block_hashes, :ckb_array_hash, hash_length: ENV["DEFAULT_HASH_LENGTH"]
  attribute :proposal_transactions, :ckb_array_hash, hash_length: ENV["DEFAULT_SHORT_HASH_LENGTH"]

  scope :recent, -> { order(id: :desc) }

  def verify!(node_block)
    if verified?(node_block.dig("header", "hash"))
      authenticate!
    else
      abandon!
      CkbSync::Persist.save_block(node_block, "authentic")
    end
  end

  def contained_accounts
    ckb_transactions.map { |ckb_transaction| ckb_transaction.accounts }.uniq.flatten
  end

  def self.find_block(query_key)
    raise Api::V1::Exceptions::BlockQueryKeyInvalidError if !/\A\d+\z/.match(query_key) && !(query_key.start_with?(ENV["DEFAULT_HASH_PREFIX"]) && query_key.length == ENV["DEFAULT_WITH_PREFIX_HASH_LENGTH"].to_i)

    begin
      if query_key.start_with?(ENV["DEFAULT_HASH_PREFIX"])
        find_by!(block_hash: query_key)
      else
        find_by!(number: query_key)
      end
    rescue ActiveRecord::RecordNotFound
      raise Api::V1::Exceptions::BlockNotFoundError
    end
  end

  private

  def verified?(node_block_hash)
    block_hash == node_block_hash
  end

  def authenticate!
    update!(status: "authentic")
    ChangeCkbTransactionsStatusWorker.perform_async(id, "authentic")
  end

  def abandon!
    update!(status: "abandoned")
    ChangeCkbTransactionsStatusWorker.perform_async(id, "abandoned")
  end
end

# == Schema Information
#
# Table name: blocks
#
#  id                          :bigint(8)        not null, primary key
#  difficulty                  :string(66)
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
#  cell_consumed               :decimal(64, 2)
#  miner_hash                  :binary
#  status                      :integer
#  reward                      :integer
#  total_transaction_fee       :integer
#  ckb_transactions_count      :bigint(8)        default(0)
#  total_cell_capacity         :decimal(64, 2)
#  witnesses_root              :binary
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
# Indexes
#
#  index_blocks_on_block_hash             (block_hash) UNIQUE
#  index_blocks_on_block_hash_and_status  (block_hash,status)
#  index_blocks_on_number_and_status      (number,status)
#
