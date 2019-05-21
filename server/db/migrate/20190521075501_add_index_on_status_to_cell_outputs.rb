class AddIndexOnStatusToCellOutputs < ActiveRecord::Migration[5.2]
  def change
    remove_index :cell_outputs, name: :index_cell_outputs_on_address_id
    add_index :cell_outputs, [:address_id, :status]
  end
end
