require "test_helper"
require "sidekiq/testing"

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
            VCR.use_cassette("blocks/two", match_requests_on: [:body]) do
              CkbSync::InauthenticSync.start
            end
          end
        end
      end
    end

    test "should queueing 11 job" do
      Sidekiq::Testing.fake!
      CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(10)

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two", match_requests_on: [:body]) do
          assert_changes -> { SaveBlockWorker.jobs.size }, from: 0, to: 11 do
            CkbSync::InauthenticSync.start
          end
        end
      end
    end
  end
end
