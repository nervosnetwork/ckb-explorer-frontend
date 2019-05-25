class AddAddressIdsToBlock < ActiveRecord::Migration[5.2]
  def change
    add_column :blocks, :address_ids, :string, array: true
  end
end
