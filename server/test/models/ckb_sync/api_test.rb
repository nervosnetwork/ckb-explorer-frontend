require "test_helper"

module CkbSync
  class ApiTest < ActiveSupport::TestCase
    test "should contain related methods" do
      contained_method_names = CkbSync::Api::METHOD_NAMES
      sdk_api_names = CKB::API.instance_methods(false)

      assert_equal sdk_api_names.map(&:to_s).sort, contained_method_names.sort
    end
  end
end
