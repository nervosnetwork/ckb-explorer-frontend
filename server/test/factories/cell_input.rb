FactoryBot.define do
  factory :cell_input do
    ckb_transaction

    previous_output {}
    args {}
  end
end
