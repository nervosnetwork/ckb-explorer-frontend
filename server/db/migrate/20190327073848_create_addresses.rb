class CreateAddresses < ActiveRecord::Migration[5.2]
  def change
    create_table :addresses do |t|
      t.decimal :balance, precision: 30, scale: 0
      t.binary :address_hash
      t.decimal :cell_consumed, precision: 30, scale: 0
      t.decimal :ckb_transactions_count, precision: 30, scale: 0, default: 0

      t.timestamps
    end
    add_index :addresses, :address_hash, unique: true
  end
end
