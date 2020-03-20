import React, { useState } from 'react'
import { Tooltip } from 'antd'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isMobile } from '../../utils/screen'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import { SimpleUDTTransactionsPagination, SimpleUDTTransactionsPanel, SimpleUDTLockScriptController } from './styled'
import browserHistory from '../../routes/history'
import DecimalCapacity from '../../components/DecimalCapacity'
import CopyTooltipText from '../../components/Text/CopyTooltipText'

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

const simpleUDTInfo = (addressState: State.AddressState) => {
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

  return items
}

export const SimpleUDTOverview = () => {
  const [showLock, setShowLock] = useState<boolean>(false)
  const { addressState } = useAppState()
  return (
    <>
      <TitleCard title={i18n.t('common.overview')} />
      <OverviewCard items={simpleUDTInfo(addressState)}>
        <SimpleUDTLockScriptController
          role="button"
          tabIndex={0}
          onKeyUp={() => {}}
          onClick={() => setShowLock(!showLock)}
        >
          <div>{i18n.t('address.lock_script')}</div>
        </SimpleUDTLockScriptController>
      </OverviewCard>
    </>
  )
}

export const SimpleUDTTransactions = ({
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
      {transactions.length > 0 && <TitleCard title={i18n.t('transaction.transactions')} />}
      <SimpleUDTTransactionsPanel>
        {transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                address={addressHash}
                transaction={transaction}
                confirmation={tipBlockNumber - transaction.blockNumber + 1}
                key={transaction.transactionHash}
                isLastItem={index === transactions.length - 1}
              />
            )
          )
        })}
      </SimpleUDTTransactionsPanel>
      {totalPages > 1 && (
        <SimpleUDTTransactionsPagination>
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
        </SimpleUDTTransactionsPagination>
      )}
    </>
  )
}

export default {
  SimpleUDTOverview,
  SimpleUDTTransactions,
}
