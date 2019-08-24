import queryString from 'query-string'
import React, { useContext, useEffect, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import DropDownIcon from '../../assets/block_detail_drop_down.png'
import PackUpIcon from '../../assets/block_detail_pack_up.png'
import AddressHashCard from '../../components/Card/AddressHashCard'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import TitleCard from '../../components/Card/TitleCard'
import Content from '../../components/Content'
import Tooltip from '../../components/Tooltip'
import TransactionItem from '../../components/TransactionItem/index'
import { AppContext } from '../../contexts/providers'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { getBlock } from '../../service/app/block'
import { PageParams } from '../../utils/const'
import { parseSimpleDate } from '../../utils/date'
import i18n from '../../utils/i18n'
import { localeNumberString } from '../../utils/number'
import { isLargeMobile, isMediumMobile, isMobile, isSmallMobile } from '../../utils/screen'
import { parsePageNumber, startEndEllipsis } from '../../utils/string'
import { shannonToCkb } from '../../utils/util'
import {
  BlockDetailPanel,
  BlockMinerPanel,
  BlockOverviewDisplayControlPanel,
  BlockOverviewItemContentPanel,
  BlockRootInfoItemPanel,
  BlockTransactionsPagition,
} from './styled'

const handleMinerText = (address: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(address, 11)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(address, 18)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(address, 23)
  }
  return startEndEllipsis(address, 27)
}

const BlockMiner = ({ miner }: { miner: string }) => {
  return (
    <BlockMinerPanel>
      {miner ? (
        <Link to={`/address/${miner}`}>
          <code>{handleMinerText(miner)}</code>
        </Link>
      ) : (
        i18n.t('address.unable_decode_address')
      )}
    </BlockMinerPanel>
  )
}

const BlockOverviewItemContent = ({ value, tip, message }: { value?: string; tip?: string; message?: string }) => {
  const [show, setShow] = useState(false)
  return (
    <BlockOverviewItemContentPanel>
      {value && <div className="block__overview_item_value">{value}</div>}
      {tip && (
        <div
          id={tip}
          className="block__overview_item_tip"
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
          {tip}
          <Tooltip show={show} targetElementId={tip}>
            {message}
          </Tooltip>
        </div>
      )}
    </BlockOverviewItemContentPanel>
  )
}

