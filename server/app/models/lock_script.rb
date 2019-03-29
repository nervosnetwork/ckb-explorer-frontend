class LockScript < ApplicationRecord
  belongs_to :cell_output
  belongs_to :account
end

# == Schema Information
#
# Table name: lock_scripts
#
#  id             :bigint(8)        not null, primary key
#  args           :binary
#  binary         :binary
#  reference      :binary
#  signed_args    :binary
#  version        :integer
#  cell_output_id :bigint(8)
#  account_id     :bigint(8)
#  cell_input_id  :bigint(8)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
# Indexes
#
#  index_lock_scripts_on_account_id      (account_id)
#  index_lock_scripts_on_cell_input_id   (cell_input_id)
#  index_lock_scripts_on_cell_output_id  (cell_output_id)
#
