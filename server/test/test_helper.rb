require "simplecov"
SimpleCov.start "rails" do
  add_filter "/app/channels/"
  add_filter "/app/jobs/"
  add_filter "/app/mailers/"
end
require "database_cleaner"
require "minitest/reporters"
Minitest::Reporters.use!

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

VCR.configure do |config|
  config.cassette_library_dir = "vcr_fixtures/vcr_cassettes"
  config.hook_into :webmock
end
DatabaseCleaner.strategy = :transaction

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    # Choose a test framework:
    with.test_framework :minitest

    with.library :rails
  end
end

def prepare_inauthentic_node_data
  local_tip_block_number = -1
  SyncInfo.local_inauthentic_tip_block_number
  node_tip_block_number = 10
  ((local_tip_block_number + 1)..node_tip_block_number).each do |number|
    block_hash = nil
    VCR.use_cassette("block_hashes/#{number}") do
      block_hash = CkbSync::Api.get_block_hash(number)
    end

    SyncInfo.local_inauthentic_tip_block_number = number

    VCR.use_cassette("blocks/#{number}") do
      SaveBlockWorker.new.perform(block_hash, "inauthentic")
    end
  end
end

def create_block(status, block_hash = "0xed54818adbf956486a192989844d15d77bc937d8bcfcfc5e591a4f9e31e2cd2a")
  Block.create(
    cellbase_id: "0xe08894ef0ed80481448f7a584438a76b6bdbea178c02b4c3b40863d75c5aed3c",
    difficulty: "0x100",
    block_hash: block_hash,
    number: 10,
    parent_hash: "0xcba2d1a70602a1def80efbd59629c37a9d6c36f9de7a8ed6d1ca4f76389365e1",
    seal: { "nonce" => 1757392074788233522, "proof" => "0x5900000098000000d90e00004b110000de1500001b25000051380000973d00001e490000194c00003760000012680000" },
    timestamp: 1554100447138,
    txs_commit: "0xe08894ef0ed80481448f7a584438a76b6bdbea178c02b4c3b40863d75c5aed3c",
    txs_proposal: "0x0000000000000000000000000000000000000000000000000000000000000000",
    uncles_count: 1,
    uncles_hash: "0xa43e4bb916f6d08f746a055271049d3a61a5344ad266553454862ef68d41bc4d",
    version: 0,
    cell_consumed: 43,
    reward: 50000,
    total_transaction_fee: 0,
    ckb_transactions_count: 1,
    total_cell_capacity: 50000,
    status: status
  )
end

def create_uncle_block(block)
  cellbase = { "deps" => [], "hash" => "0x1d82a6d7bcefca69be3f2c7e43f88a18f4fd01eb05d06f4d2fe2df8a8afb350f", "inputs" => [{ "args" => ["0x0700000000000000"], "previous_output" => { "hash" => "0x0000000000000000000000000000000000000000000000000000000000000000", "index" => 4294967295 } }], "outputs" => [{ "data" => "0x", "lock" => { "args" => [], "version" => 0, "binary_hash" => "0x0000000000000000000000000000000000000000000000000000000000000001" }, "type" => nil, "capacity" => 50000 }], "version" => 0 }
  block.uncle_blocks.create(
    cellbase_id: "0x1d82a6d7bcefca69be3f2c7e43f88a18f4fd01eb05d06f4d2fe2df8a8afb350f",
    difficulty: "0x100",
    block_hash: "0xf6d9c070dfebb30eeb685d74836e7c7dcf82b61ef8214a769f50d9fa8b4ed783",
    number: 7,
    parent_hash: "0xe20604d760b8d13d76608fe74653554e727f81186697d976707d589a36948a59",
    seal: { "nonce" => 8352409816158401096, "proof" => "0xf20a0000772300002f240000013c0000df4100004c4a0000634a0000bb5800001c6100005d6e0000267000007d740000" },
    timestamp: 1554100397709,
    txs_commit: "0x1d82a6d7bcefca69be3f2c7e43f88a18f4fd01eb05d06f4d2fe2df8a8afb350f",
    txs_proposal: "0x0000000000000000000000000000000000000000000000000000000000000000",
    uncles_count: 0,
    uncles_hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    version: 0,
    proposal_transactions: [],
    proposal_transactions_count: 0,
    cellbase: cellbase,
    miner_hash: CKB::Utils.miner_hash(cellbase),
    reward: CKB::Utils.miner_reward(cellbase)
  )
end

def unpack_attribute(obj, attribute_name)
  attribute = obj.read_attribute(attribute_name)
  "#{ENV['DEFAULT_HASH_PREFIX']}#{attribute.unpack1('H*')}" if attribute.present?
end

def unpack_array_attribute(obj, attribute_name, array_size, hash_size)
  template = Array.new(array_size || 0).reduce("") { |memo, _item| "#{memo}H#{hash_size}" }
  attribute = obj.read_attribute(attribute_name)
  attribute.unpack(template.to_s).map { |hash| "#{ENV['DEFAULT_HASH_PREFIX']}#{hash}" }.reject(&:blank?) if attribute.present?
end

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
    def before_setup
      DatabaseCleaner.start
      super
    end

    def after_teardown
      super
      DatabaseCleaner.clean
    end
  end
end
