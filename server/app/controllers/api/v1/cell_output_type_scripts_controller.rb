module Api
  module V1
    class CellOutputTypeScriptsController < ApplicationController
      before_action :validate_query_params

      def show
        cell_output = CellOutput.find(params[:id])
        type_script = cell_output.type_script

        render json: TypeScriptSerializer.new(type_script)
      rescue ActiveRecord::RecordNotFound
        raise Api::V1::Exceptions::CellOutputNotFoundError
      end

      private

      def validate_query_params
        validator = Validations::CellOutput.new(params)

        if validator.invalid?
          errors = validator.error_object[:errors]
          status = validator.error_object[:status]

          render json: errors, status: status
        end
      end
    end
  end
end
