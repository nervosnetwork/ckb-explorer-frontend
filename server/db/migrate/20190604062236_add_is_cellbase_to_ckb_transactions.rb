class AddIsCellbaseToCkbTransactions < ActiveRecord::Migration[5.2]
  def change
    add_column :ckb_transactions, :is_cellbase, :boolean, default: false
    add_index :ckb_transactions, :is_cellbase
  end
end
