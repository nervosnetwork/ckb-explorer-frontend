class TypeScript < ApplicationRecord
  belongs_to :cell_output

  validates_presence_of :binary_hash

  attribute :binary_hash, :ckb_hash

  def to_node_type
    {
      args: args,
      binary_hash: binary_hash
    }
  end
end

# == Schema Information
#
# Table name: type_scripts
#
#  id             :bigint(8)        not null, primary key
#  args           :string           is an Array
#  code_hash      :binary
#  cell_output_id :bigint(8)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_type_scripts_on_cell_output_id  (cell_output_id)
#
