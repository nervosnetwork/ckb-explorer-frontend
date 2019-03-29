class CkbSync::Validator
  class << self
    def call(block_hash)
      node_block = CkbSync::Api.get_block(block_hash).deep_stringify_keys
      local_block = Block.find_by(number: node_block.dig("header", "number"))
      local_block.verify!(block.dig("header", "hash"))
    end
  end
end
