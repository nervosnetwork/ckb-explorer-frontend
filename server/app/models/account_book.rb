class AccountBook < ApplicationRecord
  belongs_to :account
  belongs_to :ckb_transaction
end

# == Schema Information
#
# Table name: account_books
#
#  id                 :bigint(8)        not null, primary key
#  account_id         :bigint(8)
#  ckb_transaction_id :bigint(8)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_account_books_on_account_id          (account_id)
#  index_account_books_on_ckb_transaction_id  (ckb_transaction_id)
#
