class CellInput < ApplicationRecord
  belongs_to :ckb_transaction

  def lock_script
    tx_hash = previous_output["hash"]
    output_index = previous_output["index"]
    previous_transacton = CkbTransaction.find_by(tx_hash: tx_hash)
    previous_cell_output = previous_transacton.cell_outputs.order(:id).first(output_index).first
    previous_cell_output.lock_script
  end
end

# == Schema Information
#
# Table name: cell_inputs
#
#  id                 :bigint(8)        not null, primary key
#  previous_output    :jsonb
#  args               :string           is an Array
#  ckb_transaction_id :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_cell_inputs_on_ckb_transaction_id  (ckb_transaction_id)
#
