class AddressSerializer
  include FastJsonapi::ObjectSerializer

  attributes :address_hash, :balance, :cell_consumed

  attribute(:transactions_count, &:ckb_transactions_count)

  attribute :lock_script do |object|
    object.lock_script.to_node_lock
  end
end
