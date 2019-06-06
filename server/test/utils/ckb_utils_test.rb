require "test_helper"

class CkbUtilsTest < ActiveSupport::TestCase
  test "#generate_address should return type0 address when not use default lock script" do
    type0_address = "ckt1qqc8swt9xd3rxdf4xanrzvtzxf3rxdfnxf3k2ve4xf3xvefcxqcnwefevejrzvtyxy6ngce5vvmkvwtzxaskzctpx9jnvv33vg6nxwtpxqmsq7ua84a"
    lock_script = CKB::Types::Script.new(
      code_hash: "0x9e3b3557f11b2b3532ce352bfe8017e9fd11d154c4c7f9b7aaaa1e621b539a07",
      args: ["0x00"]
    )

    assert_equal type0_address, CkbUtils.generate_address(lock_script)
  end

  test "#generate_address should return type1 address when use default lock script" do
    type1_address = "ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf"
    lock_script = CKB::Types::Script.generate_lock(
      "0x36c329ed630d6ce750712a477543672adab57f4c",
      "0x9e3b3557f11b2b3532ce352bfe8017e9fd11d154c4c7f9b7aaaa1e621b539a08"
    )

    assert_equal type1_address, CkbUtils.generate_address(lock_script)
  end
end