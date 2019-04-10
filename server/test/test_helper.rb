require "simplecov"
SimpleCov.start "rails" do
  add_filter "/app/channels/"
  add_filter "/app/jobs/"
  add_filter "/app/mailers/"
end
require "database_cleaner"
require "minitest/reporters"
require 'mocha/minitest'
Minitest::Reporters.use!

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
DEFAULT_NODE_BLOCK_HASH = "0x554b5658716ac7dc95c46971d461ea9eadbf43234c092a23c6f50bc02dbcaec8"

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

def unpack_attribute(obj, attribute_name)
  value = obj.read_attribute(attribute_name)
  return if value.nil?
  attribute_before_type_cast = obj.attributes_before_type_cast[attribute_name]
  unescapted_attribute = ActiveRecord::Base.connection.unescape_bytea(attribute_before_type_cast)
  "#{ENV['DEFAULT_HASH_PREFIX']}#{unescapted_attribute.unpack1('H*')}" if unescapted_attribute.present?
end

def unpack_array_attribute(obj, attribute_name, array_size, hash_length)
  value = obj.attributes_before_type_cast[attribute_name]
  return if value.nil?
  value = ActiveRecord::Base.connection.unescape_bytea(value)
  template = Array.new(array_size || 0).reduce("") { |memo, _item| "#{memo}H#{hash_length}" }
  template = "S!#{template}"
  value.unpack(template.to_s).drop(1).map { |hash| "#{ENV['DEFAULT_HASH_PREFIX']}#{hash}" }.reject(&:blank?)
end

def format_node_block(node_block)
  header = node_block["header"]
  proposal_transactions = node_block["proposal_transactions"]
  header.merge({ proposal_transactions: proposal_transactions }.deep_stringify_keys)
end

def format_node_block_commit_transaction(commit_transaction)
  commit_transaction.reject { |key, _value| key.in?(%w(inputs outputs)) }
end

def format_node_block_cell_output(cell_output)
  cell_output.select { |key, _value| key.in?(%w(capacity data)) }
end

def fake_node_block_with_type_script(node_block)
  lock = node_block["commit_transactions"].first["outputs"].first["lock"]
  node_block["commit_transactions"].first["outputs"].first["type"] = lock
end

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    # fixtures :all
    include FactoryBot::Syntax::Methods

    # Add more helper methods to be used by all tests here...
    def before_setup
      super
      DatabaseCleaner.start
    end

    def after_teardown
      super
      DatabaseCleaner.clean
    end
  end
end
