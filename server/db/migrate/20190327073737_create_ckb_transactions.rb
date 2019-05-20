class CreateCkbTransactions < ActiveRecord::Migration[5.2]
  def change
    create_table :ckb_transactions do |t|
      t.binary :tx_hash
      t.jsonb :deps
      t.belongs_to :block, index: true
      t.decimal :block_number, precision: 30, scale: 0
      t.decimal :block_timestamp, precision: 30, scale: 0
      t.jsonb :display_inputs
      t.jsonb :display_outputs
      t.integer :status, limit: 2
      t.decimal :transaction_fee, precision: 30, scale: 0
      t.integer :version
      t.string :witnesses, array: true

      t.timestamps
    end
    add_index :ckb_transactions, :tx_hash, unique: true
    add_index :ckb_transactions, [:tx_hash, :status]
  end
end
