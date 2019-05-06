require_relative "../config/environment"

loop do
  CkbSync::Persist.update_ckb_transaction_info_and_fee

  sleep(ENV["TRANSACTION_UPDATER_LOOP_INTERVAL"].to_i)
end