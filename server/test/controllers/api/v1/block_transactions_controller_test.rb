require 'test_helper'

module Api
  module V1
    class BlockTransactionsControllerTest < ActionDispatch::IntegrationTest
      test "should get success code when call show" do
        block = create(:block, :with_ckb_transactions)

        valid_get api_v1_block_transaction_url(block.block_hash)

        assert_response :success
      end

      test "should set right content type when call show" do
        block = create(:block, :with_ckb_transactions)

        valid_get api_v1_block_transaction_url(block.block_hash)

        assert_equal "application/vnd.api+json", response.content_type
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        block = create(:block, :with_ckb_transactions)

        get api_v1_block_transaction_url(block.block_hash), headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        block = create(:block, :with_ckb_transactions)
        error_object = Api::V1::Exceptions::WrongContentTypeError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_block_transaction_url(block.block_hash), headers: { "Content-Type": "text/plain" }

        assert_equal response_json, response.body
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        block = create(:block, :with_ckb_transactions)

        get api_v1_block_transaction_url(block.block_hash), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        block = create(:block, :with_ckb_transactions)
        error_object = Api::V1::Exceptions::WrongAcceptError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_block_transaction_url(block.block_hash), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal response_json, response.body
      end

      test "should return error object when id is not a hex start with 0x" do
        error_object = Api::V1::Exceptions::BlockHashInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_block_transaction_url("9034fwefwef")

        assert_equal response_json, response.body
      end

      test "should return error object when id is a hex start with 0x but it's length is wrong" do
        error_object = Api::V1::Exceptions::BlockHashInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_block_transaction_url("0x9034fwefwef")

        assert_equal response_json, response.body
      end

      test "should return corresponding ckb transactions with given block hash" do
        block = create(:block, :with_ckb_transactions)
        ckb_transactions = block.ckb_transactions.order(block_timestamp: :desc).limit(10)

        valid_get api_v1_block_transaction_url(block.block_hash)

        assert_equal CkbTransactionSerializer.new(ckb_transactions).serialized_json, response.body
      end

      test "should contain right keys in the serialized object when call show" do
        block = create(:block, :with_ckb_transactions)

        valid_get api_v1_block_transaction_url(block.block_hash)

        response_tx_transaction = json["data"].first

        assert_equal %w(block_number transaction_hash block_timestamp transaction_fee version display_inputs display_outputs).sort, response_tx_transaction["attributes"].keys.sort
      end

      test "should return error object when no records found by id" do
        error_object = Api::V1::Exceptions::BlockTransactionsNotFoundError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_block_transaction_url("0x3b138b3126d10ec000417b68bc715f17e86293d6cdbcb3fd8a628ad4a0b756f6")

        assert_equal response_json, response.body
      end

      test "should return error object when page param is invalid" do
        block = create(:block, :with_ckb_transactions)
        error_object = Api::V1::Exceptions::PageParamError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_block_transaction_url(block.block_hash), params: { page: "aaa" }

        assert_equal response_json, response.body
      end

      test "should return error object when page size param is invalid" do
        block = create(:block, :with_ckb_transactions)
        error_object = Api::V1::Exceptions::PageSizeParamError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_block_transaction_url(block.block_hash), params: { page_size: "aaa" }

        assert_equal response_json, response.body
      end

      test "should return error object when page and page size param are invalid" do
        errors = []
        block = create(:block, :with_ckb_transactions)
        errors << Api::V1::Exceptions::PageParamError.new
        errors << Api::V1::Exceptions::PageSizeParamError.new
        response_json = RequestErrorSerializer.new(errors, message: errors.first.title).serialized_json

        valid_get api_v1_block_transaction_url(block.block_hash), params: { page: "bbb", page_size: "aaa" }

        assert_equal response_json, response.body
      end

      test "should return 10 records when page and page_size are not set" do
        block = create(:block, :with_ckb_transactions, transactions_count: 15)

        valid_get api_v1_block_transaction_url(block.block_hash)

        assert_equal 10, json["data"].size
      end

      test "should return corresponding page's records when page is set and page_size is not set" do
        block = create(:block, :with_ckb_transactions, transactions_count: 30)
        block_ckb_transactions = block.ckb_transactions.order(block_timestamp: :desc).offset(10).limit(10)
        response_transaction = CkbTransactionSerializer.new(block_ckb_transactions).serialized_json

        valid_get api_v1_block_transaction_url(block.block_hash), params: { page: 2 }

        assert_equal response_transaction, response.body
        assert_equal 10, json["data"].size
      end

      test "should return corresponding records when page is not set and page_size is set" do
        block = create(:block, :with_ckb_transactions, transactions_count: 15)
        block_ckb_transactions = block.ckb_transactions.order(block_timestamp: :desc).limit(12)
        response_transaction = CkbTransactionSerializer.new(block_ckb_transactions).serialized_json

        valid_get api_v1_block_transaction_url(block.block_hash), params: { page_size: 12 }

        assert_equal response_transaction, response.body
        assert_equal 12, json["data"].size
      end

      test "should return the corresponding transactions when page and page_size is set" do
        block = create(:block, :with_ckb_transactions, transactions_count: 30)
        block_ckb_transactions = block.ckb_transactions.order(block_timestamp: :desc).offset(5).limit(5)
        response_transaction = CkbTransactionSerializer.new(block_ckb_transactions).serialized_json

        valid_get api_v1_block_transaction_url(block.block_hash), params: { page: 2, page_size: 5 }

        assert_equal response_transaction, response.body
      end
    end
  end
end
