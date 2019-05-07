class AddBlockIdToCellOutputs < ActiveRecord::Migration[5.2]
  def change
    add_column :cell_outputs, :block_id, :bigint

    add_index :cell_outputs, :block_id
  end
end
