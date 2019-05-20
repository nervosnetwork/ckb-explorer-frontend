class AddAddressIdToCellOutput < ActiveRecord::Migration[5.2]
  def change
    add_column :cell_outputs, :address_id, :decimal, precision: 30, scale: 0
  end
end
