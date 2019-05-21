class UpdateTransactionFeeWorker
  include Sidekiq::Worker
  sidekiq_options retry: false, queue: "transaction_info_updater", lock: :until_executed

  def perform(ckb_transaction_id)
    ckb_transaction = CkbTransaction.find(ckb_transaction_id)

    CkbSync::Persist.update_transaction_fee(ckb_transaction)
  end
end
