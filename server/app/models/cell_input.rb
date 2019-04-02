class CellInput < ApplicationRecord
  belongs_to :ckb_transaction
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
