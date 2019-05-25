class UpdateAddressInfoWorker
  include Sidekiq::Worker
  sidekiq_options queue: "address_info_updater"

  def perform(address_id)
    address = Address.find(address_id)

    CkbSync::Persist.update_address_balance_and_ckb_transactions_count(address)
  end
end
