class UncleBlock < ApplicationRecord
  belongs_to :block

  validates_presence_of :cellbase_id, :difficulty, :block_hash, :number, :parent_hash, :seal, :timestamp, :txs_commit, :txs_proposal, :uncles_count, :uncles_hash, :version, :reward, :cellbase
  validates :reward, numericality: { greater_than_or_equal_to: 0 }

  def cellbase_id
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def cellbase_id=(cellbase_id)
    cellbase_id = [cellbase_id.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if cellbase_id.present?
    super
  end

  def difficulty
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def difficulty=(difficulty)
    difficulty = [difficulty.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if difficulty.present?
    super
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

  def proposal_transactions
    if super.present?
      template = Array.new(proposal_transactions_count).reduce("") { |memo, _item| "#{memo}H#{ENV['DEFAULT_SHORT_HASH_LENGTH']}" }
      super.unpack(template.to_s).map { |hash| "#{ENV['DEFAULT_HASH_PREFIX']}#{hash}" }.reject(&:blank?)
    else
      super.reject(&:blank?)
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
end

# == Schema Information
#
# Table name: uncle_blocks
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
#  version                     :integer
#  proposal_transactions       :binary
#  proposal_transactions_count :integer
#  miner_hash                  :binary
#  reward                      :integer
#  block_id                    :bigint(8)
#  cellbase                    :jsonb
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
# Indexes
#
#  index_uncle_blocks_on_block_hash  (block_hash) UNIQUE
#  index_uncle_blocks_on_block_id    (block_id)
#
