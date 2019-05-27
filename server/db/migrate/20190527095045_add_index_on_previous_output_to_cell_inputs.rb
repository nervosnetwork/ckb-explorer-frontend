class AddIndexOnPreviousOutputToCellInputs < ActiveRecord::Migration[5.2]
  def change
    add_index :cell_inputs, :previous_output, using: :gin
  end
end
