class Account < ApplicationRecord
end

# == Schema Information
#
# Table name: accounts
#
#  id            :bigint(8)        not null, primary key
#  balance       :integer
#  address_hash  :binary
#  cell_consumed :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_accounts_on_address_hash  (address_hash) UNIQUE
#
