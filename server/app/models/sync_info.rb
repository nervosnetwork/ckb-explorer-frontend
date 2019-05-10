class SyncInfo < ApplicationRecord
  enum status: { syncing: 0, synced: 1 }
  scope :recent, -> { order(id: :desc) }

  class << self
    def local_inauthentic_tip_block_number
      sync_info = SyncInfo.where(name: "inauthentic_tip_block_number", status: "syncing").recent.first
      if sync_info.blank?
        sync_info = SyncInfo.create(name: "inauthentic_tip_block_number", value: -1, status: "syncing")
      end

      sync_info.value
    end

    def local_authentic_tip_block_number
      sync_info = SyncInfo.where(name: "authentic_tip_block_number", status: "syncing").recent.first
      if sync_info.blank?
        sync_info = SyncInfo.create(name: "authentic_tip_block_number", value: -1, status: "syncing")
      end

      sync_info.value
    end
  end
end

# == Schema Information
#
# Table name: sync_infos
#
#  id         :bigint           not null, primary key
#  name       :string
#  value      :bigint
#  status     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_sync_infos_on_name_and_status  (name,status)
#  index_sync_infos_on_name_and_value   (name,value) UNIQUE
#
