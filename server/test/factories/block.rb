FactoryBot.define do
  factory :block do
    difficulty { "0x100" }
    block_hash { "0x18bd084635d5a1190e6a17b49ae641a08f0805f7c9c7ea68cd325a2e19d9bdea" }
    number { 10 }
    parent_hash { "0xcba2d1a70602a1def80efbd59629c37a9d6c36f9de7a8ed6d1ca4f76389365e1" }
    seal { { "nonce" => 1757392074788233522, "proof" => "0x5900000098000000d90e00004b110000de1500001b25000051380000973d00001e490000194c00003760000012680000" } }
    timestamp { Faker::Time.between(2.days.ago, Date.today, :all).to_i }
    transactions_root { "0xe08894ef0ed80481448f7a584438a76b6bdbea178c02b4c3b40863d75c5aed3c" }
    proposals_root { "0x0000000000000000000000000000000000000000000000000000000000000000" }
    uncles_count { 1 }
    uncles_hash { "0xa43e4bb916f6d08f746a055271049d3a61a5344ad266553454862ef68d41bc4d" }
    version { 0 }
    cell_consumed { 43 }
    reward { 50000 }
    total_transaction_fee { 0 }
    ckb_transactions_count { 1 }
    total_cell_capacity { 50000 }
    uncle_block_hashes {}
    proposals {}
    status { "inauthentic" }

    transient do
      transactions_count { 10 }
    end

    trait :authentic do
      status { "authentic" }
    end

    trait :with_block_hash do
      block_hash { "0x#{SecureRandom.hex(32)}" }
    end

    trait :with_proposals do
      proposals { ["0xb5658716ac", "0xb5658716ac"] }
      proposals_count { (proposals.size).to_s }
    end

    trait :with_uncle_block_hashes do
      uncle_block_hashes { ["0xa43e4bb916f6d08f746a055271049d3a61a5344ad266553454862ef68d41bc4d", "0xa43e4bb916f6d08f746a055271049d3a61a5344ad266553454862ef68d41bc3d"] }
      uncles_count { (uncle_block_hashes.size).to_s }
    end

    trait :with_ckb_transactions do
      after(:create) do |block, evaluator|
        create_list(:ckb_transaction, evaluator.transactions_count, block: block)
      end
    end
  end
end
