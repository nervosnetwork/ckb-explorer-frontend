module Api
  module V1
    class CkbTransactionsController < ApplicationController
      before_action :validate_query_params, only: :show

      def show
        ckb_transaction = CkbTransaction.where(tx_hash: params[:id]).available.take!

        render json: CkbTransactionSerializer.new(ckb_transaction)
      rescue ActiveRecord::RecordNotFound
        raise Api::V1::Exceptions::CkbTransactionNotFoundError
      end

      private

      def validate_query_params
        validator = Validations::CkbTransaction.new(params)

        if validator.invalid?
          errors = validator.error_object[:errors]
          status = validator.error_object[:status]

          render json: errors, status: status
        end
      end
    end
  end
end
