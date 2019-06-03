class StatisticInfo
  def initialize(difficulty_interval: nil, block_time_interval: nil, statistical_interval: nil)
    @difficulty_interval = difficulty_interval.presence || ENV["STATISTICAL_INTERVAL"]
    @block_time_interval = block_time_interval.presence || ENV["STATISTICAL_INTERVAL"]
    @statistical_interval = statistical_interval.presence || ENV["STATISTICAL_INTERVAL"]
  end

  def id
    Time.current.to_i
  end

  def tip_block_number
    CkbSync::Api.instance.get_tip_block_number
  end

  def average_difficulty

  end

  def average_block_time

  end

  def hash_rate

  end

  private

  attr_reader :difficulty_interval, :block_time_interval, :statistical_interval
end
