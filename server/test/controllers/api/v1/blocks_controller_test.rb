require "test_helper"

module Api
  module V1
    class BlocksControllerTest < ActionDispatch::IntegrationTest
      test "should get success code when visit index" do
        get api_v1_blocks_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" }

        assert_response :success
      end

      test "should set right content type when visit index" do
        get api_v1_blocks_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" }

        assert_equal "application/vnd.api+json", @response.content_type
      end

      test "should get serialized objects" do
        create(:block)
        blocks = Block.all

        get api_v1_blocks_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" }

        assert_equal BlockSerializer.new(blocks).serialized_json, @response.body
      end

      test "serialized objects should in reverse order of id" do
        create_list(:block, 2, :with_block_hash)

        get api_v1_blocks_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" }

        first_block = json["data"].first
        last_block = json["data"].last

        assert_operator first_block["id"].to_i, :>, last_block["id"].to_i
      end

      test "should contain right keys in the serialized object" do
        create(:block)

        get api_v1_blocks_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" }

        response_block = JSON.parse(@response.body)["data"].first
        assert_equal %w(block_hash number transactions_count proposal_transactions_count uncles_count uncle_block_hashes reward total_transaction_fee cell_consumed total_cell_capacity miner_hash timestamp difficulty version nonce proof).sort, response_block["attributes"].keys.sort
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        get api_v1_blocks_url, headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        error_object = {
          message: "Unsupported Media Type",
          errors: [
            {
              code: 1001,
              status: 415,
              title: "Unsupported Media Type",
              detail: "Content Type must be application/vnd.api+json",
              href: "http://shaojunda.coding.me/doc/api_doc.html"
            }
          ]
        }

        get api_v1_blocks_url, headers: { "Content-Type": "text/plain" }

        assert_equal json, JSON.parse(error_object.to_json)
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        get api_v1_blocks_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        error_object = {
          message: "Not Acceptable",
          errors: [
            {
              code: 1002,
              status: 406,
              title: "Not Acceptable",
              detail: "Accept must be application/vnd.api+json",
              href: "http://shaojunda.coding.me/doc/api_doc.html"
            }
          ]
        }.to_json

        get api_v1_blocks_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal json, JSON.parse(error_object)
      end
    end
  end
end
