require 'fast_jsonapi'

module FastJsonapi::ErrorSerializer
  extend ActiveSupport::Concern

  included do
    attr_accessor :with_root_key

    include FastJsonapi::ObjectSerializer
    set_id :title

    def initialize(resource, options = {})
      super
      @with_root_key = options[:with_root_key]
      @message = options[:message]
    end

    def hash_for_one_record
      serialized_hash = super[:data][:attributes]
      return !with_root_key ? serialized_hash : {
        message: @message,
        errors: serialized_hash
      }
    end

    def hash_for_collection
      serialized_hash = super[:data]&.map{|err| err[:attributes]}
      return !with_root_key ? serialized_hash : {
        message: @message,
        errors: serialized_hash
      }
    end
  end
end
