require "test_helper"

class AccountBookTest < ActiveSupport::TestCase
  context "associations" do
    should belong_to(:address)
    should belong_to(:ckb_transaction)
  end
end
