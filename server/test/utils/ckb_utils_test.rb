require "test_helper"

class CkbUtilsTest < ActiveSupport::TestCase
  test "#generate_address should return type1 address when use default lock script" do
    type1_address = "ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf"
    lock_script = CKB::Types::Script.generate_lock(
      "0x36c329ed630d6ce750712a477543672adab57f4c",
      ENV["CODE_HASH"]
    )

    assert_equal type1_address, CkbUtils.generate_address(lock_script)
  end
end