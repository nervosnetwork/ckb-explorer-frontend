require "test_helper"

module CkbSync
  class ValidatorTest < ActiveSupport::TestCase
    test "should creat the block when the local is not saved" do
      VCR.use_cassette("blocks/10") do
        assert_difference "Block.count", 1 do
          SyncInfo.local_authentic_tip_block_number
          CkbSync::Validator.call(DEFAULT_NODE_BLOCK_HASH)
        end
      end
    end

    test "the new synced block's status should be authentic when the local is not saved" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_authentic_tip_block_number
        local_block = CkbSync::Validator.call(DEFAULT_NODE_BLOCK_HASH)

        assert_equal "authentic", local_block.status
      end
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
      previous_ckb_transaction.cell_inputs.create(previous_output: { tx_hash: CellOutput::BASE_HASH, index: 4294967295 })
      cell_output = previous_ckb_transaction.cell_outputs.create(capacity: 10**8, address: create(:address), block: block)
      cell_output.create_lock_script

      ckb_transaction = create(:ckb_transaction)
      ckb_transaction.cell_inputs.create(previous_output: { tx_hash: previous_ckb_transaction.tx_hash, index: 0 })

      fake_node_block = '{
        "transactions":[
          {"deps":[],"hash":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad5","inputs":[{"args":["0x0700000000000000"],"previous_output":{"tx_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","index":4294967295},"since":"0"}],"outputs":[{"capacity":"50000","data":"0x","lock":{"args":["0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea"],"code_hash":"0x0000000000000000000000000000000000000000000000000000000000000001"},"type":null}],"version":0,"witnesses":[]},
          {"deps":[],"hash":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad6","inputs":[{"args":["0x0700000000000000"],"previous_output":{"tx_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","index":0},"since":"0"}],"outputs":[{"capacity":"50000","data":"0x","lock":{"args":["0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea"],"code_hash":"0x0000000000000000000000000000000000000000000000000000000000000001"},"type":null}],"version":0,"witnesses":[]}
        ],
        "header":{"difficulty":"0x1000","hash":"0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea","number":"7","parent_hash":"0x1d14ede560b0da3272894c5a770cc9bfe69369231addb49d7385c101ef2851da","seal":{"nonce":"10247006937625797729","proof":"0xab0b0000d11c00001d320000da3d0000fe3f0000094b00007f580000186200004463000035650000526b0000c9790000"},"timestamp":"1555604459380","transactions_root":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad5","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":2,"uncles_hash":"0x7683fa1e36cec641dc5f1c28368c46edc2ddbfd2a2b2e4c93dc461a28f2ae124","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[],"uncles":[{"header":{"difficulty":"0x1000","hash":"0x377839c54f0a0c40b6638ac2447ba3094e48aec4366535ab40e0d95a7b68338d","number":"2","parent_hash":"0x136996eaeede9482bf47b9bce9f992c50d85bd94402a5078ea3206a90bf62e86","seal":{"nonce":"5202350849395149656","proof":"0x9d1c00006f250000d82c0000c2300000a2430000194e0000cf5a000048670000236c0000ef720000c87a0000e37f0000"},"timestamp":"1555604163266","transactions_root":"0x9defbef60635e92d77ec14a393e0e9701f87b02190bf3bbb37be760946ac4f73","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":0,"uncles_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[]},{"header":{"difficulty":"0x1000","hash":"0x6af4cb1d4b2f8d6b05be9a6d713203ae9f3191b2cab805fe1ebeec12448e737a","number":"1","parent_hash":"0x298f349c8cdfadf46e8008e72afe6da78b1ea1b7d86470ea71bb0e404c5c9d7f","seal":{"nonce":"7551133712902986728","proof":"0x81070000841f0000f7210000a022000037230000d22f00003c4900003c5300000d5a00000d640000c46d00004f7c0000"},"timestamp":"1555604128584","transactions_root":"0xbd9ed8dec5288bdeb2ebbcc4c118a8adb6baab07a44ea79843255ccda6c57915","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":0,"uncles_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[]}]
      }'

      node_block = JSON.parse(fake_node_block)

      assert_changes -> { cell_output.reload.status }, from: "live", to: "dead" do
        VCR.use_cassette("blocks/10") do
          SyncInfo.local_authentic_tip_block_number

          CkbSync::Validator.call(node_block.dig("header", "hash"))
        end
      end
    end
  end
end
