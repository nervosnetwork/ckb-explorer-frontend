class CreateAddresses < ActiveRecord::Migration[5.2]
  def change
    create_table :addresses do |t|
      t.decimal :balance, precision: 64, scale: 2
      t.binary :address_hash
      t.decimal :cell_consumed, precision: 64, scale: 2
      t.bigint :ckb_transactions_count, default: 0

      t.timestamps
    end
    add_index :addresses, :address_hash
  end
end
