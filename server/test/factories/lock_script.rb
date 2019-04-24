FactoryBot.define do
  factory :lock_script do
    address

    args { ["0x#{SecureRandom.hex(32)}"] }
    binary_hash { "0x#{SecureRandom.hex(32)}" }
  end
end
