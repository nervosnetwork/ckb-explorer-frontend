require "test_helper"

module CkbSync
  class ApiTest < ActiveSupport::TestCase
    test "should contain related methods" do
      contained_method_names = %w(get_peers tx_pool_info get_blockchain_info compute_transaction_hash dry_run_transaction get_peers_state calculate_dao_maximum_withdraw rpc system_script_out_point system_script_code_hash inspect set_system_script_cell genesis_block system_script_cell get_block_by_number genesis_block_hash get_block_hash get_block get_tip_header get_tip_block_number get_cells_by_lock_hash get_transaction get_live_cell send_transaction local_node_info get_current_epoch get_epoch_by_number).freeze
      sdk_api_names = CKB::API.instance_methods(false)

      assert_equal sdk_api_names.map(&:to_s).sort, contained_method_names.sort
    end
  end
end
