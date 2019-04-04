module CkbSync
  class Api
    METHOD_NAMES = %w(local_node_info genesis_block get_transaction_trace trace_transaction get_live_cell inspect set_system_script_cell system_script_cell get_block genesis_block_hash get_block_hash get_tip_header get_tip_block_number get_cells_by_lock_hash get_transaction uri system_script_cell_hash send_transaction system_script_out_point).freeze
    class << self
      METHOD_NAMES.each do |name|
        define_method name do |*params|
          call_rpc(name, params: params)
        end
      end

      def call_rpc(method, params: [])
        ckb_node_url = ENV["CKB_NODE_URL"]
        api = CKB::API.new(host: ckb_node_url)
        api.send(method, *params)
      end
    end
  end
end
