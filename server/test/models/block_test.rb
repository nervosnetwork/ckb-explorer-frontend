require "test_helper"

class BlockTest < ActiveSupport::TestCase
  context "associations" do
    should have_many(:ckb_transactions)
    should have_many(:uncle_blocks)
    should have_many(:cell_outputs)
  end

  context "validations" do
    should validate_presence_of(:block_hash).on(:create)
    should validate_presence_of(:number).on(:create)
    should validate_presence_of(:parent_hash).on(:create)
    should validate_presence_of(:seal).on(:create)
    should validate_presence_of(:timestamp).on(:create)
    should validate_presence_of(:transactions_root).on(:create)
    should validate_presence_of(:proposals_hash).on(:create)
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
        create(:sync_info, name: "inauthentic_tip_block_number", value: 10)
        create(:sync_info, name: "authentic_tip_block_number", value: 10)
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
        block.verify!(node_block)
      end
    end
  end

  test "#verify! change block status to abandoned when block is not verified" do
    block = create(:block, block_hash: "0x419c632366c8eb9635acbb39ea085f7552ae62e1fdd480893375334a0f37d1bx")
    create(:sync_info, name: "authentic_tip_block_number", value: 10)

    SyncInfo.local_authentic_tip_block_number
    assert_changes -> { block.status }, from: "inauthentic", to: "abandoned" do
      VCR.use_cassette("blocks/10") do
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
        assert_difference "Block.count", 1 do
          block.verify!(node_block)
        end
      end
    end
  end

  test "#verify! change cell outputs under the abandoned block status to abandoned" do
    Sidekiq::Testing.inline!

    block = create(:block, :with_block_hash)
    create(:ckb_transaction, :with_cell_output_and_lock_and_type_script, block: block)
    create(:sync_info, name: "authentic_tip_block_number", value: 10)
    SyncInfo.local_authentic_tip_block_number

    assert_changes -> { block.cell_outputs.pluck(:status).uniq }, from: ["live"], to: ["abandoned"] do
      VCR.use_cassette("blocks/10") do
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
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
      addresses = ckb_transactions_under_the_block.map(&:addresses).flatten.uniq

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

  test "#proposals_hash should decodes packed string" do
    block = create(:block)
    proposals_hash = block.proposals_hash

    assert_equal unpack_attribute(block, "proposals_hash"), proposals_hash
  end

  test "#uncles_hash should decodes packed string" do
    block = create(:block)
    uncles_hash = block.uncles_hash

    assert_equal unpack_attribute(block, "uncles_hash"), uncles_hash
  end

  test "#uncle_block_hashes should decodes packed string" do
    VCR.use_cassette("blocks/2") do
      SyncInfo.local_inauthentic_tip_block_number
      create(:sync_info, name: "inauthentic_tip_block_number", value: 2)
      block_hash = "0x2f8cd9eeb04e2c57c8192e77d6f5cf64630201fd23b1d7c0b89edd73033efbba"
      node_block = CkbSync::Api.instance.get_block(block_hash)
      CkbSync::Persist.save_block(node_block, "inauthentic")
      block = Block.find_by(block_hash: block_hash)
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
    VCR.use_cassette("blocks/2") do
      create(:sync_info, name: "inauthentic_tip_block_number", value: 2)
      SyncInfo.local_inauthentic_tip_block_number
      block_hash = "0x2f8cd9eeb04e2c57c8192e77d6f5cf64630201fd23b1d7c0b89edd73033efbba"
      node_block = CkbSync::Api.instance.get_block(block_hash)
      node_block.instance_variable_set(:@proposals, ["0x98a4e0c18c"])
      CkbSync::Persist.save_block(node_block, "inauthentic")
      block = Block.find_by(block_hash: block_hash)
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
