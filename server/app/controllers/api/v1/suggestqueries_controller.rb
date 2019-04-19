module Api
  module V1
    class SuggestqueriesController < ApplicationController
      before_action :validate_query_params

      def index
        render json: {}
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
