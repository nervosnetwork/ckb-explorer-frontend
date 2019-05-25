class ChangeCellOutputsStatusWorker
  include Sidekiq::Worker
  sidekiq_options lock: :until_executed, lock_expiration: 1.minute

  def perform(block_id, status)
    block = Block.find(block_id)
    block.cell_outputs.update_all(status: status)
  end
end
