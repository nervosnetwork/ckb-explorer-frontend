require "test_helper"

module CkbSync
  class AuthenticSyncTest < ActiveSupport::TestCase
    setup do
      SyncInfo.local_authentic_tip_block_number
      Faker::Number.unique.clear
    end

    test "should return nil when round range params to is negative" do
      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(-2)
          assert_nil CkbSync::AuthenticSync.sync_node_data
        end
      end
    end

    test "should return nil when latest round range is executing" do
      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/four") do
          CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
          CkbSync::InauthenticSync.sync_node_data
        end
      end

      Rails.cache.stubs(:delete).returns(true)

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          CkbSync::AuthenticSync.sync_node_data
        end
      end
      SyncInfo.stubs(:local_authentic_tip_block_number).returns(-1)
      assert_nil CkbSync::AuthenticSync.sync_node_data
    end
  end
end
