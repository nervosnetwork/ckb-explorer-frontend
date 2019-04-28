module Api
  module V1
    class CellInputTypeScriptsController < ApplicationController
      before_action :validate_query_params

      def show
        cell_input = CellInput.find(params[:id])
        type_script = cell_input.find_type_script!

        render json: TypeScriptSerializer.new(type_script)
      rescue ActiveRecord::RecordNotFound
        raise Api::V1::Exceptions::CellInputNotFoundError
      end

      private

      def validate_query_params
        validator = Validations::CellInput.new(params)

        if validator.invalid?
          errors = validator.error_object[:errors]
          status = validator.error_object[:status]

          render json: errors, status: status
        end
      end
    end
  end
end
