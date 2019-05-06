class UpdateTransactionInfoWorker
  include Sidekiq::Worker
  sidekiq_options retry: false, lock: :until_executed

  def perform
    CkbSync::Persist.update_ckb_transaction_display_inputs
    CkbSync::Persist.update_transaction_fee
  end
end
