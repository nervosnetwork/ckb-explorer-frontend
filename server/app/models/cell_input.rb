class CellInput < ApplicationRecord
  belongs_to :ckb_transaction

  def find_lock_script!
    previous_cell_output!.lock_script
  end

  def find_type_script!
    previous_cell_output!.type_script
  end

  def find_cell_output!
    previous_cell_output!
  end

  def previous_cell_output
    cell = previous_output["cell"]

    return if cell.blank?

    tx_hash = cell["tx_hash"]
    output_index = cell["index"].to_i
    previous_transaction = CkbTransaction.find_by(tx_hash: tx_hash)

    return if previous_transaction.blank?

    previous_transaction.cell_outputs.order(:id)[output_index]
  end

  private

  def previous_cell_output!
    cell = previous_output["cell"]

    raise ActiveRecord::RecordNotFound if cell.blank?

    tx_hash = cell["tx_hash"]
    output_index = cell["index"].to_i
    previous_transaction = CkbTransaction.find_by!(tx_hash: tx_hash)
    previous_transaction.cell_outputs.order(:id)[output_index]
  end
end

# == Schema Information
#
# Table name: cell_inputs
#
#  id                 :bigint           not null, primary key
#  previous_output    :jsonb
#  args               :string           is an Array
#  since              :string
#  ckb_transaction_id :bigint
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_cell_inputs_on_ckb_transaction_id  (ckb_transaction_id)
#
