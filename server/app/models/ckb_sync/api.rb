class CkbSync::Api
  METHOD_NAMES = %w(system_script_cell genesis_block genesis_block_hash get_block get_block_hash inspect get_tip_header get_tip_block_number get_cells_by_type_hash get_transaction get_live_cell send_transaction local_node_info trace_transaction get_transaction_trace system_script_out_point uri system_script_cell_hash set_system_script_cell)
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
