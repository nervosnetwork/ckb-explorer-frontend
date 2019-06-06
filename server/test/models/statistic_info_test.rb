require "test_helper"

class StatisticInfoTest < ActiveSupport::TestCase
  test "should has default difficulty interval" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.instance_variable_get(:@difficulty_interval)
  end

  test "should has default block time interval" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.instance_variable_get(:@block_time_interval)
  end

  test "should has default statistical interval" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.instance_variable_get(:@hash_rate_statistical_interval)
  end

  test "the default difficulty interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["DIFFICULTY_INTERVAL"], statistic_info.instance_variable_get(:@difficulty_interval)
  end

  test "the default block time interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["BLOCK_TIME_INTERVAL"], statistic_info.instance_variable_get(:@block_time_interval)
  end

  test "the default statistical interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["HASH_RATE_STATISTICAL_INTERVAL"], statistic_info.instance_variable_get(:@hash_rate_statistical_interval)
  end

  test "id should present" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.id
  end

  test ".tip_block_number should return tip block number of the connected node" do
    statistic_info = StatisticInfo.new
    CkbSync::Api.any_instance.expects(:get_tip_block_number).returns(100)

    assert_equal 100, statistic_info.tip_block_number
  end

  test ".average_difficulty should return average of the last 500 blocks if use default average interval" do
    statistic_info = StatisticInfo.new
    create_list(:block, 500, :with_block_hash)
    last_500_blocks = Block.recent.take(ENV["DIFFICULTY_INTERVAL"])
    average_difficulty = last_500_blocks.map { |block| block.difficulty.hex }.reduce(0, &:+) / ENV["DIFFICULTY_INTERVAL"].to_i

    assert_equal average_difficulty, statistic_info.average_difficulty
  end

  test ".average_difficulty should return average of the total blocks if blocks count less then default average interval" do
    statistic_info = StatisticInfo.new
    block_count = 10
    create_list(:block, block_count, :with_block_hash)
    last_10_blocks = Block.recent.take(block_count)
    average_difficulty = last_10_blocks.map { |block| block.difficulty.hex }.reduce(&:+) / block_count

    assert_equal average_difficulty, statistic_info.average_difficulty
  end

  test ".average_block_time should return average block time within 24 hours" do
    statistic_info = StatisticInfo.new
    ended_at = DateTime.now
    10.times do |num|
      create(:block, :with_block_hash, timestamp: (ended_at - 23.hours).strftime("%Q").to_i + num)
    end

    started_at = ended_at - 24.hours
    started_at_timestamp = started_at.strftime("%Q").to_i
    ended_at_timestamp = ended_at.strftime("%Q").to_i
    blocks = Block.created_after(started_at_timestamp).created_before(ended_at_timestamp).order(:timestamp)
    index = 0
    total_block_time = 0
    blocks.each do
      next if index == 0

      total_block_time += blocks[index].timestamp - blocks[index - 1].timestamp
      index += 1
    end

    average_block_time = total_block_time.to_d / blocks.size
    assert average_block_time - statistic_info.average_block_time < 3000
  end

  test ".hash_rate should return average hash rate of the last 500 blocks" do
    statistic_info = StatisticInfo.new
    create_list(:block, 500, :with_block_hash)
    block_count = ENV["HASH_RATE_STATISTICAL_INTERVAL"]
    last_500_blocks = Block.recent.take(block_count)
    total_difficulties = last_500_blocks.map { |block| block.difficulty.hex }.reduce(0, &:+)
    total_time = last_500_blocks.first.timestamp - last_500_blocks.last.timestamp
    hash_rate = total_difficulties.to_d / total_time

    assert_equal hash_rate, statistic_info.hash_rate
  end
end
