class CkbSync::InauthenticSync
  class << self
    def start
      loop do
        sync_node_data
        sleep(1)
      end
    end

    private

    def sync_node_data
      local_tip_block_number = SyncInfo.local_inauthentic_tip_block_number
      node_tip_block_number = CkbSync::Api.get_tip_block_number
      ((local_tip_block_number + 1)..node_tip_block_number).each do |number|
        block_hash = CkbSync::Api.get_block_hash(number)
        SyncInfo.local_inauthentic_tip_block_number = number
        SaveBlockWorker.perform_async(block_hash, "inauthentic")
      end
    end
  end
end
