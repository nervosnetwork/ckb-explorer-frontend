require "test_helper"

class AccountTest < ActiveSupport::TestCase
  context "associations" do
    should have_many(:account_books)
    should have_many(:ckb_transactions).
      through(:account_books)
  end

  context "validations" do
    should validate_presence_of(:address_hash)
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

  test "#address_hash should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      account = block.contained_accounts.first
      assert_equal unpack_attribute(account, "address_hash"), account.address_hash
    end
  end

  test ".find_or_create_account should return the account when the address_hash exists" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = DEFAULT_NODE_BLOCK_HASH
      block = Block.find_by(block_hash: packed_block_hash)
      ckb_transaction = block.ckb_transactions.first
      cell_output = ckb_transaction.cell_outputs.first
      lock_script = cell_output.lock_script.attributes.reject { |key, _value| key.in?(%w(id cell_output_id account_id created_at updated_at)) }.symbolize_keys
      lock_script[:binary_hash] = unpack_attribute(cell_output.lock_script, "binary_hash")

      assert_difference "Account.count", 0 do
        Account.find_or_create_account(ckb_transaction, lock_script)
      end
    end
  end

  # TODO testing for multiple transactions later
  test "should update the related account's ckb_transactions_count after block synced" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      account = create(:account, address_hash: "0xcb7bce98a778f130d34da522623d7e56705bddfe0dc4781bd2331211134a19a5", ckb_transactions_count: 1)
      assert_difference -> { account.reload.ckb_transactions_count }, 1 do
        node_block = CkbSync::Api.instance.get_block(DEFAULT_NODE_BLOCK_HASH).deep_stringify_keys
        CkbSync::Persist.save_block(node_block, "inauthentic")
      end
    end
  end

  test "should update related accounts balance after block authenticated" do
    Sidekiq::Testing.inline!

    old_balances = nil
    updated_balances = nil
    local_block = nil

    prepare_inauthentic_node_data

    VCR.use_cassette("genesis_block") do
      VCR.use_cassette("blocks/three", match_requests_on: [:body], record: :new_episodes) do
        CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
        CkbSync::AuthenticSync.start

        local_block = Block.find_by(block_hash: DEFAULT_NODE_BLOCK_HASH)

        CkbSync::Validator.call(local_block.block_hash)

        updated_balances =
          local_block.contained_accounts.map do |account|
            CKB::Utils.get_balance(account.address_hash)
          end

        old_balances = local_block.contained_accounts.pluck(:balance)

        assert_equal updated_balances, old_balances
      end
    end
  end

  test "should update related accounts cell consumed after block authenticated" do
    Sidekiq::Testing.inline!

    old_cell_consumed = nil
    updated_cell_consumed = nil
    local_block = nil

    prepare_inauthentic_node_data

    SyncInfo.local_authentic_tip_block_number

    VCR.use_cassette("genesis_block") do
      VCR.use_cassette("blocks/three", match_requests_on: [:body], record: :new_episodes) do
        CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
        CkbSync::AuthenticSync.start

        local_block = Block.find_by(block_hash: DEFAULT_NODE_BLOCK_HASH)

        CkbSync::Validator.call(local_block.block_hash)
        updated_cell_consumed =
        local_block.contained_accounts.map do |account|
          CKB::Utils.account_cell_consumed(account.address_hash)
        end

        old_cell_consumed = local_block.contained_accounts.pluck(:cell_consumed)
        assert_equal updated_cell_consumed, old_cell_consumed
      end
    end
  end
end
