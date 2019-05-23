class AddPreviousCellOutputIdToCellInputs < ActiveRecord::Migration[5.2]
  def change
    add_column :cell_inputs, :previous_cell_output_id, :bigint

    add_index :cell_inputs, :previous_cell_output_id
  end
end
