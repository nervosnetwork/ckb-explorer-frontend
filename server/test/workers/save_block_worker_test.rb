require "test_helper"

class SaveBlockWorkerTest < ActiveSupport::TestCase
  setup do
    Sidekiq::Testing.fake!
  end

  test "prevents duplicate jobs" do
    assert_not_nil SaveBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
    assert_nil SaveBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
  end

  test "queuing in the critical" do
    SaveBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)

    assert_equal 1, Sidekiq::Queues["critical"].size
    assert_equal "SaveBlockWorker", Sidekiq::Queues["critical"].first["class"]
  end
end
