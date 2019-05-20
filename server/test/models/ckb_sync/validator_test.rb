require "test_helper"

module CkbSync
  class ValidatorTest < ActiveSupport::TestCase
    setup do
      create(:sync_info, name: "authentic_tip_block_number", value: 10)
      create(:sync_info, name: "inauthentic_tip_block_number", value: 10)
    end

    test "should change the existing block status to authentic when it is authenticated" do
      local_block = create(:block)
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_authentic_tip_block_number
        assert_changes -> { local_block.reload.status }, from: "inauthentic", to: "authentic" do
          CkbSync::Validator.call(DEFAULT_NODE_BLOCK_HASH)
        end
      end
    end

    test "should create a new block when it is inauthenticated" do
      create(:block, block_hash: "0x419c632366c8eb9635acbb39ea085f7552ae62e1fdd480893375334a0f37d1bx")
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_authentic_tip_block_number
        assert_difference "Block.count", 1 do
          CkbSync::Validator.call(DEFAULT_NODE_BLOCK_HASH)
        end
      end
    end

    test "should change the existing block status to abandoned when it is inauthenticated" do
      local_block = create(:block, block_hash: "0x419c632366c8eb9635acbb39ea085f7552ae62e1fdd480893375334a0f37d1bx")
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_authentic_tip_block_number
        assert_changes -> { local_block.reload.status }, from: "inauthentic", to: "abandoned" do
          CkbSync::Validator.call(DEFAULT_NODE_BLOCK_HASH)
        end
      end
    end

    test "should change cell output status from live to dead when it is used" do
      block = create(:block, :with_block_hash, :with_block_number)
      previous_ckb_transaction = create(:ckb_transaction, block: block)
      previous_ckb_transaction.cell_inputs.create(previous_output: { cell: nil, block_hash: block.block_hash })
      cell_output = previous_ckb_transaction.cell_outputs.create(capacity: 10**8, address: create(:address), block: block)
      cell_output.create_lock_script

      ckb_transaction = create(:ckb_transaction)
      ckb_transaction.cell_inputs.create(previous_output: { cell: { tx_hash: previous_ckb_transaction.tx_hash, index: 0 }, block_hash: block.block_hash })

      node_block = JSON.parse(fake_node_block(DEFAULT_NODE_BLOCK_HASH))

      assert_changes -> { cell_output.reload.status }, from: "live", to: "dead" do
        VCR.use_cassette("blocks/10") do
          SyncInfo.local_authentic_tip_block_number

          CkbSync::Validator.call(node_block.dig("header", "hash"))
        end
      end
    end
  end
end
