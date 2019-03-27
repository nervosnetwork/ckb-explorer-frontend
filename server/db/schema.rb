# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_03_27_074238) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "account_books", force: :cascade do |t|
    t.bigint "account_id"
    t.bigint "ckb_transaction_id"
    t.integer "transactions_count", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_account_books_on_account_id"
    t.index ["ckb_transaction_id"], name: "index_account_books_on_ckb_transaction_id"
  end

  create_table "accounts", force: :cascade do |t|
    t.integer "balance"
    t.binary "address_hash"
    t.integer "cell_consumed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["address_hash"], name: "index_accounts_on_address_hash", unique: true
  end

  create_table "blocks", force: :cascade do |t|
    t.binary "cellbase_id"
    t.binary "difficulty"
    t.binary "block_hash"
    t.integer "number"
    t.binary "parent_hash"
    t.jsonb "seal"
    t.integer "timestamp"
    t.binary "txs_commit"
    t.binary "txs_proposal"
    t.integer "uncles_count"
    t.binary "uncles_hash"
    t.string "uncle_block_hashes"
    t.integer "version"
    t.binary "proposal_transactions"
    t.integer "proposal_transactions_count"
    t.integer "cell_consumed"
    t.binary "miner_hash"
    t.integer "status"
    t.integer "reward"
    t.integer "total_transaction_fee"
    t.integer "transactions_count"
    t.integer "total_cell_capacity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["block_hash", "status"], name: "index_blocks_on_block_hash_and_status"
    t.index ["block_hash"], name: "index_blocks_on_block_hash", unique: true
    t.index ["number", "status"], name: "index_blocks_on_number_and_status"
  end

  create_table "cell_inputs", force: :cascade do |t|
    t.jsonb "previous_output"
    t.bigint "ckb_transaction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ckb_transaction_id"], name: "index_cell_inputs_on_ckb_transaction_id"
  end

  create_table "cell_outputs", force: :cascade do |t|
    t.integer "capacity"
    t.binary "data"
    t.bigint "ckb_transaction_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ckb_transaction_id"], name: "index_cell_outputs_on_ckb_transaction_id"
  end

  create_table "ckb_transactions", force: :cascade do |t|
    t.binary "tx_hash"
    t.jsonb "deps"
    t.bigint "block_id"
    t.integer "block_number"
    t.integer "block_timestamp"
    t.jsonb "display_input"
    t.jsonb "display_output"
    t.integer "status"
    t.integer "transaction_fee"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["block_id"], name: "index_ckb_transactions_on_block_id"
    t.index ["tx_hash", "status"], name: "index_ckb_transactions_on_tx_hash_and_status"
    t.index ["tx_hash"], name: "index_ckb_transactions_on_tx_hash", unique: true
  end

  create_table "lock_scripts", force: :cascade do |t|
    t.binary "args"
    t.binary "binary"
    t.binary "reference"
    t.binary "signed_args"
    t.integer "version"
    t.bigint "cell_output_id"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_lock_scripts_on_account_id"
    t.index ["cell_output_id"], name: "index_lock_scripts_on_cell_output_id"
  end

  create_table "sync_infos", force: :cascade do |t|
    t.string "name"
    t.integer "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_sync_infos_on_name"
  end

  create_table "type_scripts", force: :cascade do |t|
    t.binary "args"
    t.binary "binary"
    t.binary "reference"
    t.binary "signed_args"
    t.integer "version"
    t.bigint "cell_output_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cell_output_id"], name: "index_type_scripts_on_cell_output_id"
  end

  create_table "uncle_blocks", force: :cascade do |t|
    t.binary "cellbase_id"
    t.binary "difficulty"
    t.binary "block_hash"
    t.integer "number"
    t.binary "parent_hash"
    t.jsonb "seal"
    t.integer "timestamp"
    t.binary "txs_commit"
    t.binary "txs_proposal"
    t.binary "uncles_hash"
    t.integer "version"
    t.binary "proposal_transactions"
    t.integer "proposal_transactions_count"
    t.integer "cell_consumed"
    t.binary "miner_hash"
    t.integer "status"
    t.integer "reward"
    t.integer "total_transaction_fee"
    t.integer "transactions_count"
    t.integer "total_cell_capacity"
    t.bigint "block_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["block_hash", "status"], name: "index_uncle_blocks_on_block_hash_and_status"
    t.index ["block_hash"], name: "index_uncle_blocks_on_block_hash", unique: true
    t.index ["block_id"], name: "index_uncle_blocks_on_block_id"
  end

end
