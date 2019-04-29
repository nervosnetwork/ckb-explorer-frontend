require "test_helper"

module CkbSync
  class AuthenticSyncTest < ActiveSupport::TestCase
    setup do
      SyncInfo.local_authentic_tip_block_number
    end

    test "should create 11 blocks when inauthentic sync start" do
      Sidekiq::Testing.inline! do
        CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)

        assert_difference "Block.count", 11 do
          VCR.use_cassette("genesis_block") do
            VCR.use_cassette("blocks/two") do
              CkbSync::AuthenticSync.sync_node_data
            end
          end
        end
      end
    end
  end
end
