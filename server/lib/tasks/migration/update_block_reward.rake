namespace :migration do
  task update_block_reward: :environment do
    current_epoch_number = Block.maximum(:epoch).to_i
    (0..current_epoch_number).each do |epoch|
      Block.where(epoch: epoch).update_all(reward: CkbUtils.miner_reward(epoch))
    end

    puts "done"
  end
end
