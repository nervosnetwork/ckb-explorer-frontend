module QueryKeyUtils
  class << self
    def integer_string?(query_key)
      /\A\d+\z/.match?(query_key)
    end

    def valid_hex?(query_key)
      start_with_default_hash_prefix?(query_key) && length_is_valid?(query_key) && hex_string?(query_key)
    end

    def start_with_default_hash_prefix?(query_key)
      query_key.start_with?(ENV["DEFAULT_HASH_PREFIX"])
    end

    def length_is_valid?(query_key)
      query_key.length == ENV["DEFAULT_WITH_PREFIX_HASH_LENGTH"].to_i
    end

    def hex_string?(query_key)
      !query_key.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])[/\H/]
    end

    def valid_address?(query_key)
      CkbUtils.parse_address(query_key) rescue nil
    end
  end
end