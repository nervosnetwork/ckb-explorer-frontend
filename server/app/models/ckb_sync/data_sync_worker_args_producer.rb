module CkbSync
  class DataSyncWorkerArgsProducer
    include Concurrent::Async

    def initialize(current_worker_args)
      super()
      @current_worker_args = current_worker_args
    end

    def produce_worker_args(numbers)
      numbers.each do |number|
        # puts "number #{number}"
        @current_worker_args << [CkbSync::Api.instance.get_block_hash(number.to_s)]
      end
    end
  end
end
