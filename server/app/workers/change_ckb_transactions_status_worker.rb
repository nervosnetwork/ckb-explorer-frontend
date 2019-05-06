class ChangeCkbTransactionsStatusWorker
  include Sidekiq::Worker
  sidekiq_options lock: :until_executed

  def perform(block_id, status)
    block = Block.find(block_id)
    block.ckb_transactions.update_all(status: status)
  end
end
