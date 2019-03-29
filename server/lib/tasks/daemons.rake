namespace :daemons do
  namespace :authentic_sync do
    desc "start ckb authentic sync"
    task start: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_authentic_sync.rb")} start`
    end

    desc "show ckb authentic sync status"
    task status: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_authentic_sync.rb")} status`
    end

    desc "stop ckb authentic sync status"
    task stop: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_authentic_sync.rb")} stop`
    end

    desc "restart ckb authentic sync"
    task restart: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_authentic_sync.rb")} restart`
    end
  end
  namespace :inauthentic_sync do
    desc "start ckb inauthentic sync"
    task start: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_inauthentic_sync.rb")} start`
    end

    desc "show ckb inauthentic sync status"
    task status: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_inauthentic_sync.rb")} status`
    end

    desc "stop ckb inauthentic sync status"
    task stop: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_inauthentic_sync.rb")} stop`
    end

    desc "restart ckb inauthentic sync"
    task restart: :environment do
      puts `ruby #{Rails.root.join("lib", "ckb_inauthentic_sync.rb")} restart`
    end
  end
end
