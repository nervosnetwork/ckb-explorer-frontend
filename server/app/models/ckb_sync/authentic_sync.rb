module CkbSync
  class AuthenticSync
    class << self
      def sync_node_data
        authentic_tip_block_number = SyncInfo.local_authentic_tip_block_number
        inauthentic_tip_block_number = SyncInfo.local_inauthentic_tip_block_number
        from = authentic_tip_block_number + 1
        to = inauthentic_tip_block_number - ENV["BLOCK_SAFETY_INTERVAL"].to_i

        return if should_break?(from, to)

        block_hashes =
          (from..to).map do |number|
            SyncInfo.local_authentic_tip_block_number = number
            [CkbSync::Api.instance.get_block_hash(number.to_s)]
          end

        block_hashes_arr = block_hashes.each_slice(1000).to_a
        block_hashes_arr.each do |block_hashes_arr_item|
          Sidekiq::Client.push_bulk("class" => CheckBlockWorker, "args" => block_hashes_arr_item)
        end

        Rails.cache.delete("current_authentic_sync_round")

        CkbSync::Persist.update_ckb_transaction_info_and_fee
      end

      def should_break?(latest_from, latest_to)
        return true if latest_to < 0

        latest_uuid = SecureRandom.uuid
        cached_current_round = current_sync_round(latest_from, latest_to, latest_uuid)
        current_from = cached_current_round[:from]
        current_to = cached_current_round[:to]
        current_uuid = cached_current_round[:uuid]
        current_round_range = current_from..current_to
        latest_round_range = latest_from..latest_to

        return false if (current_round_range).eql?(latest_round_range) && current_uuid == latest_uuid

        (current_round_range).overlaps?(latest_round_range)
      end

      def current_sync_round(from, to, uuid)
        Rails.cache.fetch("current_authentic_sync_round", expires_in: 5.minutes) do
          { from: from, to: to, uuid: uuid }
        end
      end
    end
  end
end
