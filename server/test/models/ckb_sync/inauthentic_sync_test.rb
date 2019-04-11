require "test_helper"
require 'sidekiq/testing'

module CkbSync
  class InauthenticSyncTest < ActiveSupport::TestCase
    test "should create 3 blocks when inauthentic sync start" do
      Sidekiq::Testing.inline! do
        CkbSync::Api.stubs(:get_tip_block_number).returns(2)

        assert_difference "Block.count", 3 do
          VCR.use_cassette("blocks/two") do
            CkbSync::InauthenticSync.start
          end
        end
      end
    end

    test "should queueing 3 job" do
      CkbSync::Api.stubs(:get_tip_block_number).returns(2)

      VCR.use_cassette("blocks/two") do
        assert_changes -> { SaveBlockWorker.jobs.size }, from: 0, to: 3 do
          CkbSync::InauthenticSync.start
        end
      end
    end
  end
end
