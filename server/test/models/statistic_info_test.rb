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

    assert_not_nil statistic_info.instance_variable_get(:@statistical_interval)
  end

  test "the default difficulty interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["STATISTICAL_INTERVAL"], statistic_info.instance_variable_get(:@difficulty_interval)
  end

  test "the default block time interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["STATISTICAL_INTERVAL"], statistic_info.instance_variable_get(:@block_time_interval)
  end

  test "the default statistical interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["STATISTICAL_INTERVAL"], statistic_info.instance_variable_get(:@statistical_interval)
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
    last_500_blocks = Block.recent.take(ENV["STATISTICAL_INTERVAL"])
    average_difficulty = last_500_blocks.map { |block| block.difficulty.hex }.reduce(&:+) / ENV["STATISTICAL_INTERVAL"].to_i

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
end
