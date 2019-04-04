class CreateUncleBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :uncle_blocks do |t|
      t.binary :cellbase_id
      t.binary :difficulty
      t.binary :block_hash
      t.bigint :number
      t.binary :parent_hash
      t.jsonb :seal
      t.bigint :timestamp
      t.binary :txs_commit
      t.binary :txs_proposal
      t.integer :uncles_count
      t.binary :uncles_hash
      t.integer :version
      t.binary :proposal_transactions
      t.integer :proposal_transactions_count
      t.binary :miner_hash
      t.integer :status
      t.integer :reward
      t.integer :total_transaction_fee
      t.belongs_to :block, index: true
      t.jsonb :cellbase

      t.timestamps
    end
    add_index :uncle_blocks, :block_hash, unique: true
    add_index :uncle_blocks, [:block_hash, :status]
  end
end
