require "test_helper"

class SyncInfoTest < ActiveSupport::TestCase
  test ".local_inauthentic_tip_block_number should return -1 when the SyncInfo named by inauthentic_tip_block_number does not exist" do
    SyncInfo.delete_all
    assert_difference "SyncInfo.count", 1 do
      return_value = SyncInfo.local_inauthentic_tip_block_number
      assert_equal -1, return_value
    end
  end

  test ".local_authentic_tip_block_number should return -1 when the SyncInfo named by authentic_tip_block_number does not exist" do
    SyncInfo.delete_all
    assert_difference "SyncInfo.count", 1 do
      return_value = SyncInfo.local_authentic_tip_block_number
      assert_equal -1, return_value
    end
  end

  test ".local_inauthentic_tip_block_number= should update the SyncInfo named by inauthentic_tip_block_number status to syncing" do
    SyncInfo.local_inauthentic_tip_block_number
    SyncInfo.local_inauthentic_tip_block_number = 10
    sync_info = SyncInfo.find_by(name: "inauthentic_tip_block_number")
    assert_equal "syncing", sync_info.status
  end

  test ".local_authentic_tip_block_number= should update the SyncInfo named by authentic_tip_block_number status to syncing" do
    SyncInfo.local_authentic_tip_block_number
    SyncInfo.local_authentic_tip_block_number = 10
    sync_info = SyncInfo.find_by(name: "authentic_tip_block_number")
    assert_equal "syncing", sync_info.status
  end
end
