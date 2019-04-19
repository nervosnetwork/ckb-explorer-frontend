class CreateTypeScripts < ActiveRecord::Migration[5.2]
  def change
    create_table :type_scripts do |t|
      t.string :args, array: true
      t.binary :binary_hash
      t.belongs_to :cell_output, index: true

      t.timestamps
    end
  end
end