const BlockOverview = ({ block }: { block: State.Block }) => {
  const [showAllOverview, setShowAllOverview] = useState(false)
  const receivedTxFee = `${localeNumberString(shannonToCkb(block.receivedTxFee))} CKB`
  const rootInfoItems = [
    {
      title: i18n.t('block.transactions_root'),
      content: `${block.transactionsRoot}`,
    },
    {
      title: i18n.t('block.witnesses_root'),
      content: `${block.witnessesRoot}`,
    },
  ]
  let overviewItems: OverviewItemData[] = [
    {
      title: i18n.t('block.block_height'),
      content: localeNumberString(block.number),
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockMiner miner={block.minerHash} />,
    },
    {
      title: i18n.t('transaction.transactions'),
      content: localeNumberString(block.transactionsCount),
    },
    {
      title: i18n.t('block.epoch'),
      content: localeNumberString(block.epoch),
    },
    {
      title: i18n.t('block.proposal_transactions'),
      content: block.proposalsCount ? localeNumberString(block.proposalsCount) : 0,
    },
    {
      title: i18n.t('block.epoch_start_number'),
      content: localeNumberString(block.startNumber),
    },
    {
      title: i18n.t('block.block_reward'),
      content: (
        <BlockOverviewItemContent
          value={`${localeNumberString(shannonToCkb(block.reward))} CKB`}
          tip={block.rewardStatus === 'pending' ? i18n.t('block.pending') : undefined}
          message={i18n.t('block.pending_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.epoch_length'),
      content: localeNumberString(block.length),
    },
    {
      title: i18n.t('transaction.transaction_fee'),
      content: (
        <BlockOverviewItemContent
          value={block.receivedTxFeeStatus === 'calculating' && block.number > 0 ? undefined : receivedTxFee}
          tip={
            block.receivedTxFeeStatus === 'calculating' && block.number > 0 ? i18n.t('block.calculating') : undefined
          }
          message={i18n.t('block.calculating_tip')}
        />
      ),
    },
    {
      title: i18n.t('block.difficulty'),
      content: localeNumberString(block.difficulty, 16),
    },
    {
      title: i18n.t('block.timestamp'),
      content: `${parseSimpleDate(block.timestamp)}`,
    },
    {
      title: i18n.t('block.nonce'),
      content: `${block.nonce}`,
    },
    {
      title: i18n.t('block.uncle_count'),
      content: `${block.unclesCount}`,
    },
  ]

  if (isMobile()) {
    const newItems: OverviewItemData[] = []
    overviewItems.forEach((item, index) => (index % 2 === 0 ? newItems.push(item) : null))
    overviewItems.forEach((item, index) => (index % 2 !== 0 ? newItems.push(item) : null))
    overviewItems = newItems.concat(rootInfoItems)
    if (!showAllOverview) {
      overviewItems.splice(11, overviewItems.length - 11)
    }
  }
  return (
    <OverviewCard items={overviewItems}>
      {isMobile() ? (
        <BlockOverviewDisplayControlPanel onClick={() => setShowAllOverview(!showAllOverview)}>
          <img src={showAllOverview ? PackUpIcon : DropDownIcon} alt={showAllOverview ? 'show' : 'hide'} />
        </BlockOverviewDisplayControlPanel>
      ) : (
        rootInfoItems.map(item => {
          return (
            <BlockRootInfoItemPanel key={item.title}>
              <div className="block__root_info_title">{item.title}</div>
              <div className="block__root_info_value">{item.content}</div>
            </BlockRootInfoItemPanel>
          )
        })
      )}
    </OverviewCard>
  )
}

export default ({
  dispatch,
  history: { replace, push },
  match: { params },
  location: { search },
}: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps<{ param: string }>>) => {
  // blockParam: block hash or block number
  const { param: blockParam } = params
  const parsed = queryString.parse(search)
  const { blockState } = useContext(AppContext)

  const currentPage = parsePageNumber(parsed.page, PageParams.PageNo)
  const pageSize = parsePageNumber(parsed.size, PageParams.PageSize)
  const totalPages = Math.ceil(blockState.total / pageSize)

  useEffect(() => {
    if (pageSize > PageParams.MaxPageSize) {
      replace(`/block/${blockParam}?page=${currentPage}&size=${PageParams.MaxPageSize}`)
    }
    getBlock(blockParam, currentPage, pageSize, dispatch, replace)
  }, [replace, blockParam, currentPage, pageSize, dispatch])

  const onChange = (page: number) => {
    push(`/block/${blockParam}?page=${page}&size=${pageSize}`)
  }

  return (
    <Content>
      <BlockDetailPanel className="container">
        {blockState && blockState.block && (
          <AddressHashCard title={i18n.t('block.block')} hash={blockState.block.blockHash} dispatch={dispatch} />
        )}
        <TitleCard title={i18n.t('common.overview')} />
        {blockState && <BlockOverview block={blockState.block} />}
        <TitleCard title={i18n.t('transaction.transactions')} />
        {blockState &&
          blockState.transactions &&
          blockState.transactions.map((transaction: State.Transaction, index: number) => {
            return (
              transaction && (
                <TransactionItem
                  key={transaction.transactionHash}
                  transaction={transaction}
                  isBlock
                  isLastItem={index === blockState.transactions.length - 1}
                />
              )
            )
          })}
        {totalPages > 1 && (
          <BlockTransactionsPagition>
            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={onChange} />
          </BlockTransactionsPagition>
        )}
      </BlockDetailPanel>
    </Content>
  )
}
