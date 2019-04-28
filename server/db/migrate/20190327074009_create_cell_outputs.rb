class CreateCellOutputs < ActiveRecord::Migration[5.2]
  def change
    create_table :cell_outputs do |t|
      t.decimal :capacity, precision: 64, scale: 2
      t.binary :data
      t.belongs_to :ckb_transaction, index: true

      t.timestamps
    end
  end
end
