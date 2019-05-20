module Validations
  class SuggestQuery
    include ActiveModel::Validations

    validate :query_key_format_must_be_correct

    def initialize(params = {})
      @query_key = params[:q]
    end

    def error_object
      api_errors = []

      if invalid?
        api_errors << Api::V1::Exceptions::SuggestQueryKeyInvalidError.new if :query_key.in?(errors.keys)
        {
          status: api_errors.first.status,
          errors: RequestErrorSerializer.new(api_errors, message: api_errors.first.title)
        }
      end
    end

    private

    attr_accessor :query_key

    def query_key_format_must_be_correct
      if query_key.blank? || (!integer_string? && !valid_hex? && !valid_address?)
        errors.add(:query_key, "query key is invalid")
      end
    end

    def integer_string?
      /\A\d+\z/.match?(query_key)
    end

    def valid_hex?
      start_with_default_hash_prefix? && length_is_valid? && hex_string?
    end

    def start_with_default_hash_prefix?
      query_key.start_with?(ENV["DEFAULT_HASH_PREFIX"])
    end

    def length_is_valid?
      query_key.length == ENV["DEFAULT_WITH_PREFIX_HASH_LENGTH"].to_i
    end

    def hex_string?
      !query_key.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])[/\H/]
    end

    def valid_address?
      CkbUtils.parse_address(query_key) rescue nil
    end
  end
end
