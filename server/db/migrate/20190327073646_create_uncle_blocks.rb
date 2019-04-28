class CreateUncleBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :uncle_blocks do |t|
      t.string :difficulty, limit: 66
      t.binary :block_hash
      t.bigint :number
      t.binary :parent_hash
      t.jsonb :seal
      t.bigint :timestamp
      t.binary :transactions_root
      t.binary :proposals_root
      t.integer :uncles_count
      t.binary :uncles_hash
      t.integer :version
      t.binary :proposals
      t.integer :proposals_count
      t.belongs_to :block, index: true
      t.binary :witnesses_root
      t.timestamps
    end
    add_index :uncle_blocks, :block_hash, unique: true
  end
end
