class AddIndexToAddressIdOnCellOutputs < ActiveRecord::Migration[5.2]
  def change
    add_index :cell_outputs, :address_id
  end
end
