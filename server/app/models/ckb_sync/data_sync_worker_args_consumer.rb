module CkbSync
  class DataSyncWorkerArgsConsumer
    def initialize(current_worker_args, worker_name, current_round_key)
      super()
      @current_worker_args = current_worker_args
      @worker_name = worker_name
      @current_round_key = current_round_key
    end

    def consume_worker_args(ivars)
      timer_task =
        Concurrent::TimerTask.new(execution_interval: 1) do |task|
          if ivars.any?(&:complete?) && @current_worker_args.empty?
            Rails.cache.delete(@current_round_key)
            task.shutdown && (return)
          end
          if @current_worker_args.size >= 1000 || ivars.any?(&:complete?)
            args = @current_worker_args.shift(1000)
            Sidekiq::Client.push_bulk("class" => @worker_name, "args" => args)
          end
        end
      timer_task.add_observer(TaskObserver.new)
      timer_task.execute
    end

    class TaskObserver
      def update(_time, result, _error)
        return if result

        Rails.cache.delete(@current_round_key)
      end
    end
  end
end
