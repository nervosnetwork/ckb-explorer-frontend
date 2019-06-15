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
    ended_at = DateTime.now
    started_at = ended_at - block_time_interval.to_i.hours
    started_at_timestamp = started_at.strftime("%Q").to_i
    ended_at_timestamp = ended_at.strftime("%Q").to_i
    blocks = Block.created_after(started_at_timestamp).created_before(ended_at_timestamp).order(:timestamp)
    return if blocks.empty?

    total_block_time(blocks) / blocks.size
  end

  def hash_rate
    blocks = Block.recent.includes(:uncle_blocks).limit(hash_rate_statistical_interval.to_i)
    return if blocks.blank?

    total_difficulties = blocks.flat_map { |block| [block, *block.uncle_blocks] }.reduce(0) { |sum, block| sum + block.difficulty.hex }
    total_time = blocks.first.timestamp - blocks.last.timestamp

    total_difficulties.to_d / total_time / cycle_rate
  end

  private

  attr_reader :difficulty_interval, :block_time_interval, :hash_rate_statistical_interval

  def total_block_time(blocks)
    (blocks.last.timestamp - blocks.first.timestamp).to_d
  end

  def n_l(n, l)
    ((n - l + 1)..n).reduce(1, :*)
  end

  # this formula comes from https://www.youtube.com/watch?v=CLiKX0nOsHE&feature=youtu.be&list=PLvgCPbagiHgqYdVUj-ylqhsXOifWrExiq&t=1242
  # n and l is Cuckoo's params
  # on ckb testnet the value of 'n' is 2**15 and the value of 'l' is 12
  # the value of n and l and this formula are unstable, will change as the POW changes.
  def cycle_rate
    n = 2**15
    l = 12
    n_l(n, l).to_f / (n**l) * (n_l(n, l / 2)**2) / (n**l) / l
  end
end
