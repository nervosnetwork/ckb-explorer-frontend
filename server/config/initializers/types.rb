class CkbHashType < ActiveRecord::Type::Binary
  def deserialize(value)
    return if value.nil?

    if value.kind_of?(String)
      value = ActiveRecord::Base.connection.unescape_bytea(value)
    end
    "#{ENV['DEFAULT_HASH_PREFIX']}#{value.to_s.unpack1('H*')}"
  end

  def serialize(value)
    return if value.nil?

    if value.kind_of?(String) && value.start_with?("0x")
      value = [value.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*")
      ActiveRecord::Base.connection.escape_bytea(value)
    else
      super
    end
  end
end

class CkbArrayHashType < ActiveRecord::Type::Binary
  def initialize(hash_length:)
    @hash_length = hash_length
  end

  def deserialize(value)
    return if value.nil?

    if value.kind_of?(String)
      value = ActiveRecord::Base.connection.unescape_bytea(value)
    end
    array_size = value.unpack("S!").first
    template = Array.new(array_size || 0).reduce("") { |memo, _item| "#{memo}H#{@hash_length}" }
    template = "S!#{template}"
    value.unpack(template.to_s).drop(1).map { |hash| "#{ENV['DEFAULT_HASH_PREFIX']}#{hash}" }.reject(&:blank?)
  end

  def serialize(value)
    return if value.nil?

    if value.kind_of?(Array) && value.all? { |item| item.start_with?("0x") }
      template = Array.new(value.size).reduce("") { |memo, _item| "#{memo}H#{ENV['DEFAULT_HASH_LENGTH']}" }
      real_value = value.map { |hash| hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"]) }
      real_value.unshift(real_value.size)
      template = "S!#{template}"
      value = real_value.pack(template)
      ActiveRecord::Base.connection.escape_bytea(value)
    else
      super
    end
  end
end


ActiveRecord::Type.register(:ckb_hash, CkbHashType)
ActiveRecord::Type.register(:ckb_array_hash, CkbArrayHashType)
