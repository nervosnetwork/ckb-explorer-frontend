class UpdateBlockReward < ActiveRecord::Migration[5.2]
  def up
    return if Rails.env.test?

    current_epoch_number = Block.maximum(:epoch).to_i
    (0..current_epoch_number).each do |epoch|
      Block.where(epoch: epoch).update_all(reward: CkbUtils.miner_reward(epoch))
    end
  end
end
