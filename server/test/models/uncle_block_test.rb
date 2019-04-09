require "test_helper"

class UncleBlockTest < ActiveSupport::TestCase
  context "associations" do
    should belong_to(:block)
  end

  context "validations" do
    should validate_presence_of(:block_hash).on(:create)
    should validate_presence_of(:number).on(:create)
    should validate_presence_of(:parent_hash).on(:create)
    should validate_presence_of(:seal).on(:create)
    should validate_presence_of(:timestamp).on(:create)
    should validate_presence_of(:txs_commit).on(:create)
    should validate_presence_of(:txs_proposal).on(:create)
    should validate_presence_of(:uncles_count).on(:create)
    should validate_presence_of(:uncles_hash).on(:create)
    should validate_presence_of(:version).on(:create)
  end

  test "#block_hash should decodes packed string" do
    block = create_block("inauthentic")
    uncle_block = create_uncle_block(block)
    block_hash = uncle_block.block_hash
    assert_equal unpack_attribute(uncle_block, "block_hash"), block_hash
  end

  test "#parent_hash should decodes packed string" do
    block = create_block("inauthentic")
    uncle_block = create_uncle_block(block)
    parent_hash = uncle_block.parent_hash
    assert_equal unpack_attribute(uncle_block, "parent_hash"), parent_hash
  end

  test "#txs_commit should decodes packed string" do
    block = create_block("inauthentic")
    uncle_block = create_uncle_block(block)
    txs_commit = uncle_block.txs_commit
    assert_equal unpack_attribute(uncle_block, "txs_commit"), txs_commit
  end

  test "#txs_proposal should decodes packed string" do
    block = create_block("inauthentic")
    uncle_block = create_uncle_block(block)
    txs_proposal = uncle_block.txs_proposal
    assert_equal unpack_attribute(uncle_block, "txs_proposal"), txs_proposal
  end

  test "#uncles_hash should decodes packed string" do
    block = create_block("inauthentic")
    uncle_block = create_uncle_block(block)
    uncles_hash = uncle_block.uncles_hash
    assert_equal unpack_attribute(uncle_block, "uncles_hash"), uncles_hash
  end

  test "#proposal_transactions should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.get_block("0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8").deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = ["0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8".delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
      block = Block.find_by(block_hash: packed_block_hash)
      uncle_block = block.uncle_blocks.first
      proposal_transactions = uncle_block.proposal_transactions
      assert_equal unpack_array_attribute(uncle_block, "proposal_transactions", uncle_block.proposal_transactions_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposal_transactions
    end
  end

  test "#proposal_transactions should return super when proposal transactions is empty" do
    block = create_block("inauthentic")
    uncle_block = create_uncle_block(block)
    uncle_block.update(proposal_transactions: nil)
    proposal_transactions = uncle_block.proposal_transactions
    assert_equal unpack_array_attribute(uncle_block, "proposal_transactions", uncle_block.proposal_transactions_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposal_transactions
  end

  test "#proposal_transactions= should encode proposal_transactions" do
    block = create_block("inauthentic")
    uncle_block = create_uncle_block(block)
    uncle_block.proposal_transactions = ["0xeab419c632", "0xeab410c634"]
    uncle_block.save
    assert_equal unpack_array_attribute(uncle_block, "proposal_transactions", uncle_block.proposal_transactions_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), uncle_block.proposal_transactions
  end
end
