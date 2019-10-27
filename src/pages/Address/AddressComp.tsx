import React, { ReactNode, useContext, useState } from 'react'
import Pagination from '../../components/Pagination'
import HelpIcon from '../../assets/qa_help.png'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import Tooltip from '../../components/Tooltip'
import TransactionItem from '../../components/TransactionItem/index'
import { AppContext } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { startEndEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  AddressLockScriptItemPanel,
  AddressLockScriptPanel,
  AddressPendingRewardTitlePanel,
  AddressTransactionsPagination,
  AddressTransactionsPanel,
} from './styled'
import browserHistory from '../../routes/history'

const addressContent = (address: State.Address) => {
  const addressText = isMobile() ? startEndEllipsis(address.addressHash, 10) : address.addressHash
  return address.addressHash ? addressText : i18n.t('address.unable_decode_address')
}

const AddressPendingRewardTitle = () => {
  const [show, setShow] = useState(false)
  return (
    <AddressPendingRewardTitlePanel>
      {`${i18n.t('address.pending_reward')}`}
      <div
        id="address__pending_reward_help"
        tabIndex={-1}
        onFocus={() => {}}
        onMouseOver={() => {
          setShow(true)
          const p = document.querySelector('.page') as HTMLElement
          if (p) {
            p.setAttribute('tabindex', '-1')
          }
        }}
        onMouseLeave={() => {
          setShow(false)
          const p = document.querySelector('.page') as HTMLElement
          if (p) {
            p.removeAttribute('tabindex')
          }
        }}
      >
        <img src={HelpIcon} alt="Pending Reward Help" />
      </div>
      <Tooltip show={show} targetElementId="address__pending_reward_help">
        {i18n.t('address.pending_reward_tooltip')}
      </Tooltip>
    </AddressPendingRewardTitlePanel>
  )
}

const AddressLockScriptItem = ({ title, children }: { title: string; children?: ReactNode }) => {
  return (
    <AddressLockScriptItemPanel>
      <div className="address_lock_script__title">
        <span>{title}</span>
      </div>
      <div className="address_lock_script__content">{children}</div>
    </AddressLockScriptItemPanel>
  )
}

const AddressLockScript = ({ script }: { script: State.Script }) => {
  return (
    <AddressLockScriptPanel>
      <div className="address__lock_script_title">{i18n.t('address.lock_script')}</div>
      <AddressLockScriptItem title={i18n.t('address.code_hash')}>
        <span id="monospace">{script.codeHash}</span>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.args')}>
        <span id="monospace">{script.args}</span>
      </AddressLockScriptItem>
    </AddressLockScriptPanel>
  )
}

const getAddressInfo = (addressState: State.AddressState) => {
  const items: OverviewItemData[] = [
    {
      title: i18n.t('address.balance'),
      content: `${localeNumberString(shannonToCkb(addressState.address.balance))} CKB`,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(addressState.address.transactionsCount),
    },
  ]

  if (addressState.address.pendingRewardBlocksCount) {
    items.push({
      title: <AddressPendingRewardTitle />,
      content: `${addressState.address.pendingRewardBlocksCount} ${
        addressState.address.pendingRewardBlocksCount > 1 ? 'blocks' : 'block'
      }`,
    })
  }
  if (addressState.address.type === 'LockHash' && addressState.address) {
    items.push({
      title: i18n.t('address.address'),
      content: addressContent(addressState.address),
    })
  }

  return items
}

export const AddressOverview = () => {
  const { addressState } = useContext(AppContext)
  return (
    <>
      <TitleCard title={i18n.t('common.overview')} />
      <OverviewCard items={getAddressInfo(addressState)}>
        {addressState && addressState.address && addressState.address.lockScript && (
          <AddressLockScript script={addressState.address.lockScript} />
        )}
      </OverviewCard>
    </>
  )
}

export const AddressTransactions = ({
  currentPage,
  pageSize,
  address,
}: {
  currentPage: number
  pageSize: number
  address: string
}) => {
  const { addressState, app } = useContext(AppContext)
  const { tipBlockNumber } = app
  const { transactions = [] } = addressState

  const totalPages = Math.ceil(addressState.total / pageSize)

  const onChange = (page: number) => {
    browserHistory.replace(`/address/${address}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      {transactions.length > 0 && <TitleCard title={i18n.t('transaction.transactions')} />}
      <AddressTransactionsPanel>
        {addressState.transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                address={addressState.address.addressHash}
                transaction={transaction}
                confirmation={tipBlockNumber - transaction.blockNumber + 1}
                key={transaction.transactionHash}
                isLastItem={index === addressState.transactions.length - 1}
              />
            )
          )
        })}
      </AddressTransactionsPanel>
      {totalPages > 1 && (
        <AddressTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </AddressTransactionsPagination>
      )}
    </>
  )
}

export default {
  AddressOverview,
  AddressTransactions,
}
