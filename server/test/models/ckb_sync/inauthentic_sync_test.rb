require "test_helper"

module CkbSync
  class InauthenticSyncTest < ActiveSupport::TestCase
    def setup
      SyncInfo.local_inauthentic_tip_block_number
    end

    test "should return nil when latest round range is executing" do
      CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(10)
      Rails.cache.stubs(:delete).returns(true)

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          CkbSync::InauthenticSync.sync_node_data
        end
      end

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          SyncInfo.stubs(:local_inauthentic_tip_block_number).returns(-1)
          assert_nil CkbSync::InauthenticSync.sync_node_data
        end
      end
    end
  end
end
