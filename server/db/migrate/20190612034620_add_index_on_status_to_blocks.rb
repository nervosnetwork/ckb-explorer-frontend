class AddIndexOnStatusToBlocks < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :blocks, :status, algorithm: :concurrently
    add_index :blocks, :timestamp, algorithm: :concurrently
  end
end
