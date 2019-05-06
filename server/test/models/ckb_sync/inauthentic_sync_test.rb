require "test_helper"

module CkbSync
  class InauthenticSyncTest < ActiveSupport::TestCase
    def setup
      SyncInfo.local_inauthentic_tip_block_number
    end

    test "should create 11 blocks when inauthentic sync start" do
      Sidekiq::Testing.inline! do
        CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(10)

        assert_difference "Block.count", 11 do
          VCR.use_cassette("genesis_block") do
            VCR.use_cassette("blocks/two") do
              CkbSync::InauthenticSync.sync_node_data
            end
          end
        end
      end
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

    test "should queueing 11 job" do
      Sidekiq::Testing.fake!
      CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(10)

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          assert_changes -> { SaveBlockWorker.jobs.size }, from: 0, to: 11 do
            CkbSync::InauthenticSync.sync_node_data
          end
        end
      end
    end
  end
end
