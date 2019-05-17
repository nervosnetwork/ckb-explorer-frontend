require_relative "../config/environment"

Rails.cache.delete("current_inauthentic_sync_round")

loop do
  return if Sidekiq::Queue.new("inauthentic_sync").size > 1000

  CkbSync::InauthenticSync.sync_node_data

  sleep(ENV["INAUTHENTICSYNC_LOOP_INTERVAL"].to_i)
end