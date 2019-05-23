class SuggestQuery
  def initialize(query_key)
    @query_key = query_key
  end

  def find
    find_record_by_query_key
  end

  private

  attr_reader :query_key

  def find_record_by_query_key
    result =
      if integer_string?
        find_block_by_number
      elsif valid_hex?
        find_by_hex
      elsif valid_address?
        find_address_by_hash
      end

    raise ActiveRecord::RecordNotFound if result.blank?

    result
  end

  def find_block_by_number
    block = Block.where(number: query_key).available.first
    BlockSerializer.new(block) if block.present?
  end

  def find_block_by_hash
    block = Block.where(block_hash: query_key).available.first
    BlockSerializer.new(block) if block.present?
  end

  def find_ckb_transaction_by_hash
    ckb_transaction = CkbTransaction.where(tx_hash: query_key).available.first
    CkbTransactionSerializer.new(ckb_transaction) if ckb_transaction.present?
  end

  def find_address_by_hash
    address = Address.find_by(address_hash: query_key)
    AddressSerializer.new(address) if address.present?
  end

  def find_by_hex
    find_block_by_hash || find_ckb_transaction_by_hash
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
