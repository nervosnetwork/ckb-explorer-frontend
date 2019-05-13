require "test_helper"

class SaveBlockWorkerTest < ActiveSupport::TestCase
  setup do
    Sidekiq::Testing.fake!
    Sidekiq.redis(&:flushdb)
  end

  test "prevents duplicate jobs" do
    assert_not_nil SaveBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
    assert_nil SaveBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
  end

  test "queuing in the inauthentic_sync" do
    SaveBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)

    assert_equal 1, Sidekiq::Queues["inauthentic_sync"].size
    assert_equal "SaveBlockWorker", Sidekiq::Queues["inauthentic_sync"].first["class"]
  end

  test "should invoke call function in CkbSync::Persist" do
    VCR.use_cassette("blocks/10") do
      Sidekiq::Testing.inline! do
        create(:sync_info, name: "inauthentic_tip_block_number", value: 10)
        CkbSync::Persist.expects(:call).with(DEFAULT_NODE_BLOCK_HASH).once
        SaveBlockWorker.perform_async(DEFAULT_NODE_BLOCK_HASH)
      end
    end
  end
end
