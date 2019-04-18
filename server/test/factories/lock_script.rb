FactoryBot.define do
  factory :lock_script do
    address

    args { [] }
    binary_hash { "0x#{SecureRandom.hex(32)}" }
  end
end
