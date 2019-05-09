require "sidekiq/web"

redis_conn =
  proc {
    $redis
  }

Sidekiq.configure_server do |config|
  config.redis = ConnectionPool.new(size: 10, &redis_conn)
end
Sidekiq.configure_client do |config|
  config.redis = ConnectionPool.new(size: 25, &redis_conn)
end

# Auth sidekiq user in production env.
if Rails.env.production?
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    # Protect against timing attacks:
    # - See https://codahale.com/a-lesson-in-timing-attacks/
    # - See https://thisdata.com/blog/timing-attacks-against-string-comparison/
    # - Use & (do not use &&) so that it doesn't short circuit.
    # - Use digests to stop length information leaking (see also ActiveSupport::SecurityUtils.variable_size_secure_compare)
    ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_USERNAME"])) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_PASSWORD"]))
  end
end
