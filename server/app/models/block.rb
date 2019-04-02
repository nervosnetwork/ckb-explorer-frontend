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

  def contained_accounts
    ckb_transactions.map { |ckb_transaction| ckb_transaction.accounts }.uniq.flatten
  end

  def cellbase_id
    "0x#{super.unpack("H*").first}"
  end

  def cellbase_id=(cellbase_id)
    super([cellbase_id[2..-1]].pack("H*"))
  end

  def difficulty
    "0x#{super.unpack("H*").first}"
  end

  def difficulty=(difficulty)
    super([difficulty[2..-1]].pack("H*"))
  end

  def block_hash
    "0x#{super.unpack("H*").first}"
  end

  def block_hash=(block_hash)
    super([block_hash[2..-1]].pack("H*"))
  end

  def parent_hash
    "0x#{super.unpack("H*").first}"
  end

  def parent_hash=(parent_hash)
    super([parent_hash[2..-1]].pack("H*"))
  end

  def txs_commit
    "0x#{super.unpack("H*").first}"
  end

  def txs_commit=(txs_commit)
    super([txs_commit[2..-1]].pack("H*"))
  end

  def txs_proposal
    "0x#{super.unpack("H*").first}"
  end

  def txs_proposal=(txs_proposal)
    super([txs_proposal[2..-1]].pack("H*"))
  end

  def uncles_hash
    if super.present?
      "0x#{super.unpack("H*").first}"
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

  def uncle_block_hashes
    if super.present?
      template = Array.new(uncles_count).reduce("") { |memo, item| "#{memo}H#{DEFAULT_HASH_LENGTH}" }
      super.unpack("#{template}").map { |hash| "0x#{hash}" }.reject(&:blank?)
    else
      super.reject(&:blank?)
    end
  end

  def uncle_block_hashes=(uncle_block_hashes)
    if uncle_block_hashes.present?
      real_uncle_block_hashes = uncle_block_hashes.map { |hash| hash[2..-1] }
      uncle_block_hashes = real_uncle_block_hashes.pack("H*" * real_uncle_block_hashes.size)
    end
    super(uncle_block_hashes)
  end

  def proposal_transactions
    if super.present?
      template = Array.new(proposal_transactions_count).reduce("") { |memo, item| "#{memo}H#{DEFAULT_SHORT_HASH_LENGTH}" }
      super.unpack("#{template}").map { |hash| "0x#{hash}" }.reject(&:blank?)
    else
      super.reject(&:blank?)
    end
  end

  def proposal_transactions=(proposal_transactions)
    if proposal_transactions.present?
      real_proposal_transactions = proposal_transactions.map { |hash| hash[2..-1] }
      proposal_transactions = real_proposal_transactions.pack("H*" * real_proposal_transactions.size)
    else
      super(proposal_transactions)
    end
  end

  def miner_hash
    "0x#{super.unpack("H*").first}"
  end

  def miner_hash=(miner_hash)
    super([miner_hash[2..-1]].pack("H*"))
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
