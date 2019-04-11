FactoryBot.define do
  factory :account do
    address_hash {}
    balance { 0 }
    cell_consumed { 0 }
    ckb_transactions_count { 0 }
  end
end
