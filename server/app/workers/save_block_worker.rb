class SaveBlockWorker
  include Sidekiq::Worker

  def perform(block_hash, sync_type)
    CkbSync::Persist.call(block_hash, sync_type)
  end
end
