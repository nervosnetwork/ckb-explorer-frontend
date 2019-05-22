class AddTxHashAndCellIndexToCellOutputs < ActiveRecord::Migration[5.2]
  def change
    add_column :cell_outputs, :tx_hash, :binary
    add_column :cell_outputs, :cell_index, :integer

    add_index :cell_outputs, [:tx_hash, :cell_index]
  end
end
