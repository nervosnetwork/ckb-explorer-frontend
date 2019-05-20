require "test_helper"

class AddressTest < ActiveSupport::TestCase
  setup do
    create(:sync_info, name: "inauthentic_tip_block_number", value: 10)
  end

  context "associations" do
    should have_one(:lock_script)
    should have_many(:account_books)
    should have_many(:ckb_transactions).
      through(:account_books)
  end

  context "validations" do
    should validate_presence_of(:balance)
    should validate_presence_of(:cell_consumed)
    should validate_presence_of(:ckb_transactions_count)
    should validate_numericality_of(:balance).
      is_greater_than_or_equal_to(0).on(:create)
    should validate_numericality_of(:cell_consumed).
      is_greater_than_or_equal_to(0).on(:create)
    should validate_numericality_of(:ckb_transactions_count).
      is_greater_than_or_equal_to(0).on(:create)
  end

  test "address_hash should be nil when args is empty" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys

      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      address = block.contained_addresses.first

      assert_nil address.address_hash
    end
  end

  test "address_hash should be nil when args is invalid" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
      tx = node_block["transactions"].first
      output = tx["outputs"].first
      output["lock"]["args"] = ["abcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"]

      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      address = block.contained_addresses.first

      assert_nil address.address_hash
    end
  end

  test "address_hash should be nil when code_hash is empty" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
      tx = node_block["transactions"].first
      output = tx["outputs"].first
      output["lock"]["args"] = ["0xabcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"]

      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      address = block.contained_addresses.first

      assert_nil address.address_hash
    end
  end

  test "address_hash should be nil when code_hash is not system script cell hash" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
      tx = node_block["transactions"].first
      output = tx["outputs"].first
      output["lock"]["args"] = ["0xabcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"]
      output["lock"]["code_hash"] = "0xcbcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a7"

      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      address = block.contained_addresses.first

      assert_nil address.address_hash
    end
  end

  test ".find_or_create_address should return the address when the address_hash exists and use default lock script" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).to_h.deep_stringify_keys
      tx = node_block["transactions"].first
      output = tx["outputs"].first
      output["lock"]["args"] = ["0xabcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"]
      output["lock"]["code_hash"] = ENV["CODE_HASH"]

      CkbSync::Persist.save_block(node_block, "inauthentic")

      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      ckb_transaction = block.ckb_transactions.first
      cell_output = ckb_transaction.cell_outputs.first
      lock_script = cell_output.lock_script.attributes.reject { |key, _value| key.in?(%w(id cell_output_id address_id created_at updated_at)) }.symbolize_keys
      lock_script[:code_hash] = unpack_attribute(cell_output.lock_script, "code_hash")

      assert_difference "Address.count", 0 do
        Address.find_or_create_address(lock_script)
      end
    end
  end

  test "should update the related address's ckb_transactions_count after block synced" do
    address = create(:address, address_hash: "ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf", ckb_transactions_count: 1)

    assert_difference -> { address.reload.ckb_transactions_count }, 10, &method(:prepare_inauthentic_node_data)
  end

  test "should update related addresses balance after block authenticated" do
    Sidekiq::Testing.inline!

    prepare_inauthentic_node_data

    VCR.use_cassette("genesis_block") do
      VCR.use_cassette("blocks/three") do
        CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
        CkbSync::AuthenticSync.sync_node_data
        create(:sync_info, name: "authentic_tip_block_number", value: 10)

        local_block = Block.find_by(block_hash: DEFAULT_NODE_BLOCK_HASH)

        CkbSync::Validator.call(local_block.block_hash)

        updated_balances =
          local_block.contained_addresses.map do |address|
            CkbUtils.get_balance(address.address_hash) || 0
          end

        old_balances = local_block.contained_addresses.pluck(:balance)

        assert_equal updated_balances, old_balances
      end
    end
  end

  test "should update related addresses cell consumed after block authenticated" do
    Sidekiq::Testing.inline!

    prepare_inauthentic_node_data

    SyncInfo.local_authentic_tip_block_number

    VCR.use_cassette("genesis_block") do
      VCR.use_cassette("blocks/three") do
        CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
        CkbSync::AuthenticSync.sync_node_data
        create(:sync_info, name: "authentic_tip_block_number", value: 10)

        previous_block = create(:block, :with_block_hash, number: 100)
        previous_ckb_transaction = create(:ckb_transaction, block: previous_block)
        previous_ckb_transaction.cell_inputs.create(previous_output: { cell: nil, block_hash: previous_block.block_hash })
        cell_output = previous_ckb_transaction.cell_outputs.create(capacity: 10**8, address: create(:address), block: previous_block)
        cell_output.create_lock_script

        local_block = Block.find_by(block_hash: DEFAULT_NODE_BLOCK_HASH)

        ckb_transaction = create(:ckb_transaction, block: local_block)
        ckb_transaction.cell_inputs.create(previous_output: { tx_hash: previous_ckb_transaction.tx_hash, index: 0 })
        local_block.ckb_transactions << ckb_transaction

        CkbSync::Validator.call(local_block.block_hash)

        block = create(:block, :with_block_hash, number: 101)
        create(:ckb_transaction, :with_cell_output_and_lock_and_type_script, block: block, tx_hash: "0xe6471b6ba597dc7c0a7d5a5f19a9c67c0386358d21c31514ae617aeb4982acbb")

        updated_cell_consumed =
          local_block.contained_addresses.map do |address|
            address.update(address_hash: "ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf")
            CkbUtils.address_cell_consumed(address.address_hash) || 0
          end

        old_cell_consumed = local_block.contained_addresses.pluck(:cell_consumed)

        assert_equal updated_cell_consumed, old_cell_consumed
      end
    end
  end
end
