import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  HomeHeaderPanel,
  HomeHeaderItemPanel,
  BlockPanel,
  TableMorePanel,
  TableHeaderPanel,
  HomeTablePanel,
  TransactionPanel,
} from './styled'
import Content from '../../components/Content'
import { parseTime, parseTimeNoSecond } from '../../utils/date'
import { BLOCK_POLLING_TIME, BLOCKCHAIN_ALERT_POLLING_TIME } from '../../utils/const'
import { localeNumberString, handleHashRate, handleDifficulty, parseEpochNumber } from '../../utils/number'
import { handleBigNumber } from '../../utils/string'
import { isMobile } from '../../utils/screen'
import browserHistory from '../../routes/history'
import { useAppState, useDispatch } from '../../contexts/providers'
import { getLatestBlocks } from '../../service/app/block'
import getStatistics from '../../service/app/statistics'
import i18n from '../../utils/i18n'
import LatestBlocksIcon from '../../assets/latest_blocks.png'
import LatestTransactionsIcon from '../../assets/latest_transactions.png'
import { BlockCardItem, TransactionCardItem } from './TableCard'
import { getLatestTransactions } from '../../service/app/transaction'
import { getTipBlockNumber } from '../../service/app/address'
import Loading from '../../components/Loading/SmallLoading'
import { useInterval } from '../../utils/hook'
import { handleBlockchainAlert } from '../../service/app/blockchain'

const BlockchainItem = ({ blockchain }: { blockchain: BlockchainData }) => {
  return (
    <HomeHeaderItemPanel>
      <div className="blockchain__item__content">
        <div className="blockchain__item__top_name">{blockchain.topName}</div>
        <div className="blockchain__item__top_value">{blockchain.topValue}</div>
        <div className="blockchain__item__separate" />
        <div className="blockchain__item__bottom_name">{blockchain.bottomName}</div>
        <div className="blockchain__item__bottom_value">
          <div>{blockchain.bottomValue}</div>
          {blockchain.rightValue && <div>{blockchain.rightValue}</div>}
        </div>
      </div>
      {blockchain.showSeparate && <div className="blockchain__item__between_separate" />}
    </HomeHeaderItemPanel>
  )
}

interface BlockchainData {
  topName: string
  topValue: string
  bottomName: string
  bottomValue: string
  rightValue?: string
  showSeparate: boolean
}

const parseHashRate = (hashRate: string | undefined) => {
  return hashRate ? handleHashRate(Number(hashRate) * 1000) : '- -'
}

const parseBlockTime = (blockTime: string | undefined) => {
  return blockTime ? parseTime(Number(blockTime)) : '- -'
}

const blockchainDataList = (statistics: State.Statistics): BlockchainData[] => {
  return [
    {
      topName: i18n.t('blockchain.latest_block'),
      topValue: localeNumberString(statistics.tipBlockNumber),
      bottomName: i18n.t('blockchain.epoch'),
      bottomValue: `${statistics.epochInfo.index}/${statistics.epochInfo.epochLength}`,
      rightValue: parseEpochNumber(statistics.epochInfo.epochNumber),
      showSeparate: true,
    },
    {
      topName: i18n.t('blockchain.average_block_time'),
      topValue: parseBlockTime(statistics.averageBlockTime),
      bottomName: i18n.t('blockchain.estimated_epoch_time'),
      bottomValue: parseTimeNoSecond(Number(statistics.estimatedEpochTime)),
      showSeparate: !isMobile(),
    },
    {
      topName: i18n.t('blockchain.hash_rate'),
      topValue: parseHashRate(statistics.hashRate),
      bottomName: i18n.t('blockchain.difficulty'),
      bottomValue: handleDifficulty(statistics.currentEpochDifficulty),
      showSeparate: true,
    },
    {
      topName: i18n.t('blockchain.transactions_per_minute'),
      topValue: handleBigNumber(statistics.transactionsCountPerMinute, 2),
      bottomName: i18n.t('blockchain.transactions_last_24hrs'),
      bottomValue: handleBigNumber(statistics.transactionsLast24Hrs, 2),
      showSeparate: false,
    },
  ]
}

export default () => {
  const dispatch = useDispatch()
  const {
    homeBlocks = [],
    transactionsState: { transactions = [] },
    statistics,
    app: { tipBlockNumber },
  } = useAppState()
  const [t] = useTranslation()

  useEffect(() => {
    getLatestBlocks(dispatch)
    getLatestTransactions(dispatch)
    getTipBlockNumber(dispatch)
    getStatistics(dispatch)
    const listener = setInterval(() => {
      getTipBlockNumber(dispatch)
      getLatestBlocks(dispatch)
      getLatestTransactions(dispatch)
      getStatistics(dispatch)
    }, BLOCK_POLLING_TIME)
    return () => {
      if (listener) {
        clearInterval(listener)
      }
    }
  }, [dispatch])

  useInterval(() => {
    handleBlockchainAlert(dispatch)
  }, BLOCKCHAIN_ALERT_POLLING_TIME)

  return (
    <Content>
      <HomeHeaderPanel className="container">
        <div className="blockchain__item__container">
          {!isMobile() &&
            blockchainDataList(statistics).map((data: BlockchainData) => {
              return <BlockchainItem blockchain={data} key={data.topName} />
            })}
          {isMobile() && (
            <>
              <div className="blockchain__item__mobile">
                {blockchainDataList(statistics)
                  .slice(0, 2)
                  .map((data: BlockchainData) => {
                    return <BlockchainItem blockchain={data} key={data.topName} />
                  })}
              </div>
              <div className="blockchain__item__mobile_separate" />
              <div className="blockchain__item__mobile">
                {blockchainDataList(statistics)
                  .slice(2)
                  .map((data: BlockchainData) => {
                    return <BlockchainItem blockchain={data} key={data.topName} />
                  })}
              </div>
            </>
          )}
        </div>
      </HomeHeaderPanel>
      <HomeTablePanel className="container">
        <BlockPanel>
          <TableHeaderPanel>
            <img src={LatestBlocksIcon} alt="latest blocks" />
            <span>{i18n.t('home.latest_blocks')}</span>
          </TableHeaderPanel>
          {homeBlocks.length > 0 ? (
            <>
              {homeBlocks.map((block, index) => {
                return (
                  <div key={block.number}>
                    <BlockCardItem block={block} index={index} />
                    {homeBlocks.length - 1 !== index && <div className="block__card__separate" />}
                  </div>
                )
              })}
            </>
          ) : (
            <Loading />
          )}
          <TableMorePanel
            onClick={() => {
              browserHistory.push(`/block/list`)
            }}
          >
            <span>{t('home.more')}</span>
          </TableMorePanel>
        </BlockPanel>
        <TransactionPanel>
          <TableHeaderPanel>
            <img src={LatestTransactionsIcon} alt="latest transactions" />
            <span>{i18n.t('home.latest_transactions')}</span>
          </TableHeaderPanel>
          {transactions.length > 0 ? (
            <>
              {transactions.map((transaction, index) => {
                return (
                  <div key={transaction.transactionHash}>
                    <TransactionCardItem transaction={transaction} tipBlockNumber={tipBlockNumber} />
                    {transactions.length - 1 !== index && <div className="transaction__card__separate" />}
                  </div>
                )
              })}
            </>
          ) : (
            <Loading />
          )}

          <TableMorePanel
            onClick={() => {
              browserHistory.push(`/transaction/list`)
            }}
          >
            <span>{t('home.more')}</span>
          </TableMorePanel>
        </TransactionPanel>
      </HomeTablePanel>
    </Content>
  )
}
