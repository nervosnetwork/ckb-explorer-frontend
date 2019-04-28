require "test_helper"

class BlockTest < ActiveSupport::TestCase
  context "associations" do
    should have_many(:ckb_transactions)
    should have_many(:uncle_blocks)
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
    should validate_presence_of(:cell_consumed).on(:create)
    should validate_presence_of(:reward).on(:create)
    should validate_presence_of(:total_transaction_fee).on(:create)
    should validate_presence_of(:ckb_transactions_count).on(:create)
    should validate_presence_of(:total_cell_capacity).on(:create)
    should validate_presence_of(:status).on(:create)
    should define_enum_for(:status).with_values(Block::statuses.keys)
    should validate_numericality_of(:reward).
      is_greater_than_or_equal_to(0).on(:create)
    should validate_numericality_of(:total_transaction_fee).
      is_greater_than_or_equal_to(0).on(:create)
    should validate_numericality_of(:ckb_transactions_count).
      is_greater_than_or_equal_to(0).on(:create)
    should validate_numericality_of(:total_cell_capacity).
      is_greater_than_or_equal_to(0).on(:create)
    should validate_numericality_of(:cell_consumed).
      is_greater_than_or_equal_to(0).on(:create)
  end

  test "#verify! change block status to authentic when block is verified" do
    block = create(:block)
    assert_changes -> { block.status }, from: "inauthentic", to: "authentic" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_authentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        block.verify!(node_block)
      end
    end
  end

  test "#verify! change block status to abandoned when block is not verified" do
    block = create(:block, block_hash: "0x419c632366c8eb9635acbb39ea085f7552ae62e1fdd480893375334a0f37d1bx")
    SyncInfo.local_authentic_tip_block_number
    assert_changes -> { block.status }, from: "inauthentic", to: "abandoned" do
      VCR.use_cassette("blocks/10") do
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        assert_difference "Block.count", 1 do
          block.verify!(node_block)
        end
      end
    end
  end

  test "#contained_addresses should return addresses under the block" do
    prepare_inauthentic_node_data
    Block.all.each do |block|
      ckb_transactions_under_the_block = block.ckb_transactions
      addresses = ckb_transactions_under_the_block.map { |ckb_transaction| ckb_transaction.addresses }.uniq.flatten
      assert_equal addresses, block.contained_addresses
    end
  end

  test "#block_hash should decodes packed string" do
    block = create(:block)
    block_hash = block.block_hash
    assert_equal unpack_attribute(block, "block_hash"), block_hash
  end

  test "#parent_hash should decodes packed string" do
    block = create(:block)
    parent_hash = block.parent_hash
    assert_equal unpack_attribute(block, "parent_hash"), parent_hash
  end

  test "#transactions_root should decodes packed string" do
    block = create(:block)
    transactions_root = block.transactions_root
    assert_equal unpack_attribute(block, "transactions_root"), transactions_root
  end

  test "#proposals_root should decodes packed string" do
    block = create(:block)
    proposals_root = block.proposals_root
    assert_equal unpack_attribute(block, "proposals_root"), proposals_root
  end

  test "#uncles_hash should decodes packed string" do
    block = create(:block)
    uncles_hash = block.uncles_hash
    assert_equal unpack_attribute(block, "uncles_hash"), uncles_hash
  end

  test "#uncle_block_hashes should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      uncle_block_hashes = block.uncle_block_hashes
      assert_equal unpack_array_attribute(block, "uncle_block_hashes", block.uncles_count, ENV["DEFAULT_HASH_LENGTH"]), uncle_block_hashes
    end
  end

  test "#uncle_block_hashes should return super when uncle block hashes is empty" do
    block = create(:block, :with_uncle_block_hashes)
    uncle_block_hashes = block.uncle_block_hashes
    assert_equal unpack_array_attribute(block, "uncle_block_hashes", block.uncles_count, ENV["DEFAULT_HASH_LENGTH"]), uncle_block_hashes
  end

  test "#proposals should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      proposals = block.proposals
      assert_equal unpack_array_attribute(block, "proposals", block.proposals_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposals
    end
  end

  test "#proposals should return super when proposal transactions is empty" do
    block = create(:block, :with_proposals)
    proposals = block.proposals
    assert_equal unpack_array_attribute(block, "proposals", block.proposals_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposals
  end

  test "#proposals= should encode proposals" do
    block = create(:block)
    block.proposals = ["0xeab419c632", "0xeab410c634"]
    block.proposals_count = block.proposals.size
    block.save
    assert_equal unpack_array_attribute(block, "proposals", block.proposals_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), block.proposals
  end
end
