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
end
