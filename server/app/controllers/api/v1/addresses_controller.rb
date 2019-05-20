module Api
  module V1
    class AddressesController < ApplicationController
      before_action :validate_query_params

      def show
        address = Address.find_by!(address_hash: params[:id])

        render json: AddressSerializer.new(address)
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
    end
  end
end
