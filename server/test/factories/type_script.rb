FactoryBot.define do
  factory :type_script do
    args { [] }
    code_hash { "0x#{SecureRandom.hex(32)}" }
  end
end
