module Api
  module V1
    class StatisticsController < ApplicationController
      def index
        statistic_info = StatisticInfo.new
        render json: IndexStatisticSerializer.new(statistic_info)
      end
    end
  end
end
