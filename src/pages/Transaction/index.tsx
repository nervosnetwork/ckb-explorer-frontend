import React, { useContext, useEffect } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import { AppContext } from '../../contexts/providers/index'
import Content from '../../components/Content'
import i18n from '../../utils/i18n'
import { TransactionDiv, TransactionBlockHeightPanel } from './styled'
import { parseSimpleDate } from '../../utils/date'
import { formatConfirmation, shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { getTransactionByHash } from '../../service/app/transaction'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import AddressHashCard from '../../components/Card/AddressHashCard'
import TitleCard from '../../components/Card/TitleCard'
import TransactionCellList from './TransactionCellList'

const TransactionBlockHeight = ({ blockNumber }: { blockNumber: number }) => {
  return (
    <TransactionBlockHeightPanel>
      <Link to={`/block/${blockNumber}`}>{localeNumberString(blockNumber)}</Link>
    </TransactionBlockHeightPanel>
  )
}

export default ({
  dispatch,
  history: { replace },
  match: { params },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ hash: string }>>) => {
  const { hash } = params
  const { transaction, app } = useContext(AppContext)
  const { tipBlockNumber } = app

  useEffect(() => {
    getTransactionByHash(hash, replace, dispatch)
  }, [hash, replace, dispatch])

  let confirmation = 0
  if (tipBlockNumber && transaction.block_number) {
    confirmation = tipBlockNumber - transaction.block_number + 1
  }

  const overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: <TransactionBlockHeight blockNumber={transaction.block_number} />,
    },
    {
      title: i18n.t('block.timestamp'),
      content: parseSimpleDate(transaction.block_timestamp),
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      content: `${shannonToCkb(transaction.transaction_fee)} CKB`,
    },
    {
      title: i18n.t('transaction.status'),
      content: formatConfirmation(confirmation),
    },
  ]

  return (
    <Content>
      <TransactionDiv className="container">
        <AddressHashCard title={i18n.t('transaction.transaction')} hash={hash} dispatch={dispatch} />
        <TitleCard title={i18n.t('common.overview')} />
        <OverviewCard items={overviewItems} />
        <TransactionCellList inputs={transaction.display_inputs} />
        <TransactionCellList outputs={transaction.display_outputs} />
      </TransactionDiv>
    </Content>
  )
}
