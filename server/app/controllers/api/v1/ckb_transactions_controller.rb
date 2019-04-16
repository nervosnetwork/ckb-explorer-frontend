module Api
  module V1
    class CkbTransactionsController < ApplicationController
      def show
        ckb_transaction = CkbTransaction.find_ckb_transaction(params[:id])
        render json: ckb_transaction.to_json
      end
    end
  end
end
