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
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test "after .save_block generated block's ckb_transactions_count should equal to commit_transactions count" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        assert_equal node_block["commit_transactions"].size, local_block.ckb_transactions_count
      end
    end

    test ".save_block should create uncle_blocks" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
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
        node_block_commit_transactions = node_block["commit_transactions"]

        assert_difference "CkbTransaction.count", node_block_commit_transactions.count do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create cell_inputs" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_cell_inputs_count = node_block_commit_transactions.reduce(0) { |memo, commit_transaction| memo += commit_transaction["inputs"].size }

        assert_difference "CellInput.count", node_cell_inputs_count do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create cell_outputs" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_cell_outputs_count = node_block_commit_transactions.reduce(0) { |memo, commit_transaction| memo += commit_transaction["outputs"].size }

        assert_difference "CellOutput.count", node_cell_outputs_count do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create accounts" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_cell_outputs = node_block_commit_transactions.map { |commit_transaction| commit_transaction["outputs"] }.flatten
        node_lock_scripts = node_cell_outputs.map { |cell_output| cell_output["lock"] }.uniq

        assert_difference "Account.count", node_lock_scripts.size do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create lock_scripts" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_cell_outputs = node_block_commit_transactions.map { |commit_transaction| commit_transaction["outputs"] }.flatten

        assert_difference "LockScript.count", node_cell_outputs.size do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block should create type_scripts" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_cell_outputs = node_block_commit_transactions.map { |commit_transaction| commit_transaction["outputs"] }.flatten
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
        formatted_node_block = format_node_block(node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_hash = local_block.attributes.select { |attribute| attribute.in?(%w(difficulty block_hash number parent_hash seal timestamp txs_commit txs_proposal uncles_count uncles_hash version witnesses_root proposal_transactions)) }
        local_block_hash["hash"] = local_block_hash.delete("block_hash")

        assert_equal formatted_node_block.sort, local_block_hash.sort
      end
    end

    test ".save_block created block's proposal_transactions_count should equal with the node block's proposal_transactions size" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal node_block["proposal_transactions"].size, local_block.proposal_transactions_count
      end
    end

    test ".save_block created uncle_block's attribute value should equal with the node uncle_block's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_uncle_blocks = node_block["uncles"]
        formatted_node_uncle_blocks = node_uncle_blocks.map { |uncle_block| format_node_block(uncle_block).sort }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_uncle_blocks = local_block.uncle_blocks.map do  |uncle_block|
          uncle_block = uncle_block.attributes.select { |attribute| attribute.in?(%w(difficulty block_hash number parent_hash seal timestamp txs_commit txs_proposal uncles_count uncles_hash version witnesses_root proposal_transactions)) }
          uncle_block["hash"] = uncle_block.delete("block_hash")
          uncle_block.sort
        end

        assert_equal formatted_node_uncle_blocks, local_uncle_blocks.sort
      end
    end

    test ".save_block created unlce_block's proposal_transactions_count should equal with the node uncle_block's proposal_transactions size" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_uncle_blocks = node_block["uncles"]
        node_uncle_blocks_count = node_uncle_blocks.reduce(0) { |memo, uncle_block| memo += uncle_block["proposal_transactions"].size }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_uncle_blocks = local_block.uncle_blocks
        local_uncle_blocks_count = local_uncle_blocks.reduce(0) { |memo, uncle_block| memo += uncle_block.proposal_transactions.size }

        assert_equal node_uncle_blocks_count, local_uncle_blocks_count
      end
    end

    test ".save_block created ckb_transaction's attribute value should equal with the node commit_transaciont's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        formatted_node_block_commit_transactions = node_block_commit_transactions.map { |commit_transaction| format_node_block_commit_transaction(commit_transaction).sort }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions.map do  |ckb_transaction|
          ckb_transaction = ckb_transaction.attributes.select { |attribute| attribute.in?(%w(tx_hash deps version witnesses)) }
          ckb_transaction["hash"] = ckb_transaction.delete("tx_hash")
          ckb_transaction.sort
        end

        assert_equal formatted_node_block_commit_transactions, local_ckb_transactions
      end
    end

    test ".save_block created cell_inputs's attribute value should equal with the node cell_inputs's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_block_cell_inputs = node_block_commit_transactions.map { |commit_transaciont| commit_transaciont["inputs"].map(&:sort) }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_commit_transactions = local_block.ckb_transactions
        local_block_cell_inputs  = local_block_commit_transactions.map { |commit_transaciont| commit_transaciont.cell_inputs.map { |cell_input| cell_input.attributes.select { |attribute| attribute.in?(%w(args previous_output)) }.sort }}.flatten

        assert_equal node_block_cell_inputs, local_block_cell_inputs
      end
    end

    test ".save_block created cell_outputs's attribute value should equal with the node cell_outputs's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_block_cell_outputs = node_block_commit_transactions.map { |commit_transaciont| commit_transaciont["outputs"].map { |output| format_node_block_cell_output(output).sort } }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_commit_transactions = local_block.ckb_transactions
        local_block_cell_outputs  = local_block_commit_transactions.map { |commit_transaciont| commit_transaciont.cell_outputs.map { |cell_output| cell_output.attributes.select { |attribute| attribute.in?(%w(capacity data)) }.sort }}.flatten

        assert_equal node_block_cell_outputs, local_block_cell_outputs
      end
    end

    test ".save_block created lock_script's attribute value should equal with the node lock_script's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_block_lock_scripts = node_block_commit_transactions.map { |commit_transaciont| commit_transaciont["outputs"].map { |output| output["lock"] }.sort }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_commit_transactions = local_block.ckb_transactions
        local_block_lock_scripts = local_block_commit_transactions.map { |commit_transaciont| commit_transaciont.cell_outputs.map { |cell_output| cell_output.lock_script.attributes.select { |attribute| attribute.in?(%w(args binary_hash version)) } }.sort }.flatten

        assert_equal node_block_lock_scripts, local_block_lock_scripts
      end
    end

    test ".save_block created type_script's attribute value should equal with the node type_script's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        fake_node_block_with_type_script(node_block)
        node_block_commit_transactions = node_block["commit_transactions"]
        node_block_type_scripts = node_block_commit_transactions.map { |commit_transaciont| commit_transaciont["outputs"].map { |output| output["type"] }.sort }.flatten

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_commit_transactions = local_block.ckb_transactions
        local_block_type_scripts = local_block_commit_transactions.map { |commit_transaciont| commit_transaciont.cell_outputs.map { |cell_output| cell_output.type_script.attributes.select { |attribute| attribute.in?(%w(args binary_hash version)) } }.sort }.flatten

        assert_equal node_block_type_scripts, local_block_type_scripts
      end
    end

    test ".save_block generated transactions should has correct display input" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        node_block_cell_inputs = node_block_commit_transactions.map { |commit_transaciont| commit_transaciont["inputs"] }.flatten
        node_display_inputs = node_block_cell_inputs.map { |input| build_display_input_from_node_input(input) }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions
        local_block_cell_inputs = local_ckb_transactions.map { |ckb_transaction| ckb_transaction.display_inputs }.flatten

        assert_equal node_display_inputs, local_block_cell_inputs
      end
    end

    test ".save_block generated transactions should has correct display output" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        node_block_commit_transactions = node_block["commit_transactions"]
        node_block_cell_outputs = node_block_commit_transactions.map { |commit_transaciont| commit_transaciont["outputs"] }.flatten
        node_display_outputs = node_block_cell_outputs.map { |output| build_display_info_from_node_output(output) }

        local_ckb_transactions = local_block.ckb_transactions
        local_block_cell_outputs = local_ckb_transactions.map { |ckb_transaction| ckb_transaction.display_outputs }.flatten

        assert_equal node_display_outputs, local_block_cell_outputs
      end
    end

    test ".save_block generated transactions should has correct transaction fee" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        node_block_commit_transactions = node_block["commit_transactions"]
        commit_transactions_fee = node_block_commit_transactions.reduce(0) { |memo, commit_transaciont| memo += CKB::Utils.transaction_fee(commit_transaciont) }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions
        local_ckb_transactions_fee = local_ckb_transactions.reduce(0) { |memo, ckb_transaction| memo += ckb_transaction.transaction_fee }

        assert_equal commit_transactions_fee, local_ckb_transactions_fee
      end
    end

    test ".save_block generated block should has correct total transaction fee" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CKB::Utils.total_transaction_fee(node_block["commit_transactions"]), local_block.total_transaction_fee
      end
    end

    test ".save_block generated block should has correct total capacity" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CKB::Utils.total_cell_capacity(node_block["commit_transactions"]), local_block.total_cell_capacity
      end
    end

    test ".save_block generated block should has correct miner hash" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CKB::Utils.miner_hash(node_block["commit_transactions"].first), local_block.miner_hash
      end
    end

    test ".save_block generated block should has correct reward" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CKB::Utils.miner_reward(node_block["commit_transactions"].first), local_block.reward
      end
    end

    test ".save_block generated block should has correct cell consumed" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CKB::Utils.block_cell_consumed(node_block["commit_transactions"]), local_block.cell_consumed
      end
    end
  end
end
