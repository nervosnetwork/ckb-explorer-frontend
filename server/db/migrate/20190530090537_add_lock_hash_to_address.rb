class AddLockHashToAddress < ActiveRecord::Migration[5.2]
  def change
    add_column :addresses, :lock_hash, :binary

    add_index :addresses, :lock_hash, unique: true
  end
end
