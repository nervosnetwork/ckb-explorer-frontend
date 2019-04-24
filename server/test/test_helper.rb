require "simplecov"
SimpleCov.start "rails" do
  add_filter "/app/channels/"
  add_filter "/app/jobs/"
  add_filter "/app/mailers/"
end
require "database_cleaner"
require "minitest/reporters"
require "mocha/minitest"
require "sidekiq/testing"
Minitest::Reporters.use!

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
DEFAULT_NODE_BLOCK_HASH = "0x12b1c1c0fb88ff8bd24cae167111e2bb7e6b8775adb08791dacdde3d5d087358".freeze

VCR.configure do |config|
  config.cassette_library_dir = "vcr_fixtures/vcr_cassettes"
  config.hook_into :webmock
  config.default_cassette_options[:match_requests_on] = [:method, :path, :body]
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
  local_tip_block_number = 0
  SyncInfo.local_inauthentic_tip_block_number
  node_tip_block_number = 10
  ((local_tip_block_number + 1)..node_tip_block_number).each do |number|
    block_hash = nil
    VCR.use_cassette("block_hashes/#{number}") do
      block_hash = CkbSync::Api.instance.get_block_hash(number.to_s)
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

def build_display_input_from_node_input(input)
  outpoint = input["previous_output"]
  previous_transaction_hash = outpoint["hash"]
  previous_output_index = outpoint["index"]

  if CellOutput::BASE_HASH == previous_transaction_hash
    { id: nil, from_cellbase: true, capacity: CellOutput::INITIAL_BLOCK_REWARD, address_hash: nil }.stringify_keys
  else
    VCR.use_cassette("blocks/") do
      commit_transaction = CkbSync::Api.instance.get_transaction(previous_transaction_hash)
      previous_output = commit_transaction["outputs"][previous_output_index]
      build_display_info_from_node_output(previous_output)
    end
  end
end

def build_display_info_from_node_output(output)
  lock = output["lock"]
  lock_script = LockScript.find_by(args: lock["args"], binary_hash: lock["binary_hash"])
  cell_output = lock_script.cell_output
  { id: cell_output.id, capacity: cell_output.capacity.to_s, address_hash: cell_output.address_hash }.stringify_keys
end

def set_default_lock_params(node_block: block, args: ["0xc30257c81dde7766fc98882ff1e9f8e95abbe79345982e12c6a849de90cbbad1"], binary_hash: "0x#{SecureRandom.hex(32)}")
  tx = node_block["commit_transactions"].first
  output = tx["outputs"].first
  output["lock"]["args"] = args
  output["lock"]["binary_hash"] = binary_hash
end


def prepare_api_wrapper
  VCR.use_cassette("genesis_block") do
    CkbSync::Api.instance
  end
end

def previous_cell_output(previous_output)
  tx_hash = previous_output["hash"]
  output_index = previous_output["index"]

  raise ActiveRecord::RecordNotFound if CellOutput::BASE_HASH == tx_hash

  previous_transacton = CkbTransaction.find_by!(tx_hash: tx_hash)
  previous_transacton.cell_outputs.order(:id)[output_index]
end


module RequestHelpers
  def json
    JSON.parse(response.body)
  end

  def valid_get(uri, opts = {})
    params = {}
    params[:params] = opts[:params] || {}
    params[:headers] = { "Content-Type": "application/vnd.api+json", "Accept": "application/vnd.api+json" }
    send :get, uri, params
  end
end

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    # fixtures :all
    include FactoryBot::Syntax::Methods
    include ::RequestHelpers

    # Add more helper methods to be used by all tests here...
    def before_setup
      super
      DatabaseCleaner.start
    end

    def after_setup
      prepare_api_wrapper
    end

    def after_teardown
      super
      DatabaseCleaner.clean
      Sidekiq::Worker.clear_all
    end
  end
end
