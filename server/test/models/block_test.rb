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
    should validate_presence_of(:txs_commit).on(:create)
    should validate_presence_of(:txs_proposal).on(:create)
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
    block = create_block("inauthentic")
    assert_equal "inauthentic", block.status
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.get_block("0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8").deep_stringify_keys
      block.verify!(node_block)
      assert_equal "authentic", block.status
    end
  end

  test "#verify! change block status to abandoned when block is not verified" do
    block = create_block("inauthentic", "0x419c632366c8eb9635acbb39ea085f7552ae62e1fdd480893375334a0f37d1bx")
    SyncInfo.local_authentic_tip_block_number
    assert_equal "inauthentic", block.status
    VCR.use_cassette("blocks/10") do
      node_block = CkbSync::Api.get_block("0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8").deep_stringify_keys
      assert_difference "Block.count", 1 do
        block.verify!(node_block)
      end
      assert_equal "abandoned", block.status
    end
  end

  test "#contained_accounts should return accounts under the block" do
    prepare_inauthentic_node_data
    Block.all.each do |block|
      ckb_transactions_under_the_block = block.ckb_transactions
      accounts = ckb_transactions_under_the_block.map { |ckb_transaction| ckb_transaction.accounts }.uniq.flatten
      assert_equal accounts, block.contained_accounts
    end
  end

  test "#block_hash should decodes packed string" do
    block = create_block("inauthentic")
    block_hash = block.block_hash
    assert_equal unpack_attribute(block, "block_hash"), block_hash
  end

  test "#parent_hash should decodes packed string" do
    block = create_block("inauthentic")
    parent_hash = block.parent_hash
    assert_equal unpack_attribute(block, "parent_hash"), parent_hash
  end

  test "#txs_commit should decodes packed string" do
    block = create_block("inauthentic")
    txs_commit = block.txs_commit
    assert_equal unpack_attribute(block, "txs_commit"), txs_commit
  end

  test "#txs_proposal should decodes packed string" do
    block = create_block("inauthentic")
    txs_proposal = block.txs_proposal
    assert_equal unpack_attribute(block, "txs_proposal"), txs_proposal
  end

  test "#uncles_hash should decodes packed string" do
    block = create_block("inauthentic")
    uncles_hash = block.uncles_hash
    assert_equal unpack_attribute(block, "uncles_hash"), uncles_hash
  end

  test "#uncle_block_hashes should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.get_block("0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8").deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = ["0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8".delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
      block = Block.find_by(block_hash: packed_block_hash)
      uncle_block_hashes = block.uncle_block_hashes
      assert_equal unpack_array_attribute(block, "uncle_block_hashes", block.uncles_count, ENV["DEFAULT_HASH_LENGTH"]), uncle_block_hashes
    end
  end

  test "#uncle_block_hashes should return super when uncle block hashes is empty" do
    block = create_block("inauthentic")
    uncle_block_hashes = block.uncle_block_hashes
    assert_equal unpack_array_attribute(block, "uncle_block_hashes", block.uncles_count, ENV["DEFAULT_HASH_LENGTH"]), uncle_block_hashes
  end

  test "#proposal_transactions should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.get_block("0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8").deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = ["0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8".delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
      block = Block.find_by(block_hash: packed_block_hash)
      proposal_transactions = block.proposal_transactions
      assert_equal unpack_array_attribute(block, "proposal_transactions", block.proposal_transactions_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposal_transactions
    end
  end

  test "#proposal_transactions should return super when proposal transactions is empty" do
    block = create_block("inauthentic")
    proposal_transactions = block.proposal_transactions
    assert_equal unpack_array_attribute(block, "proposal_transactions", block.proposal_transactions_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), proposal_transactions
  end

  test "#proposal_transactions= should encode proposal_transactions" do
    block = create_block("inauthentic")
    block.proposal_transactions = ["0xeab419c632", "0xeab410c634"]
    block.save
    assert_equal unpack_array_attribute(block, "proposal_transactions", block.proposal_transactions_count, ENV["DEFAULT_SHORT_HASH_LENGTH"]), block.proposal_transactions
  end

  test "#miner_hash should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.get_block("0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8").deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = ["0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8".delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
      block = Block.find_by(block_hash: packed_block_hash)
      miner_hash = block.miner_hash
      assert_equal unpack_attribute(block, "miner_hash"), miner_hash
    end
  end
end
