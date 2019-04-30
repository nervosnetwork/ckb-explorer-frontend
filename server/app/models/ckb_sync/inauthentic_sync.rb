module CkbSync
  class InauthenticSync
    class << self
      def sync_node_data
        local_tip_block_number = SyncInfo.local_inauthentic_tip_block_number
        node_tip_block_number = CkbSync::Api.instance.get_tip_block_number.to_i
        from = local_tip_block_number + 1
        to = node_tip_block_number

        return if should_break?(from, to)

        (from..to).each do |number|
          block_hash = CkbSync::Api.instance.get_block_hash(number.to_s)
          SyncInfo.local_inauthentic_tip_block_number = number

          CkbSync::Persist.call(block_hash, "inauthentic")
          Rails.cache.delete("current_inauthentic_sync_round")
        end
      end

      def should_break?(latest_from, latest_to)
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
        Rails.cache.fetch("current_inauthentic_sync_round") { { from: from, to: to, uuid: uuid } }
      end
    end
  end
end
