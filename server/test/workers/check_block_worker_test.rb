require "test_helper"

class CheckBlockWorkerTest < ActiveSupport::TestCase
  setup do
    Sidekiq::Testing.fake!
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
end
