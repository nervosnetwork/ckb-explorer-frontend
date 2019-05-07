class ChangeCellOutputsStatusWorker
  include Sidekiq::Worker
  sidekiq_options lock: :until_executed

  def perform(block_id, status)
    block = Block.find(block_id)
    block.cell_outputs.update_all(status: status)
  end
end
