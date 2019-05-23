FactoryBot.define do
  factory :ckb_transaction do
    block
    tx_hash { "0x#{SecureRandom.hex(32)}" }
    deps {}
    block_number {}
    block_timestamp { Faker::Time.between(2.days.ago, Date.today, :all).to_i }
    display_inputs {}
    display_outputs {}
    status { 0 }
    transaction_fee { 0 }
    version { 0 }
    witnesses {}

    transient do
      address { nil }
    end

    transient do
      code_hash { nil }
    end

    transient do
      args { nil }
    end

    transient do
      lock_script_version { nil }
    end

    trait :with_cell_output_and_lock_script do
      after(:create) do |ckb_transaction, _evaluator|
        output1 = create(:cell_output, ckb_transaction: ckb_transaction, block: ckb_transaction.block, tx_hash: ckb_transaction.tx_hash, cell_index: 0)
        output2 = create(:cell_output, ckb_transaction: ckb_transaction, block: ckb_transaction.block, tx_hash: ckb_transaction.tx_hash, cell_index: 1)
        output3 = create(:cell_output, ckb_transaction: ckb_transaction, block: ckb_transaction.block, tx_hash: ckb_transaction.tx_hash, cell_index: 2)
        create(:lock_script, cell_output: output1)
        create(:lock_script, cell_output: output2)
        create(:lock_script, cell_output: output3)
      end
    end

    trait :with_cell_output_and_lock_and_type_script do
      after(:create) do |ckb_transaction, _evaluator|
        output1 = create(:cell_output, ckb_transaction: ckb_transaction, block: ckb_transaction.block, tx_hash: ckb_transaction.tx_hash, cell_index: 0)
        output2 = create(:cell_output, ckb_transaction: ckb_transaction, block: ckb_transaction.block, tx_hash: ckb_transaction.tx_hash, cell_index: 1)
        output3 = create(:cell_output, ckb_transaction: ckb_transaction, block: ckb_transaction.block, tx_hash: ckb_transaction.tx_hash, cell_index: 2)
        create(:lock_script, cell_output: output1)
        create(:type_script, cell_output: output1)
        create(:lock_script, cell_output: output2)
        create(:type_script, cell_output: output2)
        create(:lock_script, cell_output: output3)
        create(:type_script, cell_output: output3)
      end
    end
  end
end
