class RemoveArgsFromCellInputs < ActiveRecord::Migration[5.2]
  def change
    remove_column :cell_inputs, :args
  end
end
