class CreateSyncInfos < ActiveRecord::Migration[5.2]
  def change
    create_table :sync_infos do |t|
      t.string :name
      t.bigint :value
      t.integer :status, limit: 2

      t.timestamps
    end
    add_index :sync_infos, :name, unique: true
    add_index :sync_infos, [:name, :status]
  end
end
