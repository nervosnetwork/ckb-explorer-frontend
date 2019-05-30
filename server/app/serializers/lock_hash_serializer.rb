class LockHashSerializer
  include FastJsonapi::ObjectSerializer

  set_type :lock_hash

  attributes :address_hash, :balance, :cell_consumed, :lock_hash

  attribute(:transactions_count, &:ckb_transactions_count)

  attribute :lock_script do |object|
    object.lock_script.to_node_lock
  end
end
