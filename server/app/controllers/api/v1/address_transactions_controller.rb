module Api
  module V1
    class AddressTransactionsController < ApplicationController
      before_action :validate_query_params
      before_action :validate_pagination_params, :pagination_params

      def show
        address = Address.find_by!(address_hash: params[:id])
        ckb_transactions = address.ckb_transactions.available.recent.page(@page).per(@page_size)
        options = FastJsonapi::PaginationMetaGenerator.new(request: request, records: ckb_transactions, page: @page, page_size: @page_size).call

        render json: CkbTransactionSerializer.new(ckb_transactions, options)
      rescue ActiveRecord::RecordNotFound
        raise Api::V1::Exceptions::AddressNotFoundError
      end

      private

      def validate_query_params
        validator = Validations::AddressTransaction.new(params)

        if validator.invalid?
          errors = validator.error_object[:errors]
          status = validator.error_object[:status]

          render json: errors, status: status
        end
      end

      def pagination_params
        @page = params[:page] || 1
        @page_size = params[:page_size] || CkbTransaction.default_per_page
      end
    end
  end
end
