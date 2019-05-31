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
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)

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
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
      tx = node_block.transactions.first
      output = tx.outputs.first
      output.lock.instance_variable_set(:@args, ["0x"])

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
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
      tx = node_block.transactions.first
      output = tx.outputs.first
      output.lock.instance_variable_set(:@args, ["0xabcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"])

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
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
      tx = node_block.transactions.first
      output = tx.outputs.first
      output.lock.instance_variable_set(:@args, ["0xabcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"])
      output.lock.instance_variable_set(:@code_hash, "0xcbcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a7")

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
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
      tx = node_block.transactions.first
      output = tx.outputs.first
      output.lock.instance_variable_set(:@args, ["0xabcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"])
      output.lock.instance_variable_set(:@code_hash, ENV["CODE_HASH"])

      CkbSync::Persist.save_block(node_block, "inauthentic")

      lock_script = node_block.transactions.first.outputs.first.lock

      assert_difference "Address.count", 0 do
        Address.find_or_create_address(lock_script)
      end
    end
  end

  test ".find_or_create_address should returned address's lock hash should equal with output's lock hash" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH)
      tx = node_block.transactions.first
      output = tx.outputs.first
      output.lock.instance_variable_set(:@args, ["0xabcbce98a758f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a6"])
      output.lock.instance_variable_set(:@code_hash, ENV["CODE_HASH"])

      CkbSync::Persist.save_block(node_block, "inauthentic")

      lock_script = node_block.transactions.first.outputs.first.lock
      address = Address.find_or_create_address(lock_script)

      assert_equal output.lock.to_hash, address.lock_hash
    end
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
end
