class Suggestquery
  def initialize(query_key)
    @query_key = query_key
  end

  def find
    find_record_by_query_key
  end

  private

  attr_reader :query_key

  def find_record_by_query_key
    result = nil
    result = find_block_by_number if integer_string?
    result = find_by_hex if valid_hex?

    result
  end

  def find_block_by_number
    block = Block.find_by(number: query_key)
    BlockSerializer.new(block) if block.present?
  end

  def find_block_by_hash
    block = Block.find_by(block_hash: query_key)
    BlockSerializer.new(block) if block.present?
  end

  def find_ckb_transaction_by_hash
    ckb_transaction = CkbTransaction.find_by(tx_hash: query_key)
    CkbTransactionSerializer.new(ckb_transaction) if ckb_transaction.present?
  end

  def find_address_by_hash
    address = Address.find_by(address_hash: query_key)
    AddressSerializer.new(address) if address.present?
  end

  def find_by_hex
    find_block_by_hash || find_ckb_transaction_by_hash || find_address_by_hash
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
end
