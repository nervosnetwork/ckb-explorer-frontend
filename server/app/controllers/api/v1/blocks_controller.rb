module Api
  module V1
    class BlocksController < ApplicationController
      before_action :pagination_params

      def index
        blocks = Block.recent.page(@page).per(@page_size)

        render json: BlockSerializer.new(blocks)
      end

      def show
        block = Block.find_block(params[:id])

        render json: BlockSerializer.new(block)
      end

      private

      def pagination_params
        @page = params[:page] || 1
        @page_size = params[:page_size] || Block.default_per_page
      end
    end
  end
end
