class LockScript < ApplicationRecord
  SYSTEM_SCRIPT_CELL_HASH = "0x8bddddc3ae2e09c13106634d012525aa32fc47736456dba11514d352845e561d".freeze

  belongs_to :cell_output
  belongs_to :address

  validates_presence_of :code_hash

  attribute :code_hash, :ckb_hash

  def to_node_lock
    {
      args: args,
      code_hash: code_hash
    }
  end
end

# == Schema Information
#
# Table name: lock_scripts
#
#  id             :bigint           not null, primary key
#  args           :string           is an Array
#  code_hash      :binary
#  cell_output_id :bigint
#  address_id     :bigint
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_lock_scripts_on_address_id      (address_id)
#  index_lock_scripts_on_cell_output_id  (cell_output_id)
#
