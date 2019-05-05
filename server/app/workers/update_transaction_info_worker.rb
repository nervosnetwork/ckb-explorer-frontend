class UpdateTransactionInfoWorker
  include Sidekiq::Worker

  def perform
    CkbSync::Persist.update_ckb_transaction_display_inputs
    CkbSync::Persist.update_transaction_fee
  end
end
