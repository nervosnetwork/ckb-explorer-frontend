require "test_helper"
require 'sidekiq/testing'

module CkbSync
  class AuthenticSyncTest < ActiveSupport::TestCase
    test "should create 2 blocks when inauthentic sync start" do
      Sidekiq::Testing.inline! do
        CkbSync::Api.stubs(:get_tip_block_number).returns(3)

        assert_difference "Block.count", 2 do
          VCR.use_cassette("blocks/two") do
            CkbSync::AuthenticSync.start
          end
        end
      end
    end

    test "should queueing 2 job" do
      CkbSync::Api.stubs(:get_tip_block_number).returns(3)

      VCR.use_cassette("blocks/two") do
        assert_changes -> { CheckBlockWorker.jobs.size }, from: 0, to: 2 do
          CkbSync::AuthenticSync.start
        end
      end
    end
  end
end
