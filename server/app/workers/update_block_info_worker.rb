class UpdateBlockInfoWorker
  include Sidekiq::Worker
  sidekiq_options queue: "block_info_updater", lock: :until_executed, lock_expiration: 1.minute

  def perform(transaction_id)
    ckb_transaction = CkbTransaction.find(transaction_id)

    CkbSync::Persist.update_block_address_ids_and_cell_status(ckb_transaction)
  end
end
