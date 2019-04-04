class CheckBlockWorker
  include Sidekiq::Worker

  def perform(block_hash)
    CkbSync::Validator.call(block_hash)
  end
end
