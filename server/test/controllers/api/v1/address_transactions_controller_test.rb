require "test_helper"

module Api
  module V1
    class AddressTransactionsControllerTest < ActionDispatch::IntegrationTest
      test "should get success code when call show" do
        account = create(:account, :with_transactions)

        valid_get api_v1_address_transaction_url(account.address_hash)

        assert_response :success
      end

      test "should set right content type when call show" do
        account = create(:account, :with_transactions)

        valid_get api_v1_address_transaction_url(account.address_hash)

        assert_equal "application/vnd.api+json", response.content_type
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        account = create(:account, :with_transactions)

        get api_v1_address_transaction_url(account.address_hash), headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        account = create(:account, :with_transactions)
        error_object = Api::V1::Exceptions::WrongContentTypeError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_address_transaction_url(account.address_hash), headers: { "Content-Type": "text/plain" }

        assert_equal response_json, response.body
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        account = create(:account, :with_transactions)

        get api_v1_address_transaction_url(account.address_hash), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        account = create(:account, :with_transactions)
        error_object = Api::V1::Exceptions::WrongAcceptError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_address_transaction_url(account.address_hash), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal response_json, response.body
      end

      test "should return error object when id is not a hex start with 0x" do
        error_object = Api::V1::Exceptions::AccountAddressHashInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_address_transaction_url("9034fwefwef")

        assert_equal response_json, response.body
      end

      test "should return error object when id is a hex start with 0x but it's length is wrong" do
        error_object = Api::V1::Exceptions::AccountAddressHashInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_address_transaction_url("0x9034fwefwef")

        assert_equal response_json, response.body
      end

      test "should return corresponding ckb transactions with given address hash" do
        account = create(:account, :with_transactions)
        ckb_transactions = account.ckb_transactions

        valid_get api_v1_address_transaction_url(account.address_hash)

        assert_equal CkbTransactionSerializer.new(ckb_transactions).serialized_json, response.body
      end

      test "should contain right keys in the serialized object when call show" do
        account = create(:account, :with_transactions)

        valid_get api_v1_address_transaction_url(account.address_hash)

        response_tx_transaction = json["data"].first

        assert_equal %w(block_number transaction_hash block_timestamp transaction_fee version display_inputs display_outputs).sort, response_tx_transaction["attributes"].keys.sort
      end

      test "should return error object when no records found by id" do
        error_object = Api::V1::Exceptions::AddressTransactionsNotFoundError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_address_transaction_url("0x3b138b3126d10ec000417b68bc715f17e86293d6cdbcb3fd8a628ad4a0b756f6")

        assert_equal response_json, response.body
      end
    end
  end
end
