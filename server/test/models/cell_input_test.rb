require "test_helper"

class CellInputTest < ActiveSupport::TestCase
  context "associations" do
    should belong_to(:ckb_transaction)
  end

  test "should return previous cell output's lock script" do
    cell_input = create(:cell_input, :with_full_transaction)

    lock_script = cell_input.find_lock_script!

    assert_equal previous_cell_output(cell_input.previous_output).lock_script, lock_script
  end
end
