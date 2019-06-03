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
    return if blocks.blank?

    blocks.map { |block| block.difficulty.hex }.reduce(0, &:+) / blocks.size
  end

  def average_block_time
    ended_at = Time.current
    started_at = ended_at - block_time_interval.to_i.hours
    blocks = Block.created_after(started_at.to_i).created_before(ended_at.to_i).order(:timestamp)
    return if blocks.blank?

    total_block_time(blocks, started_at) / blocks.size
  end

  def hash_rate
    blocks = Block.recent.take(hash_rate_statistical_interval)
    return if blocks.blank?

    total_difficulties = blocks.map { |block| block.difficulty.hex }.reduce(0, &:+)
    total_time = blocks.first.timestamp - blocks.last.timestamp

    total_difficulties.to_d / total_time
  end

  private

  attr_reader :difficulty_interval, :block_time_interval, :hash_rate_statistical_interval

  def total_block_time(blocks, started_at)
    (blocks.last.timestamp - started_at.to_i).to_d
  end
end
