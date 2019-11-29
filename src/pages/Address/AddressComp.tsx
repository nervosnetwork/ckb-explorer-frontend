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
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  AddressLockScriptItemPanel,
  AddressLockScriptPanel,
  AddressPendingRewardTitlePanel,
  AddressTransactionsPagination,
  AddressTransactionsPanel,
} from './styled'
import browserHistory from '../../routes/history'
import DecimalCapacity from '../../components/DecimalCapacity'
import { parseSimpleDateNoSecond } from '../../utils/date'

const addressContent = (address: string) => {
  const addressText = isMobile() ? adaptMobileEllipsis(address, 10) : adaptPCEllipsis(address, 13, 50)
  return address ? addressText : i18n.t('address.unable_decode_address')
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
        <span>{script.codeHash}</span>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.args')}>
        <span>{script.args}</span>
      </AddressLockScriptItem>
      <AddressLockScriptItem title={i18n.t('address.hash_type')}>
        <code>{script.hashType}</code>
      </AddressLockScriptItem>
    </AddressLockScriptPanel>
  )
}

const getAddressInfo = (addressState: State.AddressState) => {
  const { address } = addressState
  const items: OverviewItemData[] = [
    {
      title: i18n.t('address.balance'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.balance))} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(address.transactionsCount),
    },
    {
      title: i18n.t('address.dao_deposit'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.daoDeposit))} />,
    },
    {
      title: i18n.t('address.compensation'),
      content: <DecimalCapacity value={localeNumberString(shannonToCkb(address.interest))} />,
    },
  ]

  if (address.pendingRewardBlocksCount) {
    items.push({
      title: <AddressPendingRewardTitle />,
      content: `${address.pendingRewardBlocksCount} ${address.pendingRewardBlocksCount > 1 ? 'blocks' : 'block'}`,
    })
  }
  if (address.type === 'LockHash' && address) {
    items.push({
      title: i18n.t('address.address'),
      content: addressContent(address.addressHash),
    })
  }
  const { lockInfo } = address
  if (lockInfo && lockInfo.epochNumber) {
    items.push({
      title: i18n.t('address.lock_until'),
      content: `${lockInfo.epochNumber} ${i18n.t('address.epoch')} (~ ${parseSimpleDateNoSecond(
        lockInfo.estimatedUnlockTime,
      )})`,
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
