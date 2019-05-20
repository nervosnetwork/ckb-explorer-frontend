require "test_helper"

class ChangeCkbTransactionsStatusWorkerTest < ActiveSupport::TestCase
  setup do
    Sidekiq::Testing.fake!
  end

  test "prevents duplicate jobs" do
    block = create(:block)

    assert_not_nil ChangeCkbTransactionsStatusWorker.perform_async(block.id, "authentic")
    assert_nil ChangeCkbTransactionsStatusWorker.perform_async(block.id, "authentic")
  end

  test "queuing in the transaction_info_updater" do
    block = create(:block)
    ChangeCkbTransactionsStatusWorker.perform_async(block.id, "authentic")

    assert_equal 1, Sidekiq::Queues["transaction_info_updater"].size
    assert_equal "ChangeCkbTransactionsStatusWorker", Sidekiq::Queues["transaction_info_updater"].first["class"]
  end
end
