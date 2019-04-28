class AddStatusToCellOutput < ActiveRecord::Migration[5.2]
  def change
    add_column :cell_outputs, :status, :integer, limit: 2, default: 0
  end
end
