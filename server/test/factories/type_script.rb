FactoryBot.define do
  factory :type_script do
    args { [] }
    binary_hash { "0x#{SecureRandom.hex(32)}" }
  end
end
