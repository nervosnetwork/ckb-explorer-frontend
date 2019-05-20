class ChangeUniqueIndexScope < ActiveRecord::Migration[5.2]
  def change
    remove_index :uncle_blocks, name: :index_uncle_blocks_on_block_hash
    add_index :uncle_blocks, [:block_hash, :block_id], unique: true

    remove_index :ckb_transactions, name: :index_ckb_transactions_on_tx_hash
    add_index :ckb_transactions, [:tx_hash, :block_id], unique: true
  end
end
