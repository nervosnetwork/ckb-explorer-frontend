class CellOutput < ApplicationRecord
  belongs_to :ckb_transaction
  has_one :lock_script
  has_one :type_script
end

# == Schema Information
#
# Table name: cell_outputs
#
#  id                 :bigint(8)        not null, primary key
#  capacity           :bigint(8)
#  data               :binary
#  ckb_transaction_id :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_cell_outputs_on_ckb_transaction_id  (ckb_transaction_id)
#
