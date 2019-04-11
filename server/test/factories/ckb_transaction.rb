FactoryBot.define do
  factory :ckb_transaction do
    tx_hash {}
    deps {}
    block_number {}
    block_timestamp {}
    display_inputs {}
    display_outputs {}
    status { 0 }
    transaction_fee { 0 }
    version { 0 }
    witnesses {}
  end
end
