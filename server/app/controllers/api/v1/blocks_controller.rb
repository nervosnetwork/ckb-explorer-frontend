module Api
  module V1
    class BlocksController < ApplicationController
      before_action :check_header_info

      def index
        blocks = Block.recent
        render json: BlockSerializer.new(blocks)
      end
    end
  end
end
