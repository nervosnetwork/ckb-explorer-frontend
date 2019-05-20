require "test_helper"
require "minitest/autorun"

module CkbSync
  class PersistTest < ActiveSupport::TestCase
    setup do
      Faker::Number.unique.clear
      create_list(:sync_info, 15, name: "inauthentic_tip_block_number")
    end

    test ".call should invoke save_block method " do
      node_block = nil
      VCR.use_cassette("blocks/10") do
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
          node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
          set_default_lock_params(node_block: node_block)

          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test "after .save_block generated block's ckb_transactions_count should equal to transactions count" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal node_block["transactions"].size, local_block.ckb_transactions_count
      end
    end

    test ".save_block should create uncle_blocks" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        formatted_node_block = format_node_block(node_block)
        formatted_node_block["witnesses_root"] = formatted_node_block.delete("witness_root")

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_block_hash = local_block.attributes.select { |attribute| attribute.in?(%w(difficulty block_hash number parent_hash seal timestamp transactions_root proposals_hash uncles_count uncles_hash version witnesses_root proposals epoch)) }
        local_block_hash["hash"] = local_block_hash.delete("block_hash")
        local_block_hash["number"] = local_block_hash["number"].to_s
        local_block_hash["version"] = local_block_hash["version"].to_s
        local_block_hash["uncles_count"] = local_block_hash["uncles_count"].to_s
        local_block_hash["epoch"] = local_block_hash["epoch"].to_s
        local_block_hash["timestamp"] = local_block_hash["timestamp"].to_s

        assert_equal formatted_node_block.sort, local_block_hash.sort
      end
    end

    test ".save_block created block's proposals_count should equal with the node block's proposals size" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal node_block["proposals"].size, local_block.proposals_count
      end
    end

    test ".save_block created uncle_block's attribute value should equal with the node uncle_block's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_uncle_blocks = node_block["uncles"]
        formatted_node_uncle_blocks = node_uncle_blocks.map { |uncle_block| format_node_block(uncle_block).sort }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_uncle_blocks =
          local_block.uncle_blocks.map do |uncle_block|
            uncle_block =
              uncle_block.attributes.select do |attribute|
                attribute.in?(%w(difficulty block_hash number parent_hash seal timestamp transactions_root proposals_hash uncles_count uncles_hash version witnesses_root proposals epoch))
              end
            uncle_block["hash"] = uncle_block.delete("block_hash")
            uncle_block["epoch"] = uncle_block["epoch"].to_s
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        formatted_node_block_transactions = node_block_transactions.map { |commit_transaction| format_node_block_commit_transaction(commit_transaction).sort }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions =
          local_block.ckb_transactions.map do |ckb_transaction|
            ckb_transaction = ckb_transaction.attributes.select { |attribute| attribute.in?(%w(tx_hash deps version witnesses)) }
            ckb_transaction["hash"] = ckb_transaction.delete("tx_hash")
            ckb_transaction["version"] = ckb_transaction["version"].to_s
            ckb_transaction.sort
          end

        assert_equal formatted_node_block_transactions, local_ckb_transactions
      end
    end

    test ".save_block created cell_inputs's attribute value should equal with the node cell_inputs's attribute value" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
      previous_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script, tx_hash: "0x598315db9c7ba144cca74d2e9122ac9b3a3da1641b2975ae321d91ec34f1c0e3")
      node_block = JSON.parse(fake_node_block)

      VCR.use_cassette("blocks/10") do
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions
        local_block_cell_inputs = local_ckb_transactions.map(&:display_inputs).flatten.compact
        previous_output = previous_transaction.cell_outputs.order(:id)[0]
        node_display_inputs = [{ id: previous_output.id, from_cellbase: false, capacity: previous_output.capacity.to_s, address_hash: previous_output.address_hash }.deep_stringify_keys]

        assert_equal node_display_inputs, local_block_cell_inputs
      end
    end

    test ".save_block generated transactions should has correct display output" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
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
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)
        node_block_transactions = node_block["transactions"]
        transactions_fee = node_block_transactions.reduce(0) { |memo, commit_transaction| memo + CkbUtils.transaction_fee(commit_transaction).to_i }

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions
        local_ckb_transactions_fee = local_ckb_transactions.reduce(0) { |memo, ckb_transaction| memo + ckb_transaction.transaction_fee }

        assert_equal transactions_fee, local_ckb_transactions_fee
      end
    end

    test ".save_block generated block should has correct total transaction fee" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal local_block.ckb_transactions.sum(:transaction_fee), local_block.total_transaction_fee
      end
    end

    test ".save_block generated block should has correct total capacity" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CkbUtils.total_cell_capacity(node_block["transactions"]), local_block.total_cell_capacity
      end
    end

    test ".save_block generated block's miner hash should be nil when lock args is invalid" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block, args: ["c30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad1"])

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_nil local_block.miner_hash
      end
    end

    test ".save_block generated block's miner hash should be nil when binary hash is empty" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_nil local_block.miner_hash
      end
    end

    test ".save_block generated block's miner hash should be nil when binary hash is invalid" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block, code_hash: "0x598315db9c7ba144cca74d2e9122ac9b3a3da1641b2975ae321d91ec34f1c0e3")

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_nil local_block.miner_hash
      end
    end

    test ".save_block generated block should has correct miner hash when miner use default lock script " do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block, code_hash: ENV["CODE_HASH"])

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CkbUtils.miner_hash(node_block["transactions"].first), local_block.miner_hash
      end
    end

    test ".save_block generated block should has correct reward" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CkbUtils.miner_reward(node_block.dig("header", "epoch")).to_i, local_block.reward
      end
    end

    test ".save_block generated block should has correct cell consumed" do
      VCR.use_cassette("blocks/10") do
        SyncInfo.local_inauthentic_tip_block_number
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
        set_default_lock_params(node_block: node_block)

        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        assert_equal CkbUtils.block_cell_consumed(node_block["transactions"]), local_block.cell_consumed
      end
    end

    test "should generate the correct number of ckb transactions" do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = JSON.parse(fake_node_block)
      VCR.use_cassette("blocks/10") do
        assert_difference "CkbTransaction.count", 2 do
          CkbSync::Persist.save_block(node_block, "inauthentic")
        end
      end
    end

    test ".save_block generated transactions's display inputs should be nil when previous_transaction_hash is not exist" do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = JSON.parse(fake_node_block)
      VCR.use_cassette("blocks/10") do
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions
        local_block_cell_inputs = local_ckb_transactions.map(&:display_inputs).flatten

        assert local_block_cell_inputs.any?(&:nil?)
        assert_equal 0, local_ckb_transactions.map(&:transaction_fee).reduce(&:+)
      end
    end

    test ".save_block generated transactions's display inputs status should be ungenerated when previous_transaction_hash is not exist" do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = JSON.parse(fake_node_block)
      VCR.use_cassette("blocks/10") do
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions

        assert_equal "ungenerated", local_ckb_transactions.map(&:display_inputs_status).uniq.first
      end
    end

    test ".save_block generated transactions's transaction fee status should be uncalculated when previous_transaction_hash is not exist" do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = JSON.parse(fake_node_block)
      VCR.use_cassette("blocks/10") do
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        local_ckb_transactions = local_block.ckb_transactions

        assert_equal "uncalculated", local_ckb_transactions.map(&:transaction_fee_status).uniq.first
      end
    end

    test ".update_ckb_transaction_display_inputs should update display inputs" do
      SyncInfo.local_inauthentic_tip_block_number
      block = create(:block, :with_block_hash)
      node_block = JSON.parse(fake_node_block)
      VCR.use_cassette("blocks/10") do
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        previous_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script, tx_hash: "0x598315db9c7ba144cca74d2e9122ac9b3a3da1641b2975ae321d91ec34f1c0e3")
        previous_transaction1 = create(:ckb_transaction, :with_cell_output_and_lock_script, tx_hash: "0x498315db9c7ba144cca74d2e9122ac9b3a3da1641b2975ae321d91ec34f1c0e3", block: block)
        previous_output = previous_transaction.cell_outputs.order(:id)[0]
        previous_output1 = previous_transaction1.cell_outputs.order(:id)[0]
        node_display_inputs = [
          { id: previous_output1.id, from_cellbase: false, capacity: previous_output1.capacity.to_s, address_hash: previous_output1.address_hash }.sort_by { |k, _v| k }.to_h.deep_stringify_keys,
          { id: previous_output.id, from_cellbase: false, capacity: previous_output.capacity.to_s, address_hash: previous_output.address_hash }.sort_by { |k, _v| k }.to_h.deep_stringify_keys
        ]

        local_ckb_transactions = local_block.ckb_transactions

        assert_changes -> { local_ckb_transactions.reload.pluck(:display_inputs_status).uniq }, from: ["ungenerated"], to: ["generated"] do
          CkbSync::Persist.update_ckb_transaction_display_inputs(local_ckb_transactions)
        end

        local_block_cell_inputs = local_ckb_transactions.map { |ckb_transaction| ckb_transaction.display_inputs.map { |display_input| display_input.sort_by { |k, _v| k }.to_h }}.flatten
        assert_equal node_display_inputs, local_block_cell_inputs
      end
    end

    test ".update_transaction_fee should update transaction fee status" do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = JSON.parse(fake_node_block)

      VCR.use_cassette("blocks/10") do
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")
        block = create(:block, :with_block_hash)

        create(:ckb_transaction, :with_cell_output_and_lock_script, tx_hash: "0x598315db9c7ba144cca74d2e9122ac9b3a3da1641b2975ae321d91ec34f1c0e3")
        create(:ckb_transaction, :with_cell_output_and_lock_script, tx_hash: "0x498315db9c7ba144cca74d2e9122ac9b3a3da1641b2975ae321d91ec34f1c0e3", block: block)

        local_ckb_transactions = local_block.ckb_transactions

        assert_changes -> { local_ckb_transactions.reload.pluck(:transaction_fee_status).uniq }, from: ["uncalculated"], to: ["calculated"] do
          CkbSync::Persist.update_transaction_fee(local_ckb_transactions)
        end
      end
    end

    test ".update_transaction_fee should update transaction fee" do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = JSON.parse(fake_node_block("0x3307186493c5da8b91917924253a5ffd35231151649d0c7e2941aa8801815063"))
      VCR.use_cassette("blocks/10") do
        local_block = CkbSync::Persist.save_block(node_block, "inauthentic")

        create(:ckb_transaction, :with_cell_output_and_lock_script, tx_hash: "0x598315db9c7ba144cca74d2e9122ac9b3a3da1641b2975ae321d91ec34f1c0e3", block: local_block)

        local_ckb_transactions = local_block.ckb_transactions

        assert_changes -> { local_ckb_transactions.reload.sum(:transaction_fee) }, from: 0, to: (10**8 * 5 - 50000) do
          CkbSync::Persist.update_transaction_fee(local_ckb_transactions)
        end

        assert_equal 10**8 * 5 - 50000, local_block.reload.total_transaction_fee
      end
    end

    test ".update_ckb_transaction_info_and_fee should queuing 10 jobs when has 1000 transaction" do
      Sidekiq::Testing.fake!

      block = create(:block, :with_block_hash)
      create_list(:ckb_transaction, 1000, block: block)
      CkbSync::Persist.update_ckb_transaction_info_and_fee

      assert_equal 10, Sidekiq::Queues["transaction_info_updater"].size
      assert_equal "UpdateTransactionDisplayInputsWorker", Sidekiq::Queues["transaction_info_updater"].first["class"]
      assert_equal "UpdateTransactionFeeWorker", Sidekiq::Queues["transaction_info_updater"].last["class"]
    end
  end
end
