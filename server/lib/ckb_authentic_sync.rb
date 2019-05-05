require_relative "../config/environment"

Rails.cache.delete("current_authentic_sync_round")

loop do
  CkbSync::AuthenticSync.sync_node_data

  sleep(ENV["AUTHENTICSYNC_LOOP_INTERVAL"].to_i)
end