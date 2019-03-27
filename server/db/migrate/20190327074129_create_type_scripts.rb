class CreateTypeScripts < ActiveRecord::Migration[5.2]
  def change
    create_table :type_scripts do |t|
      t.binary :args
      t.binary :binary
      t.binary :reference
      t.binary :signed_args
      t.integer :version
      t.belongs_to :cell_output, index: true

      t.timestamps
    end
  end
end
