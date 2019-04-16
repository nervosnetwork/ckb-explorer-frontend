class CkbTransactionSerializer
  include FastJsonapi::ObjectSerializer

  attributes :block_number, :block_timestamp, :transaction_fee, :version, :display_inputs, :display_outputs

  attribute :transaction_hash do |object|
    object.tx_hash
  end
end
