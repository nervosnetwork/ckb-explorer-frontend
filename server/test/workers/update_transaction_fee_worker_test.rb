require "test_helper"

class UpdateTransactionFeeWorkerTest < ActiveSupport::TestCase
  setup do
    Sidekiq::Testing.fake!
  end

  test "prevents duplicate jobs" do
    block = create(:block, :with_block_hash)
    ckb_transactions = create_list(:ckb_transaction, 10, block: block)

    assert_not_nil UpdateTransactionFeeWorker.perform_async(ckb_transactions.pluck(:id))
    assert_nil UpdateTransactionFeeWorker.perform_async(ckb_transactions.pluck(:id))
  end

  test "queuing in the default" do
    block = create(:block, :with_block_hash)
    ckb_transactions = create_list(:ckb_transaction, 10, block: block)

    UpdateTransactionFeeWorker.perform_async(ckb_transactions.pluck(:id))

    assert_equal 1, Sidekiq::Queues["default"].size
    assert_equal "UpdateTransactionFeeWorker", Sidekiq::Queues["default"].first["class"]
  end
end
