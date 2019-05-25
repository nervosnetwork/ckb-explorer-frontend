class SaveBlockWorker
  include Sidekiq::Worker
  sidekiq_options queue: "inauthentic_sync", lock: :until_executed, lock_expiration: 1.minute

  def perform(block_hash)
    CkbSync::Persist.call(block_hash)
  end
end
