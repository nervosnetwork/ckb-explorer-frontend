class CellOutput < ApplicationRecord
end

# == Schema Information
#
# Table name: cell_outputs
#
#  id                 :bigint(8)        not null, primary key
#  capacity           :integer
#  data               :binary
#  ckb_transaction_id :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_cell_outputs_on_ckb_transaction_id  (ckb_transaction_id)
#
