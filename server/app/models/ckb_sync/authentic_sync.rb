module CkbSync
  class AuthenticSync
    class << self
      def sync_node_data
        local_tip_block_number = SyncInfo.local_authentic_tip_block_number
        node_tip_block_number = CkbSync::Api.instance.get_tip_block_number.to_i

        ((local_tip_block_number + 1)..(node_tip_block_number - ENV["BLOCK_SAFETY_INTERVAL"].to_i)).each do |number|
          block_hash = CkbSync::Api.instance.get_block_hash(number.to_s)
          SyncInfo.local_authentic_tip_block_number = number

          CkbSync::Validator.call(block_hash)
        end
      end
    end
  end
end
