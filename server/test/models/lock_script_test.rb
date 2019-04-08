require "test_helper"

class LockScriptTest < ActiveSupport::TestCase
  context "associations" do
    should belong_to(:cell_output)
    should belong_to(:account)
  end

  context "validations" do
    should validate_presence_of(:binary_hash)
  end

  test "#binary_hash should decodes packed string" do
    VCR.use_cassette("blocks/10") do
      SyncInfo.local_inauthentic_tip_block_number
      node_block = CkbSync::Api.get_block("0xed54818adbf956486a192989844d15d77bc937d8bcfcfc5e591a4f9e31e2cd2a").deep_stringify_keys
      CkbSync::Persist.save_block(node_block, "inauthentic")
      packed_block_hash = ["0xed54818adbf956486a192989844d15d77bc937d8bcfcfc5e591a4f9e31e2cd2a".delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
      block = Block.find_by(block_hash: packed_block_hash)
      ckb_transaction = block.ckb_transactions.first
      cell_output = ckb_transaction.cell_outputs.first
      lock_script = cell_output.lock_script
      assert_equal unpack_attribute(lock_script, "binary_hash"), lock_script.binary_hash
    end
  end
end
