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
      node_block = CkbSync::Api.get_block("0xed54818adbf956486a192989844d15d77bc937d8bcfcfc5e591a4f9e31e2cd2a").deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = ["0xed54818adbf956486a192989844d15d77bc937d8bcfcfc5e591a4f9e31e2cd2a".delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
      block = Block.find_by(block_hash: packed_block_hash)
      account = block.contained_accounts.first
      assert_equal unpack_attribute(account, "address_hash"), account.address_hash
    end
  end

  test ".find_or_create_account should return the account when the address_hash exists" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.get_block("0xed54818adbf956486a192989844d15d77bc937d8bcfcfc5e591a4f9e31e2cd2a").deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = ["0xed54818adbf956486a192989844d15d77bc937d8bcfcfc5e591a4f9e31e2cd2a".delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
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
end
