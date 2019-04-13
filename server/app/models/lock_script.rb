class LockScript < ApplicationRecord
  belongs_to :cell_output
  belongs_to :account

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
#  version        :integer
#  cell_output_id :bigint(8)
#  account_id     :bigint(8)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_lock_scripts_on_account_id      (account_id)
#  index_lock_scripts_on_cell_output_id  (cell_output_id)
#
