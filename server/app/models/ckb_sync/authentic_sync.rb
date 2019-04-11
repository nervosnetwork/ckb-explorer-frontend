module CkbSync
  class AuthenticSync
    class << self
      def start
        loop do
          sync_node_data

          break if Rails.env == "test"
          sleep(10)
        end
      end

      private

      def sync_node_data
        local_tip_block_number = SyncInfo.local_authentic_tip_block_number
        node_tip_block_number = CkbSync::Api.get_tip_block_number

        ((local_tip_block_number + 1)..(node_tip_block_number - 10)).each do |number|
          block_hash = CkbSync::Api.get_block_hash(number)
          SyncInfo.local_authentic_tip_block_number = number
          CheckBlockWorker.perform_async(block_hash)
        end
      end
    end
  end
end
