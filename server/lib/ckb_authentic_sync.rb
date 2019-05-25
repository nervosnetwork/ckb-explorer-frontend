require_relative "../config/environment"

def generate_sync_log(latest_from, latest_to)
  sync_infos =
    (latest_from..latest_to).map do |number|
      SyncInfo.new(name: "authentic_tip_block_number", value: number, status: "syncing")
    end

  SyncInfo.import sync_infos, batch_size: 1500, on_duplicate_key_ignore: true
end

authentic_sync_numbers = Concurrent::Set.new

loop do
  Rails.logger.info("authentic sync start")
  Rails.logger.info("authentic_sync_numbers size: #{authentic_sync_numbers.size}")
  authentic_tip_block_number = SyncInfo.local_authentic_tip_block_number
  inauthentic_tip_block_number = SyncInfo.local_synced_inauthentic_tip_block_number
  from = authentic_tip_block_number
  to = inauthentic_tip_block_number - ENV["BLOCK_SAFETY_INTERVAL"].to_i
  current_sync_round_numbers = Concurrent::Set.new

  generate_sync_log(from, to)

  return if Sidekiq::Queue.new("authentic_sync").size > 1000

  sync_info_values = SyncInfo.tip_authentic_syncing.recent.limit(1000).pluck(:value)

  return if sync_info_values.count == 0

  sync_info_values.each do |number|
    current_sync_round_numbers << number
  end

  Rails.logger.info("current_sync_round_numbers size: #{current_sync_round_numbers.size}")

  if authentic_sync_numbers.empty?
    sync_info_values.each do |number|
      authentic_sync_numbers << number
    end

    CkbSync::AuthenticSync.sync_node_data_by_number(authentic_sync_numbers)
  else
    Rails.logger.info("authentic there is no new number")
    sync_numbers = current_sync_round_numbers - authentic_sync_numbers
    if sync_numbers.present?
      sync_numbers.each do |number|
        authentic_sync_numbers << number
      end
      CkbSync::AuthenticSync.sync_node_data_by_number(sync_numbers)
    end
  end

  sleep(ENV["AUTHENTICSYNC_LOOP_INTERVAL"].to_i)
end
