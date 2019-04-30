require_relative "../config/environment"

loop do
  CkbSync::AuthenticSync.sync_node_data

  sleep(ENV["AUTHENTICSYNC_LOOP_INTERVAL"].to_i)
end