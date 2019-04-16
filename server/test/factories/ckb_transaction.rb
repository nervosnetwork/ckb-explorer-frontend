FactoryBot.define do
  factory :ckb_transaction do
    block
    tx_hash { "0x#{SecureRandom.hex(32)}" }
    deps {}
    block_number {}
    block_timestamp {}
    display_inputs {}
    display_outputs {}
    status { 0 }
    transaction_fee { 0 }
    version { 0 }
    witnesses {}

    transient do
      account { nil }
    end

    transient do
      binary_hash { nil }
    end

    transient do
      args { nil }
    end

    transient do
      lock_script_version { nil }
    end

    trait :with_cell_output_and_lock_script do
      after(:create) do |ckb_transaction, evaluator|
        cell_output = create(:cell_output, ckb_transaction: ckb_transaction)
        create(:lock_script, cell_output: cell_output, account: evaluator.account, args: evaluator.args, binary_hash: evaluator.binary_hash, version: evaluator.lock_script_version)
      end
    end
  end
end
