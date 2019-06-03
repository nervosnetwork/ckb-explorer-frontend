class StatisticInfo
  def initialize(difficulty_interval: nil, block_time_interval: nil, hash_rate_statistical_interval: nil)
    @difficulty_interval = difficulty_interval.presence || ENV["DIFFICULTY_INTERVAL"]
    @block_time_interval = block_time_interval.presence || ENV["BLOCK_TIME_INTERVAL"]
    @hash_rate_statistical_interval = hash_rate_statistical_interval.presence || ENV["HASH_RATE_STATISTICAL_INTERVAL"]
  end

  def id
    Time.current.to_i
  end

  def tip_block_number
    CkbSync::Api.instance.get_tip_block_number
  end

  def average_difficulty
    blocks = Block.recent.take(difficulty_interval)
    return if blocks.empty?

    blocks.map { |block| block.difficulty.hex }.reduce(0, &:+) / blocks.size
  end

  def average_block_time

  end

  def hash_rate

  end

  private

  attr_reader :difficulty_interval, :block_time_interval, :hash_rate_statistical_interval
end
