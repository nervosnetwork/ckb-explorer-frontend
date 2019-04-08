class TypeScript < ApplicationRecord
  belongs_to :cell_output

  validates_presence_of :binary_hash

  def binary_hash
    "#{ENV['DEFAULT_HASH_PREFIX']}#{super.unpack1('H*')}" if super.present?
  end

  def binary_hash=(binary_hash)
    binary_hash = [binary_hash.delete_prefix(ENV["DEFAULT_HASH_PREFIX"])].pack("H*") if binary_hash.present?
    super
  end
end

# == Schema Information
#
# Table name: type_scripts
#
#  id             :bigint(8)        not null, primary key
#  args           :string           is an Array
#  binary_hash    :binary
#  version        :integer
#  cell_output_id :bigint(8)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_type_scripts_on_cell_output_id  (cell_output_id)
#
