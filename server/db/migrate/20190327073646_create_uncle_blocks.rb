class CreateUncleBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :uncle_blocks do |t|
      t.string :difficulty, limit: 66
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
      t.belongs_to :block, index: true
      t.binary :witnesses_root
      t.timestamps
    end
    add_index :uncle_blocks, :block_hash, unique: true
  end
end
