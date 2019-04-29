require_relative "../config/environment"

loop do
  CkbSync::InauthenticSync.sync_node_data

  break if Rails.env.test?

  sleep(ENV["INAUTHENTICSYNC_LOOP_INTERVAL"].to_i)
end