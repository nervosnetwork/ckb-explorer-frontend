class CreateLockScripts < ActiveRecord::Migration[5.2]
  def change
    create_table :lock_scripts do |t|
      t.string :args, array: true
      t.binary :binary_hash
      t.integer :version
      t.belongs_to :cell_output, index: true
      t.belongs_to :account, index: true

      t.timestamps
    end
  end
end
