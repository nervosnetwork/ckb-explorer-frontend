require "test_helper"

module Api
  module V1
    class CellOutputTypeScriptsControllerTest < ActionDispatch::IntegrationTest
      test "should get success code when call show" do
        cell_output = create(:cell_output, :with_full_transaction)

        valid_get api_v1_cell_output_type_script_url(cell_output.id)

        assert_response :success
      end

      test "should set right content type when call show" do
        cell_output = create(:cell_output, :with_full_transaction)

        valid_get api_v1_cell_output_type_script_url(cell_output.id)

        assert_equal "application/vnd.api+json", response.content_type
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        cell_output = create(:cell_output, :with_full_transaction)

        get api_v1_cell_output_type_script_url(cell_output.id), headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        cell_output = create(:cell_output, :with_full_transaction)
        error_object = Api::V1::Exceptions::WrongContentTypeError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_cell_output_type_script_url(cell_output.id), headers: { "Content-Type": "text/plain" }

        assert_equal response_json, response.body
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        cell_output = create(:cell_output, :with_full_transaction)

        get api_v1_cell_output_type_script_url(cell_output.id), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        cell_output = create(:cell_output, :with_full_transaction)
        error_object = Api::V1::Exceptions::WrongAcceptError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_cell_output_type_script_url(cell_output.id), headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal response_json, response.body
      end
    end
  end
end
