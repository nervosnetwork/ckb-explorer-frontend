class SyncInfo < ApplicationRecord
end

# == Schema Information
#
# Table name: sync_infos
#
#  id         :bigint(8)        not null, primary key
#  name       :string
#  value      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_sync_infos_on_name  (name)
#
