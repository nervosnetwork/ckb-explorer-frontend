FactoryBot.define do
  factory :block do
    difficulty { "0x100" }
    block_hash { "0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8" }
    number { 10 }
    parent_hash { "0xcba2d1a70602a1def80efbd59629c37a9d6c36f9de7a8ed6d1ca4f76389365e1" }
    seal { { "nonce" => 1757392074788233522, "proof" => "0x5900000098000000d90e00004b110000de1500001b25000051380000973d00001e490000194c00003760000012680000" } }
    timestamp { 1554100447138 }
    txs_commit { "0xe08894ef0ed80481448f7a584438a76b6bdbea178c02b4c3b40863d75c5aed3c" }
    txs_proposal { "0x0000000000000000000000000000000000000000000000000000000000000000" }
    uncles_count { 1 }
    uncles_hash { "0xa43e4bb916f6d08f746a055271049d3a61a5344ad266553454862ef68d41bc4d" }
    version { 0 }
    cell_consumed { 43 }
    reward { 50000 }
    total_transaction_fee { 0 }
    ckb_transactions_count { 1 }
    total_cell_capacity { 50000 }
    uncle_block_hashes {  }
    proposal_transactions {  }
    status { "inauthentic" }

    trait :authentic do
      status { "authentic" }
    end

    trait :with_proposal_transactions do
      proposal_transactions { ["0xb5658716ac", "0xb5658716ac"] }
      proposal_transactions_count { "#{proposal_transactions.size}" }
    end

    trait :with_uncle_block_hashes do
      uncle_block_hashes { ["0xa43e4bb916f6d08f746a055271049d3a61a5344ad266553454862ef68d41bc4d", "0xa43e4bb916f6d08f746a055271049d3a61a5344ad266553454862ef68d41bc3d"] }
      uncles_count { "#{uncle_block_hashes.size}" }
    end
  end
end
