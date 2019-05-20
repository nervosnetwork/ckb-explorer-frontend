class AccountBook < ApplicationRecord
  belongs_to :address
  belongs_to :ckb_transaction
end

# == Schema Information
#
# Table name: account_books
#
#  id                 :bigint           not null, primary key
#  address_id         :bigint
#  ckb_transaction_id :bigint
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_account_books_on_address_id          (address_id)
#  index_account_books_on_ckb_transaction_id  (ckb_transaction_id)
#
