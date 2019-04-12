require "test_helper"
require 'sidekiq/testing'

class CkbTransactionTest < ActiveSupport::TestCase
  context "associations" do
    should belong_to(:block)
    should have_many(:account_books)
    should have_many(:accounts).
      through(:account_books)
    should have_many(:cell_inputs)
    should have_many(:cell_outputs)
  end

  context "validations" do
    should validate_presence_of(:transaction_fee)
    should validate_presence_of(:status)
    should validate_numericality_of(:transaction_fee).
      is_greater_than_or_equal_to(0)
  end

  test "#binary_hash should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      ckb_transaction = block.ckb_transactions.first
      assert_equal unpack_attribute(ckb_transaction, "tx_hash"), ckb_transaction.tx_hash
    end
  end

  test "change ckb transaction to abandoned when it's block has been abandoned" do
    Sidekiq::Testing.inline!

    block = create(:block, :with_ckb_transactions, block_hash: "0x419c632366c8eb9635acbb39ea085f7552ae62e1fdd480893375334a0f37d1bx")
    ckb_transactions = block.ckb_transactions

    assert_changes -> { ckb_transactions.reload.pluck(:status).uniq }, from: ["inauthentic"], to: ["abandoned"] do
      SyncInfo.local_authentic_tip_block_number
      VCR.use_cassette("blocks/10") do
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        block.verify!(node_block)
      end
    end
  end

  test "change ckb transaction to authentic when it's block has been authenticated" do
    Sidekiq::Testing.inline!

    block = create(:block, :with_ckb_transactions)
    ckb_transactions = block.ckb_transactions

    assert_changes -> { ckb_transactions.reload.pluck(:status).uniq }, from: ["inauthentic"], to: ["authentic"] do
      SyncInfo.local_authentic_tip_block_number
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        block.verify!(node_block)
      end
    end
  end
end
