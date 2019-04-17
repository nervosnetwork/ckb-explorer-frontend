class CellOutput < ApplicationRecord
  BASE_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000".freeze
  INITIAL_BLOCK_REWARD = 50_000

  belongs_to :ckb_transaction
  has_one :lock_script
  has_one :type_script

  validates :capacity, presence: true, numericality: { greater_than_or_equal_to: 0 }

  def address_hash
    lock_script.address.address_hash
  end

  def to_node_cell_output
    {
      capacity: capacity,
      data: data,
      lock: lock_script.to_node_lock,
      type: type_script.try(:to_node_lock)
    }
  end
end

# == Schema Information
#
# Table name: cell_outputs
#
#  id                 :bigint(8)        not null, primary key
#  capacity           :decimal(32, 2)
#  data               :binary
#  ckb_transaction_id :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_cell_outputs_on_ckb_transaction_id  (ckb_transaction_id)
#
