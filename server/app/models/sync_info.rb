class SyncInfo < ApplicationRecord
  enum status: { syncing: 0, synced: 1 }
  scope :recent, -> { order(id: :desc) }
  scope :tip_inauthentic_syncing, -> { where(name: "inauthentic_tip_block_number", status: statuses[:syncing]) }
  scope :tip_authentic_syncing, -> { where(name: "authentic_tip_block_number", status: statuses[:syncing]) }
  scope :tip_inauthentic_synced, -> { where(name: "inauthentic_tip_block_number", status: statuses[:synced]) }
  scope :tip_authentic_synced, -> { where(name: "authentic_tip_block_number", status: statuses[:synced]) }

  class << self
    def local_inauthentic_tip_block_number
      SyncInfo.where(name: "inauthentic_tip_block_number").maximum("value").to_i
    end

    def local_authentic_tip_block_number
      SyncInfo.where(name: "authentic_tip_block_number").maximum("value").to_i
    end

    def local_synced_inauthentic_tip_block_number
      SyncInfo.tip_inauthentic_synced.recent.first.value || 0
    end
  end
end

# == Schema Information
#
# Table name: sync_infos
#
#  id         :bigint           not null, primary key
#  name       :string
#  value      :decimal(30, )
#  status     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_sync_infos_on_name_and_status  (name,status)
#  index_sync_infos_on_name_and_value   (name,value) UNIQUE
#
