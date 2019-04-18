module Api
  module V1
    class BlockTransactionsController < ApplicationController
      before_action :validate_query_params
      before_action :validate_pagination_params, :pagination_params

      def show
        block = Block.find_by!(block_hash: params[:id])
        ckb_transactions = block.ckb_transactions.recent.page(@page).per(@page_size)

        render json: CkbTransactionSerializer.new(ckb_transactions)
      rescue ActiveRecord::RecordNotFound
        raise Api::V1::Exceptions::BlockTransactionsNotFoundError
      end

      private

      def validate_query_params
        validator = Validations::BlockTransaction.new(params)

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

