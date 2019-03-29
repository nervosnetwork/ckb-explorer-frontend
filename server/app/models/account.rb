class Account < ApplicationRecord
  def self.create_account(verify_script_json_object)
    address_hash = CKB::Utils.json_script_to_type_hash(verify_script_json_object)
    if Account.where(address_hash: address_hash).exists?
      Account.find_by(address_hash: address_hash)
    else
      Account.create(address_hash: address_hash)
    end
  end
end

# == Schema Information
#
# Table name: accounts
#
#  id                     :bigint(8)        not null, primary key
#  balance                :bigint(8)
#  address_hash           :binary
#  cell_consumed          :bigint(8)
#  ckb_transactions_count :bigint(8)        default(0)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_accounts_on_address_hash  (address_hash) UNIQUE
#
