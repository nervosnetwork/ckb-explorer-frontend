class SyncBlockWorker
  include Sidekiq::Worker
  sidekiq_options queue: "inauthentic_sync", lock: :until_executed

  def perform(block_number)
    CkbSync::Persist.sync(block_number)
  end
end
