class SlowRequestLogger
  MAX_QUERY_DURATION = 500
  MAX_VIEW_TIME = 100
  MAX_DB_TIME = 100

  def self.initialize!
    slow_logfile = File.open(Rails.root.join("log", "slow.log"), "a")
    slow_log = Logger.new(slow_logfile)
    slow_log.datetime_format = "%Y-%m-%d %H:%M:%S"
    slow_log.level = Logger::INFO

    ActiveSupport::Notifications.subscribe("sql.active_record") do |_name, start, finish, _id, payload|
      duration = (finish - start) * 1000

      if duration >= MAX_QUERY_DURATION
        slow_log.info("slow query detected: #{payload[:sql]}, binds: #{payload[:binds].map(&:value)}, duration: #{duration}")
      end
    end

    ActiveSupport::Notifications.subscribe "process_action.action_controller" do |_name, start, finish, _id, payload|
      duration = (finish - start) * 1000
      view_time = 0
      db_time = 0

      if view_time > MAX_VIEW_TIME
        slow_log.info("slow request (slow view) (#{duration.to_i}ms total, view: #{view_time.to_i}ms): #{payload[:path]} controller: #{payload[:controller]}, action: #{payload[:action]}")
        slow_logfile.flush
      end
      if db_time > MAX_DB_TIME
        slow_log.info("slow request (slow db) (#{duration.to_i}ms total, db: #{db_time.to_i}ms): #{payload[:path]} controller: #{payload[:controller]}, action: #{payload[:action]}")
        slow_logfile.flush
      end
      if duration > MAX_QUERY_DURATION
        slow_log.info("slow request (#{duration.to_i}ms, view: #{view_time.to_i}ms, db: #{db_time.to_i}ms): #{payload[:path]} controller: #{payload[:controller]}, action: #{payload[:action]}")
        slow_logfile.flush
      end
    end
  end
end

SlowRequestLogger.initialize!
