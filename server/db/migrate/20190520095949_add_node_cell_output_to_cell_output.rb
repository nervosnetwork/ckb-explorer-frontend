class AddNodeCellOutputToCellOutput < ActiveRecord::Migration[5.2]
  def change
    add_column :cell_outputs, :node_cell_output, :jsonb
  end
end
