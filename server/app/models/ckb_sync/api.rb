module CkbSync
  class Api
    include Singleton

    METHOD_NAMES = %w(system_script_out_point dry_run_transaction set_system_script_cell system_script_cell system_script_cell_hash genesis_block get_block_by_number genesis_block_hash get_block_hash get_block get_tip_header get_tip_block_number get_cells_by_lock_hash get_transaction get_live_cell local_node_info get_current_epoch get_epoch_by_number get_peers tx_pool_info get_blockchain_info get_peers_state compute_transaction_hash).freeze

    def initialize
      @hosts = Settings.hosts
      @api = CKB::API.new(host: ENV["CKB_NODE_URL"])
    rescue JSON::ParserError
      reassign_api
    end

    METHOD_NAMES.each do |name|
      define_method name do |*params|
        call_rpc(name, params: params)
      end
    end

    def call_rpc(method, params: [])
      @api.send(method, *params)
    rescue JSON::ParserError
      reassign_api.send(method, *params)
    end

    private

    def reassign_api
      @api = CKB::API.new(host: available_host)
    end

    def available_host
      @hosts.map { |host| host if connectable?(host) }.compact.sample
    end

    def connectable?(host)
      uri = URI(host)
      http = Net::HTTP.new(uri.host, uri.port)
      request = Net::HTTP::Post.new(uri.request_uri)
      request["Content-Type"] = "application/json"
      response = http.request(request)
      response.code == "200"
    end
  end
end
