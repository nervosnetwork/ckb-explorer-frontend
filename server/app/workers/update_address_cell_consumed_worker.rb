class UpdateAddressCellConsumedWorker
  include Sidekiq::Worker
  sidekiq_options retry: false, queue: "address_cell_consumed_updater"

  def perform(address_hash)
    address = Address.find_by(address_hash: address_hash)
    address_cell_consumed = CkbUtils.address_cell_consumed(address_hash) || 0
    address.update_attribute(:cell_consumed, address_cell_consumed)
  end
end
