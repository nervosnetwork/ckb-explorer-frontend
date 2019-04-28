class CreateCkbTransactions < ActiveRecord::Migration[5.2]
  def change
    create_table :ckb_transactions do |t|
      t.binary :tx_hash
      t.jsonb :deps
      t.belongs_to :block, index: true
      t.bigint :block_number
      t.bigint :block_timestamp
      t.jsonb :display_inputs
      t.jsonb :display_outputs
      t.integer :status
      t.decimal :transaction_fee, precision: 64, scale: 2
      t.integer :version
      t.string :witnesses, array: true

      t.timestamps
    end
    add_index :ckb_transactions, :tx_hash, unique: true
    add_index :ckb_transactions, [:tx_hash, :status]
  end
end
