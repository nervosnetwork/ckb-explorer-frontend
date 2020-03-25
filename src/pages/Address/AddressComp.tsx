import React, { ReactNode, useState } from 'react'
import { Tooltip } from 'antd'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { localeNumberString, parseEpochNumber } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  AddressLockScriptItemPanel,
  AddressLockScriptPanel,
  AddressTransactionsPagination,
  AddressTransactionsPanel,
  AddressLockScriptController,
} from './styled'
import browserHistory from '../../routes/history'
import DecimalCapacity from '../../components/DecimalCapacity'
import { parseSimpleDateNoSecond } from '../../utils/date'
import CopyTooltipText from '../../components/Text/CopyTooltipText'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { isMainnet } from '../../utils/chain'

const addressContent = (address: string) => {
  if (!address) {
    return i18n.t('address.unable_decode_address')
  }
  if (isMobile()) {
    return adaptMobileEllipsis(address, 10)
  }
  const addressHash = adaptPCEllipsis(address, 13, 50)
  if (addressHash.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
        <span>{addressHash}</span>
      </Tooltip>
    )
  }
  return addressHash
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

const lockScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
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
    {
      title: i18n.t('address.live_cells'),
      content: localeNumberString(address.liveCellsCount),
    },
    {
      title: i18n.t('address.block_mined'),
      content: localeNumberString(address.minedBlocksCount),
    },
  ]

  if (address.type === 'LockHash' && address) {
    items.push({
      title: i18n.t('address.address'),
      content: addressContent(address.addressHash),
    })
  }
  const { lockInfo } = address
  if (lockInfo && lockInfo.epochNumber && lockInfo.estimatedUnlockTime) {
    const estimate = Number(lockInfo.estimatedUnlockTime) > new Date().getTime() ? i18n.t('address.estimated') : ''
    items.push({
      title: i18n.t('address.lock_until'),
      content: `${parseEpochNumber(lockInfo.epochNumber)} ${i18n.t(
        'address.epoch',
      )} (${estimate} ${parseSimpleDateNoSecond(lockInfo.estimatedUnlockTime)})`,
    })
  }

  return items
}

export const AddressOverview = () => {
  const [showLock, setShowLock] = useState<boolean>(false)
  const { addressState } = useAppState()
  return (
    <>
      <OverviewCard items={getAddressInfo(addressState)}>
        <AddressLockScriptController
          role="button"
          tabIndex={0}
          onKeyUp={() => {}}
          onClick={() => setShowLock(!showLock)}
        >
          <div>{i18n.t('address.lock_script')}</div>
          <img alt="lock script" src={lockScriptIcon(showLock)} />
        </AddressLockScriptController>
        {showLock && addressState && addressState.address && addressState.address.lockScript && (
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
  const {
    addressState: {
      transactions = [],
      total,
      address: { addressHash },
    },
    app: { tipBlockNumber },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    browserHistory.replace(`/address/${address}?page=${page}&size=${pageSize}`)
  }

  return (
    <>
      <AddressTransactionsPanel>
        {transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                address={addressHash}
                transaction={transaction}
                confirmation={tipBlockNumber - transaction.blockNumber + 1}
                key={transaction.transactionHash}
                isFirstItem={index === 0}
                isLastItem={index === transactions.length - 1}
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
