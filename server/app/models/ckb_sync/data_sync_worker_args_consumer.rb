module CkbSync
  class DataSyncWorkerArgsConsumer
    def initialize(current_worker_args, worker_name)
      super()
      @current_worker_args = current_worker_args
      @worker_name = worker_name
    end

    def consume_worker_args(ivars)
      timer_task =
        Concurrent::TimerTask.new(execution_interval: 1) do |task|
          if ivars.any?(&:complete?) && @current_worker_args.empty?
            task.shutdown && (return)
          end
          if @current_worker_args.size >= 100 || ivars.any?(&:complete?)
            args = @current_worker_args.shift(100)
            Sidekiq::Client.push_bulk("class" => @worker_name, "args" => args)
          end
        end
      timer_task.execute
    end
  end
end
