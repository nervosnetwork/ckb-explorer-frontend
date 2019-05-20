require "test_helper"

class SyncInfoTest < ActiveSupport::TestCase
  test ".local_inauthentic_tip_block_number should return 0 when the SyncInfo named by inauthentic_tip_block_number does not exist" do
    SyncInfo.delete_all
    assert_difference "SyncInfo.count", 1 do
      return_value = SyncInfo.local_inauthentic_tip_block_number
      assert_equal 0, return_value
    end
  end

  test ".local_authentic_tip_block_number should return 0 when the SyncInfo named by authentic_tip_block_number does not exist" do
    SyncInfo.delete_all
    assert_difference "SyncInfo.count", 1 do
      return_value = SyncInfo.local_authentic_tip_block_number
      assert_equal 0, return_value
    end
  end
end
