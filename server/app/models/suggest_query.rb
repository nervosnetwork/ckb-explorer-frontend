class SuggestQuery
  def initialize(query_key)
    @query_key = query_key
  end

  def find!
    find_record_by_query_key!
  end

  private

  attr_reader :query_key

  def find_record_by_query_key!
    result =
      if QueryKeyUtils.integer_string?(query_key)
        find_block_by_number
      elsif QueryKeyUtils.valid_hex?(query_key)
        find_by_hex
      elsif QueryKeyUtils.valid_address?(query_key)
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

  def find_address_by_lock_hash
    address = Address.find_by(lock_hash: query_key)
    AddressSerializer.new(address) if address.present?
  end

  def find_by_hex
    find_block_by_hash || find_ckb_transaction_by_hash || find_address_by_lock_hash
  end
end
