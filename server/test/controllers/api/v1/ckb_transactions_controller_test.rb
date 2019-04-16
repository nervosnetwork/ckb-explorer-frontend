require 'test_helper'

module Api
  module V1
    class CkbTransactionsControllerTest < ActionDispatch::IntegrationTest
      test "should get success code when call show" do
        ckb_transaction = create(:ckb_transaction)

        valid_get api_v1_ckb_transaction_url(ckb_transaction.tx_hash)

        assert_response :success
      end

      test "should set right content type when call show" do
        ckb_transaction = create(:ckb_transaction)

        valid_get api_v1_ckb_transaction_url(ckb_transaction.tx_hash)

        assert_equal "application/vnd.api+json", response.content_type
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        ckb_transaction = create(:ckb_transaction)

        get api_v1_ckb_transaction_url(ckb_transaction.tx_hash), headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        ckb_transaction = create(:ckb_transaction)

        error_object = {
          message: "Unsupported Media Type",
          errors: [
            {
              code: 1001,
              status: 415,
              title: "Unsupported Media Type",
              detail: "Content Type must be application/vnd.api+json",
              href: "https://github.com/nervosnetwork/ckb-explorer"
            }
          ]
        }

        get api_v1_ckb_transaction_url(ckb_transaction.tx_hash), headers: { "Content-Type": "text/plain" }

        assert_equal json, JSON.parse(error_object.to_json)
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        ckb_transaction = create(:ckb_transaction)

        get api_v1_ckb_transaction_url(ckb_transaction.tx_hash), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        ckb_transaction = create(:ckb_transaction)

        error_object = {
          message: "Not Acceptable",
          errors: [
            {
              code: 1002,
              status: 406,
              title: "Not Acceptable",
              detail: "Accept must be application/vnd.api+json",
              href: "https://github.com/nervosnetwork/ckb-explorer"
            }
          ]
        }.to_json

        get api_v1_ckb_transaction_url(ckb_transaction.tx_hash), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal json, JSON.parse(error_object)
      end

      test "should return error object when id is not a hex start with 0x" do
        error_object = {
          message: "URI parameters is invalid",
          errors: [
            {
              code: 1005,
              status: 422,
              title: "URI parameters is invalid",
              detail: "URI parameters should be a transaction hash",
              href: "https://github.com/nervosnetwork/ckb-explorer"
            }
          ]
        }.to_json

        valid_get api_v1_ckb_transaction_url("9034fwefwef")

        assert_equal json, JSON.parse(error_object)
      end

      test "should return error object when id is a hex start with 0x but it's length is wrong" do
        error_object = {
          message: "URI parameters is invalid",
          errors: [
            {
              code: 1005,
              status: 422,
              title: "URI parameters is invalid",
              detail: "URI parameters should be a transaction hash",
              href: "https://github.com/nervosnetwork/ckb-explorer"
            }
          ]
        }.to_json

        valid_get api_v1_ckb_transaction_url("0x9034fwefwef")

        assert_equal json, JSON.parse(error_object)
      end
    end
  end
end
