class UncleBlock < ApplicationRecord
  belongs_to :block

  def cellbase_id
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
  end

  def cellbase_id=(cellbase_id)
    super([cellbase_id[2..-1]].pack("H*"))
  end

  def difficulty
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
  end

  def difficulty=(difficulty)
    super([difficulty[2..-1]].pack("H*"))
  end

  def block_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
  end

  def block_hash=(block_hash)
    super([block_hash[2..-1]].pack("H*"))
  end

  def parent_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
  end

  def parent_hash=(parent_hash)
    super([parent_hash[2..-1]].pack("H*"))
  end

  def txs_commit
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
  end

  def txs_commit=(txs_commit)
    super([txs_commit[2..-1]].pack("H*"))
  end

  def txs_proposal
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
  end

  def txs_proposal=(txs_proposal)
    super([txs_proposal[2..-1]].pack("H*"))
  end

  def uncles_hash
    if super.present?
      "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
    else
      super
    end
  end

  def uncles_hash=(uncles_hash)
    if uncles_hash.present?
      uncles_hash = [uncles_hash[2..-1]].pack("H*")
    end
    super(uncles_hash)
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
      real_proposal_transactions = proposal_transactions.map { |hash| hash[2..-1] }
      proposal_transactions = real_proposal_transactions.pack("H*" * real_proposal_transactions.size)
    end
    super(proposal_transactions)
  end

  def miner_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}"
  end

  def miner_hash=(miner_hash)
    super([miner_hash[2..-1]].pack("H*"))
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
