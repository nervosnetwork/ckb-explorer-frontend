module Api
  module V1
    class AddressesController < ApplicationController
      before_action :validate_query_params

      def show
        address = Address.find_address!(params[:id])

        render json: json_response(address)
      rescue ActiveRecord::RecordNotFound
        raise Api::V1::Exceptions::AddressNotFoundError
      end

      private

      def validate_query_params
        validator = Validations::Address.new(params)

        if validator.invalid?
          errors = validator.error_object[:errors]
          status = validator.error_object[:status]

          render json: errors, status: status
        end
      end

      def json_response(address)
        if QueryKeyUtils.valid_hex?(params[:id])
          LockHashSerializer.new(address)
        else
          AddressSerializer.new(address)
        end
      end
    end
  end
end
