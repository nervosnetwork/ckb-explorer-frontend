class CreateAccountBooks < ActiveRecord::Migration[5.2]
  def change
    create_table :account_books do |t|
      t.belongs_to :account, index: true
      t.belongs_to :ckb_transaction, index: true

      t.timestamps
    end
  end
end
