require "daemons"
require_relative "../config/environment"

options = {
  log_output: true,
  log_dir: Rails.root.join("log"),
  monitor: true,
  dir: Rails.root.join("tmp", "pids").to_s
}
Daemons.run_proc("#{Rails.env}_ckb_authentic_sync", options) do
  CkbSync::AuthenticSync.start
end
