class AddDisplayInputAndFeeStatusToCkbTransaction < ActiveRecord::Migration[5.2]
  def change
    add_column :ckb_transactions, :display_inputs_status, :integer, limit: 2, default: 0
    add_column :ckb_transactions, :transaction_fee_status, :integer, limit: 2, default: 0

    add_index :ckb_transactions, :display_inputs_status
    add_index :ckb_transactions, :transaction_fee_status
  end
end
