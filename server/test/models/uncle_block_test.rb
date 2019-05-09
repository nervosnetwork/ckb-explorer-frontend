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
    should validate_presence_of(:transactions_root).on(:create)
    should validate_presence_of(:proposals_root).on(:create)
    should validate_presence_of(:uncles_count).on(:create)
    should validate_presence_of(:uncles_hash).on(:create)
    should validate_presence_of(:version).on(:create)
  end

  test "#block_hash should decodes packed string" do
    block = create(:block)
    uncle_block = create(:uncle_block, block: block)
    block_hash = uncle_block.block_hash
    assert_equal unpack_attribute(uncle_block, "block_hash"), block_hash
  end

  test "#parent_hash should decodes packed string" do
    block = create(:block)
    uncle_block = create(:uncle_block, block: block)
    parent_hash = uncle_block.parent_hash
    assert_equal unpack_attribute(uncle_block, "parent_hash"), parent_hash
  end

  test "#transactions_root should decodes packed string" do
    block = create(:block)
    uncle_block = create(:uncle_block, block: block)
    transactions_root = uncle_block.transactions_root
    assert_equal unpack_attribute(uncle_block, "transactions_root"), transactions_root
  end

  test "#proposals_root should decodes packed string" do
    block = create(:block)
    uncle_block = create(:uncle_block, block: block)
    proposals_root = uncle_block.proposals_root
    assert_equal unpack_attribute(uncle_block, "proposals_root"), proposals_root
  end

  test "#uncles_hash should decodes packed string" do
    block = create(:block)
    uncle_block = create(:uncle_block, block: block)
    uncles_hash = uncle_block.uncles_hash
    assert_equal unpack_attribute(uncle_block, "uncles_hash"), uncles_hash
  end

  test "#proposals should decodes packed string" do
    VCR.use_cassette("blocks/17") do
      create(:sync_info, name: "inauthentic_tip_block_number", value: 111)
      SyncInfo.local_inauthentic_tip_block_number
      block_hash = "0xad03a72d1d6af63fa3bcec6ed9eb16da10ea8b78d0266a8c5cec233c759e2827"
      node_block = CkbSync::Api.instance.get_block(block_hash).deep_stringify_keys
      set_default_lock_params(node_block: node_block)

      CkbSync::Persist.save_block(node_block, "inauthentic")
      block = Block.find_by(block_hash: block_hash)
      uncle_block = block.uncle_blocks.first
      proposals = uncle_block.proposals
      assert_equal unpack_array_attribute(uncle_block, "proposals", uncle_block.proposals_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposals
    end
  end

  test "#proposals should return super when proposal transactions is empty" do
    block = create(:block)
    uncle_block = create(:uncle_block, block: block)
    uncle_block.update(proposals: [])
    proposals = uncle_block.proposals
    assert_equal unpack_array_attribute(uncle_block, "proposals", uncle_block.proposals_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposals
  end

  test "#proposals= should encode proposals" do
    block = create(:block)
    uncle_block = create(:uncle_block, block: block)
    uncle_block.proposals = ["0xeab419c632", "0xeab410c634"]
    uncle_block.proposals_count = uncle_block.proposals.size
    uncle_block.save
    assert_equal unpack_array_attribute(uncle_block, "proposals", uncle_block.proposals_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), uncle_block.proposals
  end
end
