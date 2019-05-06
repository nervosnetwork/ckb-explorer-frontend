class SaveBlockWorker
  include Sidekiq::Worker
  sidekiq_options queue: "critical", lock: :until_executed

  def perform(block_hash, sync_type)
    CkbSync::Persist.call(block_hash, sync_type)
  end
end
