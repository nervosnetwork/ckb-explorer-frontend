require_relative "../config/environment"

def generate_sync_log(latest_from, latest_to)
  return if latest_from >= latest_to
  sync_infos =
    (latest_from..latest_to).map do |number|
      SyncInfo.new(name: "inauthentic_tip_block_number", value: number, status: "syncing")
    end

  SyncInfo.import sync_infos, batch_size: 1500, on_duplicate_key_ignore: true
end

inauthentic_sync_numbers = Concurrent::Set.new

loop do
  Rails.logger.info("inauthentic sync start")
  Rails.logger.info("inauthentic_sync_numbers size: #{inauthentic_sync_numbers.size}")
  local_tip_block_number = SyncInfo.local_inauthentic_tip_block_number
  node_tip_block_number = CkbSync::Api.instance.get_tip_block_number.to_i
  from = local_tip_block_number
  to = node_tip_block_number
  current_sync_round_numbers = Concurrent::Set.new

  generate_sync_log(from, to)

  return if Sidekiq::Queue.new("inauthentic_sync").size > 2000

  sync_info_values = SyncInfo.tip_inauthentic_syncing.recent.limit(1000).pluck(:value)

  return if sync_info_values.count == 0

  sync_info_values.each do |number|
    current_sync_round_numbers << number
  end

  Rails.logger.info("current_sync_round_numbers size: #{current_sync_round_numbers.size}")

  if inauthentic_sync_numbers.empty?
    sync_info_values.each do |number|
      inauthentic_sync_numbers << number
    end

    CkbSync::InauthenticSync.sync_node_data_by_number(inauthentic_sync_numbers)
  else
    Rails.logger.info("inauthentic there is no new number")
    sync_numbers = current_sync_round_numbers - inauthentic_sync_numbers
    if sync_numbers.present?
      sync_numbers.each do |number|
        inauthentic_sync_numbers << number
      end
      CkbSync::InauthenticSync.sync_node_data_by_number(sync_numbers)
    end
  end

  sleep(ENV["INAUTHENTICSYNC_LOOP_INTERVAL"].to_i)
end