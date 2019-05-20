require "test_helper"

module Api
  module V1
    class CellOutputDataControllerTest < ActionDispatch::IntegrationTest
      test "should get success code when call show" do
        cell_output = create_cell_output

        valid_get api_v1_cell_output_datum_url(cell_output.id)

        assert_response :success
      end

      test "should set right content type when call show" do
        cell_output = create_cell_output

        valid_get api_v1_cell_output_datum_url(cell_output.id)

        assert_equal "application/vnd.api+json", response.content_type
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        cell_output = create_cell_output

        get api_v1_cell_output_datum_url(cell_output.id), headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        cell_output = create_cell_output
        error_object = Api::V1::Exceptions::WrongContentTypeError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_cell_output_datum_url(cell_output.id), headers: { "Content-Type": "text/plain" }

        assert_equal response_json, response.body
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        cell_output = create_cell_output

        get api_v1_cell_output_datum_url(cell_output.id), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        cell_output = create_cell_output
        error_object = Api::V1::Exceptions::WrongAcceptError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_cell_output_datum_url(cell_output.id), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal response_json, response.body
      end

      test "should return error object when id is not a integer" do
        error_object = Api::V1::Exceptions::CellOutputIdInvalidError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_cell_output_datum_url("ssdww")

        assert_equal response_json, response.body
      end

      test "should return available records" do
        cell_output = create_cell_output

        valid_get api_v1_cell_output_datum_url(cell_output.id)

        assert_equal "live", cell_output.status
      end

      test "should return error object when no available cell output found by id" do
        cell_output = create_cell_output(status: "abandoned")
        error_object = Api::V1::Exceptions::CellOutputNotFoundError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_cell_output_datum_url(cell_output.id)

        assert_equal response_json, response.body
      end

      test "should return corresponding data with given cell output id" do
        cell_output = create_cell_output

        valid_get api_v1_cell_output_datum_url(cell_output.id)

        assert_equal CellOutputDataSerializer.new(cell_output).serialized_json, response.body
      end

      test "should contain right keys in the serialized object when call show" do
        cell_output = create_cell_output

        valid_get api_v1_cell_output_datum_url(cell_output.id)

        assert_equal %w(data).sort, json["data"]["attributes"].keys.sort
      end

      test "should return error object when no cell output found by id" do
        error_object = Api::V1::Exceptions::CellOutputNotFoundError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        valid_get api_v1_cell_output_datum_url(99)

        assert_equal response_json, response.body
      end

      test "should return null when found record hasn't data" do
        cell_output = create_cell_output(trait_type: :with_full_transaction_but_no_type_script)

        valid_get api_v1_cell_output_datum_url(cell_output.id)

        assert_nil json.dig("data", "attributes", "data")
        assert_equal CellOutputDataSerializer.new(cell_output).serialized_json, response.body
      end
    end
  end
end
