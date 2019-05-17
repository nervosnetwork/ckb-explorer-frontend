require_relative "../config/environment"

Rails.cache.delete("current_authentic_sync_round")

loop do
  return if Sidekiq::Queue.new("authentic_sync").size > 1000

  CkbSync::AuthenticSync.sync_node_data

  sleep(ENV["AUTHENTICSYNC_LOOP_INTERVAL"].to_i)
end