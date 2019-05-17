module CkbSync
  class InauthenticSync
    class << self
      def sync_node_data(sync_numbers)
        Sidekiq::Client.push_bulk("class" => "SyncBlockWorker", "args" => sync_numbers.map { |number| [number] }, "queue" => "inauthentic_sync")
      end
    end
  end
end
