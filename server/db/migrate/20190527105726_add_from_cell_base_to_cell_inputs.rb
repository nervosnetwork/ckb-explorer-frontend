class AddFromCellBaseToCellInputs < ActiveRecord::Migration[5.2]
  def change
    add_column :cell_inputs, :from_cell_base, :boolean, default: false
  end
end
