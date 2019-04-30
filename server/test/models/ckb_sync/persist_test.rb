require "test_helper"
require "minitest/autorun"

module CkbSync
  class PersistTest < ActiveSupport::TestCase
    test ".call should invoke save_block method " do
      node_block = nil
      VCR.use_cassette("blocks/10") do
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
      end

      VCR.use_cassette("blocks/10") do
        CkbSync::Persist.expects(:save_block).with(node_block, "inauthentic")
        CkbSync::Persist.call(DEFAULT_NODE_BLOCK_HASH, "inauthentic")
      end
    end

    test ".save_block should create one block" do
      assert_difference "Block.count", 1 do
        VCR.use_cassette("blocks/10") do
          SyncInfo.local_inauthentic_tip_block_number
          node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
          set_default_lock_params(node_block: node_block)

          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test "after .save_block generated block's ckb_transactions_count should equal to transactions count" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal node_block["transactions"].size, local_block.ckb_transactions_count
      end
    end

    test ".save_block should create uncle_blocks" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_uncle_blocks = node_block["uncles"]

        assert_difference "UncleBlock.count", node_block_uncle_blocks.size do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create ckb_transactions" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]

        assert_difference "CkbTransaction.count", node_block_transactions.count do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create cell_inputs" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_cell_inputs_count = node_block_transactions.reduce(0) { |memo, commit_transaction| memo + commit_transaction["inputs"].size }

        assert_difference "CellInput.count", node_cell_inputs_count do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create cell_outputs" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_cell_outputs_count = node_block_transactions.reduce(0) { |memo, commit_transaction| memo + commit_transaction["outputs"].size }

        assert_difference "CellOutput.count", node_cell_outputs_count do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create addresses" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_cell_outputs = node_block_transactions.map { |commit_transaction| commit_transaction["outputs"] }.flatten
        node_lock_scripts = node_cell_outputs.map { |cell_output| cell_output["lock"] }.uniq

        assert_difference "Address.count", node_lock_scripts.size do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create lock_scripts" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_cell_outputs = node_block_transactions.map { |commit_transaction| commit_transaction["outputs"] }.flatten

        assert_difference "LockScript.count", node_cell_outputs.size do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create type_scripts" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_cell_outputs = node_block_transactions.map { |commit_transaction| commit_transaction["outputs"] }.flatten
        node_cell_outputs_with_type_script = node_cell_outputs.select { |cell_output| cell_output["type"].present? }

        assert_difference "TypeScript.count", node_cell_outputs_with_type_script.size do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block created block's attribute value should equal with the node block's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        formatted_node_block = format_node_block(node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_hash = local_block.attributes.select { |attribute| attribute.in?(%w(difficulty block_hash number parent_hash seal timestamp transactions_root proposals_root uncles_count uncles_hash version witnesses_root proposals)) }
        local_block_hash["hash"] = local_block_hash.delete("block_hash")
        local_block_hash["number"] = local_block_hash["number"].to_s
        local_block_hash["timestamp"] = local_block_hash["timestamp"].to_s

        assert_equal formatted_node_block.sort, local_block_hash.sort
      end
    end

    test ".save_block created block's proposals_count should equal with the node block's proposals size" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal node_block["proposals"].size, local_block.proposals_count
      end
    end

    test ".save_block created uncle_block's attribute value should equal with the node uncle_block's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_uncle_blocks = node_block["uncles"]
        formatted_node_uncle_blocks = node_uncle_blocks.map { |uncle_block| format_node_block(uncle_block).sort }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_uncle_blocks =
          local_block.uncle_blocks.map do |uncle_block|
            uncle_block =
              uncle_block.attributes.select do |attribute|
                attribute.in?(%w(difficulty block_hash number parent_hash seal timestamp transactions_root proposals_root uncles_count uncles_hash version witnesses_root proposals))
              end
            uncle_block["hash"] = uncle_block.delete("block_hash")
            uncle_block["number"] = uncle_block["number"].to_s
            uncle_block["timestamp"] = uncle_block["timestamp"].to_s
            uncle_block.sort
          end

        assert_equal formatted_node_uncle_blocks.sort, local_uncle_blocks.sort
      end
    end

    test ".save_block created unlce_block's proposals_count should equal with the node uncle_block's proposals size" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_uncle_blocks = node_block["uncles"]
        node_uncle_blocks_count = node_uncle_blocks.reduce(0) { |memo, uncle_block| memo + uncle_block["proposals"].size }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_uncle_blocks = local_block.uncle_blocks
        local_uncle_blocks_count = local_uncle_blocks.reduce(0) { |memo, uncle_block| memo + uncle_block.proposals.size }

        assert_equal node_uncle_blocks_count, local_uncle_blocks_count
      end
    end

    test ".save_block created ckb_transaction's attribute value should equal with the node commit_transaction's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        formatted_node_block_transactions = node_block_transactions.map { |commit_transaction| format_node_block_commit_transaction(commit_transaction).sort }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions =
          local_block.ckb_transactions.map do |ckb_transaction|
            ckb_transaction = ckb_transaction.attributes.select { |attribute| attribute.in?(%w(tx_hash deps version witnesses)) }
            ckb_transaction["hash"] = ckb_transaction.delete("tx_hash")
            ckb_transaction.sort
          end

        assert_equal formatted_node_block_transactions, local_ckb_transactions
      end
    end

    test ".save_block created cell_inputs's attribute value should equal with the node cell_inputs's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_block_cell_inputs = node_block_transactions.map { |commit_transaciont| commit_transaciont["inputs"].map(&:sort) }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_transactions = local_block.ckb_transactions
        local_block_cell_inputs = local_block_transactions.map { |commit_transaciont| commit_transaciont.cell_inputs.map { |cell_input| cell_input.attributes.select { |attribute| attribute.in?(%w(args previous_output since)) }.sort } }.flatten

        assert_equal node_block_cell_inputs, local_block_cell_inputs
      end
    end

    test ".save_block created cell_outputs's attribute value should equal with the node cell_outputs's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_block_cell_outputs = node_block_transactions.map { |commit_transaciont| commit_transaciont["outputs"].map { |output| format_node_block_cell_output(output).sort } }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_transactions = local_block.ckb_transactions
        local_block_cell_outputs = local_block_transactions.map { |commit_transaciont|
          commit_transaciont.cell_outputs.map do |cell_output|
            attributes = cell_output.attributes
            attributes["capacity"] = attributes["capacity"].to_i.to_s
            attributes.select { |attribute| attribute.in?(%w(capacity data)) }.sort
          end
        }.flatten

        assert_equal node_block_cell_outputs, local_block_cell_outputs
      end
    end

    test ".save_block created lock_script's attribute value should equal with the node lock_script's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_block_lock_scripts = node_block_transactions.map { |commit_transaciont| commit_transaciont["outputs"].map { |output| output["lock"] }.sort }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_transactions = local_block.ckb_transactions
        local_block_lock_scripts = local_block_transactions.map { |commit_transaciont| commit_transaciont.cell_outputs.map { |cell_output| cell_output.lock_script.attributes.select { |attribute| attribute.in?(%w(args code_hash)) } }.sort }.flatten

        assert_equal node_block_lock_scripts, local_block_lock_scripts
      end
    end

    test ".save_block created type_script's attribute value should equal with the node type_script's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        fake_node_block_with_type_script(node_block)
        node_block_transactions = node_block["transactions"]
        node_block_type_scripts = node_block_transactions.map { |commit_transaciont| commit_transaciont["outputs"].map { |output| output["type"] }.sort }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_transactions = local_block.ckb_transactions
        local_block_type_scripts = local_block_transactions.map { |commit_transaciont| commit_transaciont.cell_outputs.map { |cell_output| cell_output.type_script.attributes.select { |attribute| attribute.in?(%w(args code_hash)) } }.sort }.flatten

        assert_equal node_block_type_scripts, local_block_type_scripts
      end
    end

    test ".save_block generated transactions should has correct display input" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        node_block_cell_inputs = node_block_transactions.map { |commit_transaction| commit_transaction["inputs"] }.flatten
        node_display_inputs = node_block_cell_inputs.map(&method(:build_display_input_from_node_input))

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions
        local_block_cell_inputs = local_ckb_transactions.map(&:display_inputs).flatten

        assert_equal node_display_inputs, local_block_cell_inputs
      end
    end

    test ".save_block generated transactions should has correct display input when previous_transaction_hash is not base" do
      SyncInfo.local_inauthentic_tip_block_number
      previous_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script, tx_hash: "0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea")

      fake_node_block = '{
        "transactions":[
          {"deps":[],"hash":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad5","inputs":[{"args":["0x0700000000000000"],"previous_output":{"tx_hash":"0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea","index":0},"since":"0"}],"outputs":[{"capacity":"50000","data":"0x","lock":{"args":["0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea"],"code_hash":"0x8bddddc3ae2e09c13106634d012525aa32fc47736456dba11514d352845e561d"},"type":null}],"version":0,"witnesses":[]}
        ],
        "header":{"difficulty":"0x1000","hash":"0x267959408f66f8afd3723e0826a39a884b845c84fdc2ebbf519cb1e22ab07ec6","number":"7","parent_hash":"0x1d14ede560b0da3272894c5a770cc9bfe69369231addb49d7385c101ef2851da","seal":{"nonce":"10247006937625797729","proof":"0xab0b0000d11c00001d320000da3d0000fe3f0000094b00007f580000186200004463000035650000526b0000c9790000"},"timestamp":"1555604459380","transactions_root":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad5","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":2,"uncles_hash":"0x7683fa1e36cec641dc5f1c28368c46edc2ddbfd2a2b2e4c93dc461a28f2ae124","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[],"uncles":[{"header":{"difficulty":"0x1000","hash":"0x377839c54f0a0c40b6638ac2447ba3094e48aec4366535ab40e0d95a7b68338d","number":"2","parent_hash":"0x136996eaeede9482bf47b9bce9f992c50d85bd94402a5078ea3206a90bf62e86","seal":{"nonce":"5202350849395149656","proof":"0x9d1c00006f250000d82c0000c2300000a2430000194e0000cf5a000048670000236c0000ef720000c87a0000e37f0000"},"timestamp":"1555604163266","transactions_root":"0x9defbef60635e92d77ec14a393e0e9701f87b02190bf3bbb37be760946ac4f73","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":0,"uncles_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[]},{"header":{"difficulty":"0x1000","hash":"0x6af4cb1d4b2f8d6b05be9a6d713203ae9f3191b2cab805fe1ebeec12448e737a","number":"1","parent_hash":"0x298f349c8cdfadf46e8008e72afe6da78b1ea1b7d86470ea71bb0e404c5c9d7f","seal":{"nonce":"7551133712902986728","proof":"0x81070000841f0000f7210000a022000037230000d22f00003c4900003c5300000d5a00000d640000c46d00004f7c0000"},"timestamp":"1555604128584","transactions_root":"0xbd9ed8dec5288bdeb2ebbcc4c118a8adb6baab07a44ea79843255ccda6c57915","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":0,"uncles_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[]}]
        }'
      node_block = JSON.parse(fake_node_block)

      local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
      local_ckb_transactions = local_block.ckb_transactions
      local_block_cell_inputs = local_ckb_transactions.map(&:display_inputs).flatten
      previous_output = previous_transaction.cell_outputs.order(:id)[0]
      node_display_inputs = [{ id: previous_output.id, from_cellbase: false, capacity: previous_output.capacity.to_s, address_hash: previous_output.address_hash }.deep_stringify_keys]

      assert_equal node_display_inputs, local_block_cell_inputs
    end

    test ".save_block generated transactions should has correct display output" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        node_block_transactions = node_block["transactions"]
        node_block_cell_outputs = node_block_transactions.map { |commit_transaction| commit_transaction["outputs"] }.flatten
        node_display_outputs = node_block_cell_outputs.map(&method(:build_display_info_from_node_output))

        local_ckb_transactions = local_block.ckb_transactions
        local_block_cell_outputs = local_ckb_transactions.map(&:display_outputs).flatten

        assert_equal node_display_outputs, local_block_cell_outputs
      end
    end

    test ".save_block generated transactions should has correct transaction fee" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        transactions_fee = node_block_transactions.reduce(0) { |memo, commit_transaction| memo + Utils::CkbUtils.transaction_fee(commit_transaction) }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions
        local_ckb_transactions_fee = local_ckb_transactions.reduce(0) { |memo, ckb_transaction| memo + ckb_transaction.transaction_fee }

        assert_equal transactions_fee, local_ckb_transactions_fee
      end
    end

    test ".save_block generated block should has correct total transaction fee" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal local_block.ckb_transactions.sum(:transaction_fee), local_block.total_transaction_fee
      end
    end

    test ".save_block generated block should has correct total capacity" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal Utils::CkbUtils.total_cell_capacity(node_block["transactions"]), local_block.total_cell_capacity
      end
    end

    test ".save_block generated block's miner hash should be nil when lock args is invalid" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block, args: ["c30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad1"])

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_nil local_block.miner_hash
      end
    end

    test ".save_block generated block's miner hash should be nil when binary hash is empty" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_nil local_block.miner_hash
      end
    end

    test ".save_block generated block's miner hash should be nil when binary hash is invalid" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block, code_hash: "0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea")

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_nil local_block.miner_hash
      end
    end

    test ".save_block generated block should has correct miner hash when miner use default lock script " do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block, code_hash: LockScript::SYSTEM_SCRIPT_CELL_HASH)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal Utils::CkbUtils.miner_hash(node_block["transactions"].first), local_block.miner_hash
      end
    end

    test ".save_block generated block should has correct reward" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal Utils::CkbUtils.miner_reward(node_block["transactions"].first), local_block.reward
      end
    end

    test ".save_block generated block should has correct cell consumed" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal Utils::CkbUtils.block_cell_consumed(node_block["transactions"]), local_block.cell_consumed
      end
    end

    test "should generate the correct number of ckb transactions" do
      SyncInfo.local_inauthentic_tip_block_number

      fake_node_block = '{
        "transactions":[
          {"deps":[],"hash":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad5","inputs":[{"args":["0x0700000000000000"],"previous_output":{"tx_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","index":4294967295},"since":"0"}],"outputs":[{"capacity":"50000","data":"0x","lock":{"args":["0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea"],"code_hash":"0x0000000000000000000000000000000000000000000000000000000000000001"},"type":null}],"version":0,"witnesses":[]},
          {"deps":[],"hash":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad4","inputs":[{"args":["0x0700000000000000"],"previous_output":{"tx_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","index":4294967295},"since":"0"}],"outputs":[{"capacity":"50000","data":"0x","lock":{"args":["0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea"],"code_hash":"0x0000000000000000000000000000000000000000000000000000000000000001"},"type":null}],"version":0,"witnesses":[]}
        ],
        "header":{"difficulty":"0x1000","hash":"0x267959408f66f8afd3723e0826a39a884b845c84fdc2ebbf519cb1e22ab07ec6","number":"7","parent_hash":"0x1d14ede560b0da3272894c5a770cc9bfe69369231addb49d7385c101ef2851da","seal":{"nonce":"10247006937625797729","proof":"0xab0b0000d11c00001d320000da3d0000fe3f0000094b00007f580000186200004463000035650000526b0000c9790000"},"timestamp":"1555604459380","transactions_root":"0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad5","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":2,"uncles_hash":"0x7683fa1e36cec641dc5f1c28368c46edc2ddbfd2a2b2e4c93dc461a28f2ae124","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[],"uncles":[{"header":{"difficulty":"0x1000","hash":"0x377839c54f0a0c40b6638ac2447ba3094e48aec4366535ab40e0d95a7b68338d","number":"2","parent_hash":"0x136996eaeede9482bf47b9bce9f992c50d85bd94402a5078ea3206a90bf62e86","seal":{"nonce":"5202350849395149656","proof":"0x9d1c00006f250000d82c0000c2300000a2430000194e0000cf5a000048670000236c0000ef720000c87a0000e37f0000"},"timestamp":"1555604163266","transactions_root":"0x9defbef60635e92d77ec14a393e0e9701f87b02190bf3bbb37be760946ac4f73","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":0,"uncles_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[]},{"header":{"difficulty":"0x1000","hash":"0x6af4cb1d4b2f8d6b05be9a6d713203ae9f3191b2cab805fe1ebeec12448e737a","number":"1","parent_hash":"0x298f349c8cdfadf46e8008e72afe6da78b1ea1b7d86470ea71bb0e404c5c9d7f","seal":{"nonce":"7551133712902986728","proof":"0x81070000841f0000f7210000a022000037230000d22f00003c4900003c5300000d5a00000d640000c46d00004f7c0000"},"timestamp":"1555604128584","transactions_root":"0xbd9ed8dec5288bdeb2ebbcc4c118a8adb6baab07a44ea79843255ccda6c57915","proposals_root":"0x0000000000000000000000000000000000000000000000000000000000000000","uncles_count":0,"uncles_hash":"0x0000000000000000000000000000000000000000000000000000000000000000","version":0,"witnesses_root":"0x0000000000000000000000000000000000000000000000000000000000000000"},"proposals":[]}]
        }'

      node_block = JSON.parse(fake_node_block)
      assert_difference "CkbTransaction.count", 2 do
        CkbSync::Persist.save_block(node_block, "inauthentic")
      end
    end
  end
end
