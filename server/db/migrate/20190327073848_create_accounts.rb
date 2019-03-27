class CreateAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts do |t|
      t.integer :balance
      t.binary :address_hash
      t.integer :cell_consumed

      t.timestamps
    end
    add_index :accounts, :address_hash, unique: true
  end
end
