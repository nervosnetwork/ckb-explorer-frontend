FactoryBot.define do
  factory :cell_input do
    previous_output {}
    args {}

    trait :from_cellbase do
      before(:create) do |cell_input, _evaluator|
        ckb_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script)
        previous_output = { cell: nil, block_hash: ckb_transaction.block.block_hash }
        cell_input.update(ckb_transaction: ckb_transaction, previous_output: previous_output)
      end
    end

    trait :with_full_transaction do
      before(:create) do |cell_input, _evaluator|
        ckb_transaction = create(:ckb_transaction, :with_cell_output_and_lock_script)
        previous_output = { cell: { tx_hash: ckb_transaction.tx_hash, index: 1 }, block_hash: ckb_transaction.block.block_hash }
        cell_input.update(ckb_transaction: ckb_transaction, previous_output: previous_output)
      end
    end

    trait :with_full_transaction_and_type_script do
      before(:create) do |cell_input, _evaluator|
        ckb_transaction = create(:ckb_transaction, :with_cell_output_and_lock_and_type_script)
        previous_output = { cell: { tx_hash: ckb_transaction.tx_hash, index: 1 }, block_hash: ckb_transaction.block.block_hash }
        cell_input.update(ckb_transaction: ckb_transaction, previous_output: previous_output)
      end
    end
  end
end
