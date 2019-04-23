class LockScript < ApplicationRecord
  SYSTEM_SCRIPT_CELL_HASH = "0x8bddddc3ae2e09c13106634d012525aa32fc47736456dba11514d352845e561d".freeze

  belongs_to :cell_output
  belongs_to :address

  validates_presence_of :binary_hash

  attribute :binary_hash, :ckb_hash

  def to_node_lock
    {
      args: args,
      binary_hash: binary_hash
    }
  end
end

# == Schema Information
#
# Table name: lock_scripts
#
#  id             :bigint(8)        not null, primary key
#  args           :string           is an Array
#  binary_hash    :binary
#  cell_output_id :bigint(8)
#  address_id     :bigint(8)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_lock_scripts_on_address_id      (address_id)
#  index_lock_scripts_on_cell_output_id  (cell_output_id)
#
