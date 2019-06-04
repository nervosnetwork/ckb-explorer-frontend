require "test_helper"

module Api
  module V1
    class StatisticsControllerTest < ActionDispatch::IntegrationTest
      setup do
        CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(100)
      end

      test "should get success code when call index" do
        valid_get api_v1_statistics_url

        assert_response :success
      end

      test "should set right content type when call index" do
        valid_get api_v1_statistics_url

        assert_equal "application/vnd.api+json", response.content_type
      end

      test "should respond with 415 Unsupported Media Type when Content-Type is wrong" do
        get api_v1_statistics_url, headers: { "Content-Type": "text/plain" }

        assert_equal 415, response.status
      end

      test "should respond with error object when Content-Type is wrong" do
        error_object = Api::V1::Exceptions::WrongContentTypeError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_statistics_url, headers: { "Content-Type": "text/plain" }

        assert_equal response_json, response.body
      end

      test "should respond with 406 Not Acceptable when Accept is wrong" do
        get api_v1_statistics_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal 406, response.status
      end

      test "should respond with error object when Accept is wrong" do
        error_object = Api::V1::Exceptions::WrongAcceptError.new
        response_json = RequestErrorSerializer.new([error_object], message: error_object.title).serialized_json

        get api_v1_statistics_url, headers: { "Content-Type": "application/vnd.api+json", "Accept": "application/json" }

        assert_equal response_json, response.body
      end

      test "the returned statistic info should contain right keys" do
        valid_get api_v1_statistics_url

        assert_equal %w(average_block_time average_difficulty hash_rate tip_block_number), json.dig("data", "attributes").keys.sort
      end

      test "should return right statistic info" do
        statistic_info = StatisticInfo.new

        valid_get api_v1_statistics_url

        assert_equal IndexStatisticSerializer.new(statistic_info).serialized_json, response.body
      end
    end
  end
end
