class CreateAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts do |t|
      t.bigint :balance
      t.binary :address_hash
      t.bigint :cell_consumed
      t.bigint :ckb_transactions_count, default: 0

      t.timestamps
    end
    add_index :accounts, :address_hash, unique: true
  end
end
