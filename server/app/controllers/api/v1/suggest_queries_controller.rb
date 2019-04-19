module Api
  module V1
    class SuggestQueriesController < ApplicationController
      before_action :validate_query_params

      def index
        json_response = SuggestQuery.new(params[:q]).find

        render json: json_response
      rescue ActiveRecord::RecordNotFound
        raise Api::V1::Exceptions::SuggestQueryResultNotFoundError
      end

      private

      def validate_query_params
        validator = Validations::Suggestquery.new(params)

        if validator.invalid?
          errors = validator.error_object[:errors]
          status = validator.error_object[:status]

          render json: errors, status: status
        end
      end
    end
  end
end
