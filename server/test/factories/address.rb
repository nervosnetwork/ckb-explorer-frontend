FactoryBot.define do
  factory :address do
    address_hash { "0x#{SecureRandom.hex(32)}" }
    balance { 0 }
    cell_consumed { 0 }
    ckb_transactions_count { 0 }

    transient do
      transactions_count { 3 }
    end

    trait :with_transactions do
      ckb_transactions_count { 3 }
      after(:create) do |address, evaluator|
        block = create(:block, :with_block_hash)
        ckb_transactions = create_list(:ckb_transaction, evaluator.transactions_count, block: block)
        address.ckb_transactions << ckb_transactions
      end
    end
  end
end
