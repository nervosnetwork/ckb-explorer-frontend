class Block < ApplicationRecord
  enum status: { inauthentic: 0, authentic: 1, abandoned: 2 }

  has_many :ckb_transactions
  has_many :uncle_blocks

  validates_presence_of :difficulty, :block_hash, :number, :parent_hash, :seal, :timestamp, :txs_commit, :txs_proposal, :uncles_count, :uncles_hash, :version, :cell_consumed, :reward, :total_transaction_fee, :ckb_transactions_count, :total_cell_capacity, :status, on: :create
  validates :reward, :total_transaction_fee, :ckb_transactions_count, :total_cell_capacity, :cell_consumed, numericality: { greater_than_or_equal_to: 0 }

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

  def block_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def block_hash=(block_hash)
    block_hash = [block_hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if block_hash.present?
    super
  end

  def parent_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def parent_hash=(parent_hash)
    parent_hash = [parent_hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if parent_hash.present?
    super
  end

  def txs_commit
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def txs_commit=(txs_commit)
    txs_commit = [txs_commit.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if txs_commit.present?
    super
  end

  def txs_proposal
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def txs_proposal=(txs_proposal)
    txs_proposal = [txs_proposal.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if txs_proposal.present?
    super
  end

  def uncles_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def uncles_hash=(uncles_hash)
    uncles_hash = [uncles_hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if uncles_hash.present?
    super
  end

  def uncle_block_hashes
    if super.present?
      template = Array.new(uncles_count || 0).reduce("") { |memo, _item| "#{memo}H#{ENV['DEFAULT_HASH_LENGTH']}" }
      super.unpack(template.to_s).map { |hash| "#{ENV['DEFAULT_HASH_PREFIX']}#{hash}" }.reject(&:blank?)
    else
      super.try(:reject, &:blank?)
    end
  end

  def uncle_block_hashes=(uncle_block_hashes)
    if uncle_block_hashes.present?
      real_uncle_block_hashes = uncle_block_hashes.map { |hash| hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"]) }
      uncle_block_hashes = real_uncle_block_hashes.pack("H*" * real_uncle_block_hashes.size)
    end
    super
  end

  def proposal_transactions
    if super.present?
      template = Array.new(proposal_transactions_count || 0).reduce("") { |memo, _item| "#{memo}H#{ENV['DEFAULT_SHORT_HASH_LENGTH']}" }
      super.unpack(template.to_s).map { |hash| "#{ENV['DEFAULT_HASH_PREFIX']}#{hash}" }.reject(&:blank?)
    else
      super.try(:reject, &:blank?)
    end
  end

  def proposal_transactions=(proposal_transactions)
    if proposal_transactions.present?
      real_proposal_transactions = proposal_transactions.map { |hash| hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"]) }
      proposal_transactions = real_proposal_transactions.pack("H*" * real_proposal_transactions.size)
    end
    super
  end

  def miner_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def miner_hash=(miner_hash)
    miner_hash = [miner_hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if miner_hash.present?
    super
  end

  private

  def verified?(node_block_hash)
    block_hash == node_block_hash
  end

  def authenticate!
    update!(status: "authentic")
  end

  def abandon!
    update!(status: "abandoned")
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
