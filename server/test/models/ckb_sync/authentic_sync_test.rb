require "test_helper"

module CkbSync
  class AuthenticSyncTest < ActiveSupport::TestCase
    setup do
      SyncInfo.local_authentic_tip_block_number
    end

    test "should create 11 blocks when inauthentic sync start and authentic sync failed" do
      Sidekiq::Testing.inline! do
        SyncInfo.stubs(:local_inauthentic_tip_block_number).returns(20)

        assert_difference "Block.count", 11 do
          VCR.use_cassette("genesis_block") do
            VCR.use_cassette("blocks/two") do
              CkbSync::AuthenticSync.sync_node_data
            end
          end
        end
      end
    end

    test "should return nil when round range params to is negative" do
      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          assert_nil CkbSync::AuthenticSync.sync_node_data
        end
      end
    end

    test "should return nil when latest round range is executing" do
      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/four") do
          CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
          CkbSync::InauthenticSync.sync_node_data
        end
      end

      Rails.cache.stubs(:delete).returns(true)

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          CkbSync::AuthenticSync.sync_node_data
        end
      end
      SyncInfo.stubs(:local_authentic_tip_block_number).returns(-1)
      assert_nil CkbSync::AuthenticSync.sync_node_data
    end

    test "should verify 11 blocks when inauthentic sync start and authentic sync succeeded" do
      Sidekiq::Testing.inline! do
        VCR.use_cassette("genesis_block") do
          VCR.use_cassette("blocks/four") do
            CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
            CkbSync::InauthenticSync.sync_node_data
          end
        end

        assert_difference "Block.count", 0 do
          VCR.use_cassette("genesis_block") do
            VCR.use_cassette("blocks/two") do
              assert_changes -> { Block.where(status: "authentic").count }, from: 0, to: 11 do
                CkbSync::AuthenticSync.sync_node_data
              end
            end
          end
        end
      end
    end

    test "should queueing 11 job" do
      Sidekiq::Testing.inline! do
        VCR.use_cassette("genesis_block") do
          VCR.use_cassette("blocks/four") do
            CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
            CkbSync::InauthenticSync.sync_node_data
          end
        end
      end

      Sidekiq::Testing.fake!
      CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          assert_changes -> { CheckBlockWorker.jobs.size }, from: 0, to: 11 do
            CkbSync::AuthenticSync.sync_node_data
          end
        end
      end
    end

    test "should queueing update transaction info job" do
      Sidekiq::Testing.inline! do
        VCR.use_cassette("genesis_block") do
          VCR.use_cassette("blocks/four") do
            CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)
            CkbSync::InauthenticSync.sync_node_data
          end
        end
      end

      Sidekiq::Testing.fake!
      CkbSync::Api.any_instance.stubs(:get_tip_block_number).returns(20)

      VCR.use_cassette("genesis_block") do
        VCR.use_cassette("blocks/two") do
          assert_changes -> { UpdateTransactionInfoWorker.jobs.size }, from: 0, to: 1 do
            CkbSync::AuthenticSync.sync_node_data
          end
        end
      end
    end
  end
end
