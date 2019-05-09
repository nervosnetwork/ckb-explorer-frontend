module CkbSync
  class InauthenticSync
    class << self
      def sync_node_data
        local_tip_block_number = SyncInfo.local_inauthentic_tip_block_number
        node_tip_block_number = CkbSync::Api.instance.get_tip_block_number.to_i
        from = local_tip_block_number + 1
        to = node_tip_block_number

        return if should_break?(from, to)

        worker_args = Concurrent::Array.new
        ivars =
          (from..to).each_slice(1000).map do |numbers|
            worker_args_producer = CkbSync::DataSyncWorkerArgsProducer.new(worker_args)
            worker_args_producer.async.produce_worker_args(numbers)
          end

        worker_args_consumer = CkbSync::DataSyncWorkerArgsConsumer.new(worker_args, "SaveBlockWorker")
        worker_args_consumer.consume_worker_args(ivars)

        SyncInfo.local_inauthentic_tip_block_number = to
        Rails.cache.delete("current_inauthentic_sync_round")
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
        Rails.cache.fetch("current_inauthentic_sync_round", expires_in: 5.minutes) do
          { from: from, to: to, uuid: uuid }
        end
      end
    end
  end
end
