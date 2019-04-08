require "test_helper"

class CellInputTest < ActiveSupport::TestCase
  context "associations" do
    should belong_to(:ckb_transaction)
  end
end
