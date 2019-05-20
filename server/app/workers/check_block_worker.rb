class CheckBlockWorker
  include Sidekiq::Worker
  sidekiq_options queue: "authentic_sync", lock: :until_executed

  def perform(block_hash)
    CkbSync::Validator.call(block_hash)
  end
end
