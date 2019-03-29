class SyncInfo < ApplicationRecord
  enum status: { syncing: 0, synced: 1 }

  class << self
    def local_inauthentic_tip_block_number
      SyncInfo.find_by(name: "inauthentic_tip_block_number").try(:value) || -1
    end

    def local_authentic_tip_block_number
      SyncInfo.find_by(name: "authentic_tip_block_number").try(:value) || -1
    end

    def local_inauthentic_tip_block_number=(block_number)
      sync_info = SyncInfo.find_by(name: "inauthentic_tip_block_number")
      if sync_info.nil?
        SyncInfo.create(name: "inauthentic_tip_block_number", value: block_number)
      else
        sync_info.update(value: block_number, status: "syncing")
      end
    end

    def local_authentic_tip_block_number=(block_number)
      sync_info = SyncInfo.find_by(name: "inauthentic_tip_block_number")
      if sync_info.nil?
        SyncInfo.create(name: "authentic_tip_block_number", value: block_number)
      else
        sync_info.update(value: block_number, status: "syncing")
      end
    end
  end
end

# == Schema Information
#
# Table name: sync_infos
#
#  id         :bigint(8)        not null, primary key
#  name       :string
#  value      :bigint(8)
#  status     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_sync_infos_on_name             (name) UNIQUE
#  index_sync_infos_on_name_and_status  (name,status)
#
