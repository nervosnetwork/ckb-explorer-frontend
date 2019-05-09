class SaveBlockWorker
  include Sidekiq::Worker
  sidekiq_options queue: "critical", lock: :until_executed

  def perform(block_hash)
    CkbSync::Persist.call(block_hash)
  end
end
