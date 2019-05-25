class UpdateTransactionDisplayInfosWorker
  include Sidekiq::Worker
  sidekiq_options retry: false, queue: "transaction_info_updater", lock: :until_executed, lock_expiration: 1.minute

  def perform(ckb_transaction_id)
    ckb_transaction = CkbTransaction.find(ckb_transaction_id)

    CkbSync::Persist.update_ckb_transaction_display_inputs(ckb_transaction)
    CkbSync::Persist.update_ckb_transaction_display_outputs(ckb_transaction)
  end
end
