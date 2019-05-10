FactoryBot.define do
  factory :sync_info do
    value { Faker::Number.unique.within(1..15) }
    status { 0 }
  end
end
