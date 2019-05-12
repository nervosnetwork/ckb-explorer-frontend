require "test_helper"

module CkbSync
  class ApiTest < ActiveSupport::TestCase
    test "should contain related methods" do
      contained_method_names = CkbSync::Api::METHOD_NAMES
      sdk_api_names = CKB::API.instance_methods(false)

      assert_equal sdk_api_names.map(&:to_s).sort, contained_method_names.sort
    end

    test "should reassign api when current connected ckb node is down" do
      VCR.use_cassette("blocks/10", record: :new_episodes) do
        CKB::API.expects(:new).raises(JSON::ParserError).twice
        Settings.stubs(:hosts).returns(["http://localhost:8114"])
        ENV["CKB_NODE_URL"] = "http://localhost:8113"
        assert_raise JSON::ParserError do
          Class.new(CkbSync::Api).instance
        end
      end
    end

    test "should reassign api when call rpc the ckb node is down" do
      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/10", record: :new_episodes) do
          CKB::API.any_instance.expects(:send).raises(JSON::ParserError).twice
          Settings.stubs(:hosts).returns(["http://11.111.111.111:1111/"])
          api = Class.new(CkbSync::Api).instance

          assert_raise JSON::ParserError do
            api.get_tip_block_number
          end
        end
      end
    end
  end
end
