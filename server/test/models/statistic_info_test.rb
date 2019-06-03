require "test_helper"

class StatisticInfoTest < ActiveSupport::TestCase
  test "should has default difficulty interval" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.difficulty_interval
  end

  test "should has default block time interval" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.block_time_interval
  end

  test "should has default statistical interval" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.statistical_interval
  end

  test "the default difficulty interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["STATISTICAL_INTERVAL"], statistic_info.difficulty_interval
  end

  test "the default block time interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["STATISTICAL_INTERVAL"], statistic_info.block_time_interval
  end

  test "the default statistical interval should equal to env config" do
    statistic_info = StatisticInfo.new

    assert_equal ENV["STATISTICAL_INTERVAL"], statistic_info.statistical_interval
  end

  test "id should present" do
    statistic_info = StatisticInfo.new

    assert_not_nil statistic_info.id
  end
end
