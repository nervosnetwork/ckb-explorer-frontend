class CellOutput < ApplicationRecord
  enum status: { live: 0, dead: 1, abandoned: 2 }

  belongs_to :ckb_transaction
  belongs_to :address
  belongs_to :block
  has_one :lock_script
  has_one :type_script

  validates :capacity, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :available, -> { where("status in (?,?)", statuses[:live], statuses[:dead]) }

  def address_hash
    address.address_hash
  end

  def to_node_cell_output
    {
      capacity: capacity,
      data: data,
      lock: lock_script.to_node_lock,
      type: type_script&.to_node_type
    }
  end
end

# == Schema Information
#
# Table name: cell_outputs
#
#  id                 :bigint           not null, primary key
#  capacity           :decimal(64, 2)
#  data               :binary
#  ckb_transaction_id :bigint
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  status             :integer          default("live")
#  address_id         :decimal(30, )
#  block_id           :decimal(30, )
#
# Indexes
#
#  index_cell_outputs_on_address_id          (address_id)
#  index_cell_outputs_on_block_id            (block_id)
#  index_cell_outputs_on_ckb_transaction_id  (ckb_transaction_id)
#
