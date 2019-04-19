require "test_helper"

module Api
  module V1
    class SuggestQueriesControllerTest < ActionDispatch::IntegrationTest
      test "should get success code when call show" do
        block = create(:block)
        valid_get api_v1_suggest_queries_url, params: { q: block.number }

        assert_response :success
      end

      test "should set right content type when call show" do
        valid_get api_v1_suggest_queries_url("0x3b238b3326d10ec000417b68bc715f17e86293d6cdbcb3fd8a628ad4a0b756f6")

        assert_equal "application/vnd.api+json", response.content_type
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        get api_v1_suggest_queries_url, params: { q: "12" }, headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        error_object = Api::V1::Exceptions::WrongContentTypeError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_suggest_queries_url, params: { q: "12" }, headers: { "Content-Type": "text/plain" }

        assert_equal response_json, response.body
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        get api_v1_suggest_queries_url, params: { q: "12" }, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        error_object = Api::V1::Exceptions::WrongAcceptError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_suggest_queries_url, params: { q: "12" }, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal response_json, response.body
      end

      test "should response with error object when query key is neither integer nor hash" do
        error_object = Api::V1::Exceptions::SuggestQueryKeyInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: "0x3b238b3326d10ec000417b6&^&bc715f17e86293d6cdbcb3fd8a628ad4a0b756f6" }

        assert_equal response_json, response.body
      end

      test "should response with error object when query key is not a hex start with 0x" do
        error_object = Api::V1::Exceptions::SuggestQueryKeyInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: "3b238b3326d10ec000417b68bc715f17e86293d6cdbcb3fd8a628ad4a0b756f6" }

        assert_equal response_json, response.body
      end

      test "should return error object when query key is a hex start with 0x but the length is wrong" do
        error_object = Api::V1::Exceptions::SuggestQueryKeyInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: "0x3b238b3326d10ec0004" }

        assert_equal response_json, response.body
      end

      test "should return a block when query key is a exist block height" do
        block = create(:block)
        response_json = BlockSerializer.new(block).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: block.number }

        assert_equal response_json, response.body
      end

      test "should return a block when query key is a exist block hash" do
        block = create(:block)
        response_json = BlockSerializer.new(block).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: block.block_hash }

        assert_equal response_json, response.body
      end

      test "should return a ckb transaction when query key is a exist ckb transaction hash" do
        ckb_transaction = create(:ckb_transaction)
        response_json = CkbTransactionSerializer.new(ckb_transaction).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: ckb_transaction.tx_hash }

        assert_equal response_json, response.body
      end

      test "should return address when query key is a exist address hash" do
        address = create(:address, :with_lock_script)
        response_json = AddressSerializer.new(address).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: address.address_hash }

        assert_equal response_json, response.body
      end

      test "should return error object when no records found by a integer query key" do
        error_object = Api::V1::Exceptions::SuggestQueryResultNotFoundError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: 1 }

        assert_equal response_json, response.body
      end

      test "should return error object when no records found by a hex query key" do
        error_object = Api::V1::Exceptions::SuggestQueryResultNotFoundError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_suggest_queries_url, params: { q: "0x4b238b3326d10ec000417b68bc715f17e86293d6cdbcb3fd8a628ad4a0b756f6" }

        assert_equal response_json, response.body
      end
    end
  end
end
