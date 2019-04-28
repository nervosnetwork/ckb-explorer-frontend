FactoryBot.define do
  factory :cell_output do
    address

    capacity { 50000 }
    data {}

    trait :with_full_transaction do
      before(:create) do |cell_output, _evaluator|
        ckb_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script)
        cell_output.update(ckb_transaction: ckb_transaction)
        create(:lock_script, cell_output: cell_output)
        create(:type_script, cell_output: cell_output)
      end
    end

    trait :with_full_transaction_but_no_type_script do
      before(:create) do |cell_output, _evaluator|
        ckb_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script)
        cell_output.update(ckb_transaction: ckb_transaction)
        create(:lock_script, cell_output: cell_output)
      end
    end
  end
end
