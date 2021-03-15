import React, { useEffect, ReactNode } from 'react'
import { Tooltip } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TransactionItem from '../../components/TransactionItem/index'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import i18n from '../../utils/i18n'
import { SimpleUDTTransactionsPagination, SimpleUDTTransactionsPanel, UDTNoResultPanel } from './styled'
import { parseUDTAmount } from '../../utils/number'
import { ComponentActions } from '../../contexts/actions'
import { isMobile, isScreenSmallerThan1200 } from '../../utils/screen'
import { adaptMobileEllipsis, adaptPCEllipsis } from '../../utils/string'
import CopyTooltipText from '../../components/Text/CopyTooltipText'

const addressContent = (address: string) => {
  if (!address) {
    return i18n.t('address.unable_decode_address')
  }
  const addressHash = isMobile()
    ? adaptMobileEllipsis(address, 8)
    : adaptPCEllipsis(address, isScreenSmallerThan1200() ? 12 : 8, 50)

  if (addressHash.includes('...')) {
    return (
      <Tooltip placement="top" title={<CopyTooltipText content={address} />}>
        <Link to={`/address/${address}`} className="monospace">
          {addressHash}
        </Link>
      </Tooltip>
    )
  }
  return (
    <Link to={`/address/${address}`} className="monospace">
      {addressHash}
    </Link>
  )
}

const simpleUDTInfo = (udt: State.UDT) => {
  const { fullName, issuerAddress, symbol, addressesCount, decimal, totalAmount } = udt
  return [
    {
      title: i18n.t('udt.name'),
      content: fullName,
    },
    {
      title: i18n.t('udt.issuer'),
      content: addressContent(issuerAddress),
    },
    {
      title: i18n.t('udt.holder_addresses'),
      content: addressesCount,
    },
    {
      title: i18n.t('udt.symbol'),
      content: symbol,
    },
    {
      title: i18n.t('udt.decimal'),
      content: decimal,
    },
    {
      title: i18n.t('udt.total_amount'),
      content: parseUDTAmount(totalAmount, decimal),
    },
  ] as OverviewItemData[]
}

export const SimpleUDTOverview = ({ children }: { children: ReactNode }) => {
  const {
    udtState: { udt },
  } = useAppState()
  return (
    <OverviewCard items={simpleUDTInfo(udt)} hideShadow>
      {children}
    </OverviewCard>
  )
}

export const SimpleUDTComp = ({
  currentPage,
  pageSize,
  typeHash,
}: {
  currentPage: number
  pageSize: number
  typeHash: string
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    udtState: { transactions = [], total },
    components: { filterNoResult },
  } = useAppState()

  const totalPages = Math.ceil(total / pageSize)

  const onChange = (page: number) => {
    history.replace(`/sudt/${typeHash}?page=${page}&size=${pageSize}`)
  }

  useEffect(() => {
    return () => {
      dispatch({
        type: ComponentActions.UpdateFilterNoResult,
        payload: {
          filterNoResult: false,
        },
      })
    }
  }, [dispatch])

  if (filterNoResult) {
    return (
      <UDTNoResultPanel>
        <span>{i18n.t('search.udt_filter_no_result')}</span>
      </UDTNoResultPanel>
    )
  }
  return (
    <>
      <SimpleUDTTransactionsPanel>
        {transactions.map((transaction: State.Transaction, index: number) => {
          return (
            transaction && (
              <TransactionItem
                transaction={transaction}
                key={transaction.transactionHash}
                circleCorner={{
                  bottom: index === transactions.length - 1 && totalPages === 1,
                }}
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

export default SimpleUDTComp
