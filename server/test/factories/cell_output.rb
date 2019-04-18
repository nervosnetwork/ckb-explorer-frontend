FactoryBot.define do
  factory :cell_output do
    capacity { 50000 }
    data {}

    trait :with_full_transaction do
      before(:create) do |cell_input, _evaluator|
        ckb_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script)
        cell_input.update(ckb_transaction: ckb_transaction)
      end
    end
  end
end
