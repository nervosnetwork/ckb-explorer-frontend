require "test_helper"

class CheckBlockWorkerTest < ActiveSupport::TestCase
  setup do
    Sidekiq::Testing.fake!
    Sidekiq.redis(&:flushdb)
  end

  test "prevents duplicate jobs" do
    assert_not_nil CheckBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
    assert_nil CheckBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
  end

  test "queuing in the critical" do
    CheckBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)

    assert_equal 1, Sidekiq::Queues["critical"].size
    assert_equal "CheckBlockWorker", Sidekiq::Queues["critical"].first["class"]
  end

  test "should invoke call function in CkbSync::Validator" do
    VCR.use_cassette("blocks/10") do
      Sidekiq::Testing.inline! do
        create(:sync_info, name: "authentic_tip_block_number", value: 10)
        CkbSync::Validator.expects(:call).with(DEFAULT_NODE_BLOCK_HASH).once
        CheckBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
      end
    end
  end
end
