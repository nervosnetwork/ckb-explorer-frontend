module Api
  module V1
    class CkbTransactionsController < ApplicationController
      def show
        ckb_transaction = CkbTransaction.find_ckb_transaction(params[:id])

        render json: CkbTransactionSerializer.new(ckb_transaction)
      end
    end
  end
end
