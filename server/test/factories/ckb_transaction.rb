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
      after(:create) do |ckb_transaction, evaluator|
        cell_outputs = create_list(:cell_output, 3, ckb_transaction: ckb_transaction)
        cell_outputs.map { |cell_output| create(:lock_script, cell_output: cell_output) }
      end
    end

    trait :with_cell_output_and_lock_and_type_script do
      after(:create) do |ckb_transaction, evaluator|
        cell_outputs = create_list(:cell_output, 3, ckb_transaction: ckb_transaction)
        cell_outputs.map do |cell_output|
          create(:lock_script, cell_output: cell_output)
          create(:type_script, cell_output: cell_output)
        end
      end
    end
  end
end
