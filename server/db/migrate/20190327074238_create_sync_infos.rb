class CreateSyncInfos < ActiveRecord::Migration[5.2]
  def change
    create_table :sync_infos do |t|
      t.string :name
      t.integer :value

      t.timestamps
    end
    add_index :sync_infos, :name, unique: true
  end
end
