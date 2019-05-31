class RemoveUniqueIndexOnAddressHashFromAddress < ActiveRecord::Migration[5.2]
  def change
    remove_index :addresses, :address_hash
    add_index :addresses, :address_hash
  end
end
