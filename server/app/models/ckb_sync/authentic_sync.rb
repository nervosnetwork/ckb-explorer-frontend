module CkbSync
  class AuthenticSync
    class << self
      def sync_node_data(sync_numbers)
        Sidekiq::Client.push_bulk("class" => "ValidateBlockWorker", "args" => sync_numbers.map { |number| [number] }, "queue" => "authentic_sync")

        CkbSync::Persist.update_ckb_transaction_info_and_fee
      end
    end
  end
end
