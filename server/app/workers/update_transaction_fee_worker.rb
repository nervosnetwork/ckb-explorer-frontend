class UpdateTransactionFeeWorker
  include Sidekiq::Worker
  sidekiq_options retry: false, lock: :until_executed

  def perform(ckb_transaction_ids)
    ckb_transactions = CkbTransaction.where(id: ckb_transaction_ids)

    CkbSync::Persist.update_transaction_fee(ckb_transactions)
  end
end
