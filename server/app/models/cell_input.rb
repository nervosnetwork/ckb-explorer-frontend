class CellInput < ApplicationRecord
  belongs_to :ckb_transaction

  def find_lock_script!
    previous_cell_output.lock_script
  end

  def find_type_script!
    previous_cell_output.type_script
  end

  def find_cell_output!
    previous_cell_output
  end

  private

  def previous_cell_output
    tx_hash = previous_output["hash"]
    output_index = previous_output["index"]

    raise ActiveRecord::RecordNotFound if CellOutput::BASE_HASH == tx_hash

    previous_transacton = CkbTransaction.find_by!(tx_hash: tx_hash)
    previous_transacton.cell_outputs.order(:id).first(output_index).first
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
