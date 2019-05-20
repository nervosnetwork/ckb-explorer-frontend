require "test_helper"

class CellOutputTest < ActiveSupport::TestCase
  context "associations" do
    should belong_to(:ckb_transaction)
    should belong_to(:address)
    should belong_to(:block)
    should have_one(:lock_script)
    should have_one(:type_script)
  end

  context "validations" do
    should validate_presence_of(:capacity)
    should validate_numericality_of(:capacity).
      is_greater_than_or_equal_to(0)
  end

  test "#to_node_cell_output should return correct hash" do
    cell_output = create_cell_output

    node_cell_output = { capacity: cell_output.capacity.to_s, data: cell_output.data, lock: cell_output.lock_script.to_node_lock, type: cell_output.type_script.to_node_type }.deep_stringify_keys

    assert_equal node_cell_output, cell_output.node_cell_output
  end
end
