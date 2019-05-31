require "test_helper"

class SuggestQueryTest < ActiveSupport::TestCase
  test "should raise error when address is invalid" do
    query_key = "ckc1q9gry5zg3pzs2q65ty0ylaf6c9er0hju5su49jdgry8n2c"

    assert_raises ActiveRecord::RecordNotFound do
      SuggestQuery.new(query_key).find!
    end
  end

  test "should return Block by query key when query key is a exist block number" do
    block = create(:block, number: 12)

    assert_equal BlockSerializer.new(block).serialized_json, SuggestQuery.new("12").find!.serialized_json
  end

  test "should return Block by query key when query key is a exist block hash" do
    block = create(:block, number: 12)

    assert_equal BlockSerializer.new(block).serialized_json, SuggestQuery.new(block.block_hash).find!.serialized_json
  end

  test "should return CkbTransaction by query key when query key is a exist tx hash" do
    tx = create(:ckb_transaction)

    assert_equal CkbTransactionSerializer.new(tx).serialized_json, SuggestQuery.new(tx.tx_hash).find!.serialized_json
  end

  test "should return Address by query key when query key is a exist address hash" do
    address = create(:address, :with_lock_script)

    assert_equal AddressSerializer.new(address).serialized_json, SuggestQuery.new(address.address_hash).find!.serialized_json
  end
end
