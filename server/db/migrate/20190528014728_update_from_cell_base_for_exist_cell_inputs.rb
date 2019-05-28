class UpdateFromCellBaseForExistCellInputs < ActiveRecord::Migration[5.2]
  def up
    CellInput.where("previous_output @> ?", { cell: nil }.to_json).update_all(from_cell_base: true)
    CellInput.where.not("previous_output @> ?", { cell: nil }.to_json).update_all(from_cell_base: false)
  end
end
