import React, { useContext, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import AddressHashCard from '../../components/Card/AddressHashCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import Content from '../../components/Content'
import { AppContext } from '../../contexts/providers/index'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { getTransactionByHash } from '../../service/app/transaction'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isLargeMobile, isMediumMobile, isSmallMobile } from '../../utils/screen'
import { startEndEllipsis } from '../../utils/string'
import { formatConfirmation, shannonToCkb } from '../../utils/util'
import { TransactionBlockHeightPanel, TransactionDiv } from './styled'
import TransactionCellList from './TransactionCellList'

const handleHashText = (hash: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(hash, 5, 8)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(hash, 8, 12)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(hash, 9)
  }
  return hash
}

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
  ]
  if (confirmation > 0) {
    overviewItems.push({
      title: i18n.t('transaction.status'),
      content: formatConfirmation(confirmation),
    })
  }

  return (
    <Content>
      <TransactionDiv className="container">
        <AddressHashCard
          title={i18n.t('transaction.transaction')}
          hashText={handleHashText(hash)}
          dispatch={dispatch}
        />
        <TitleCard title={i18n.t('common.overview')} />
        <OverviewCard items={overviewItems} />
        <TransactionCellList inputs={transaction.display_inputs} dispatch={dispatch} />
        <TransactionCellList outputs={transaction.display_outputs} dispatch={dispatch} />
      </TransactionDiv>
    </Content>
  )
}
