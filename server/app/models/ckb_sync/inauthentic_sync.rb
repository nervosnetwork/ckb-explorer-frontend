module CkbSync
  class InauthenticSync
    class << self
      def sync_node_data
        local_tip_block_number = SyncInfo.local_inauthentic_tip_block_number
        node_tip_block_number = CkbSync::Api.instance.get_tip_block_number.to_i

        ((local_tip_block_number + 1)..node_tip_block_number).each do |number|
          block_hash = CkbSync::Api.instance.get_block_hash(number.to_s)

          SyncInfo.local_inauthentic_tip_block_number = number
          CkbSync::Persist.call(block_hash, "inauthentic")
        end
      end
    end
  end
end
