class ChangeCkbTransactionsStatusWorker
  include Sidekiq::Worker

  def perform(block_id, status)
    block = Block.find(block_id)
    block.ckb_transactions.update_all(status: status)
  end
end
