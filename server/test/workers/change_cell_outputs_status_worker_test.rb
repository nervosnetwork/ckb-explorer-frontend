require "test_helper"

class ChangeCellOutputsStatusWorkerTest < ActiveSupport::TestCase
  setup do
    Sidekiq::Testing.fake!
  end

  test "prevents duplicate jobs" do
    block = create(:block)

    assert_not_nil ChangeCellOutputsStatusWorker.perform_async(block.id, "authentic")
    assert_nil ChangeCellOutputsStatusWorker.perform_async(block.id, "authentic")
  end

  test "queuing in the default" do
    block = create(:block)
    ChangeCellOutputsStatusWorker.perform_async(block.id, "authentic")

    assert_equal 1, Sidekiq::Queues["default"].size
    assert_equal "ChangeCellOutputsStatusWorker", Sidekiq::Queues["default"].first["class"]
  end
end
