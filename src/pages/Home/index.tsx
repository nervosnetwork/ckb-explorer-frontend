import React, { useEffect, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HomeHeaderPanel, HomeHeaderItemPanel, BlockPanel, TableMorePanel } from './styled'
import Content from '../../components/Content'
import { parseTime, parseTimeNoSecond } from '../../utils/date'
import { BLOCK_POLLING_TIME } from '../../utils/const'
import { localeNumberString, handleHashRate, handleDifficulty, parseEpochNumber } from '../../utils/number'
import { handleBigNumber } from '../../utils/string'
import { isMobile } from '../../utils/screen'
import browserHistory from '../../routes/history'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import { getLatestBlocks } from '../../service/app/block'
import getStatistics from '../../service/app/statistics'
import i18n from '../../utils/i18n'
import { BlockCardItem } from './ListCard'

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

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps>) => {
  const { homeBlocks = [], statistics } = useContext(AppContext)
  const [t] = useTranslation()

  useEffect(() => {
    getLatestBlocks(dispatch)
    getStatistics(dispatch)
    const listener = setInterval(() => {
      getLatestBlocks(dispatch)
      getStatistics(dispatch)
    }, BLOCK_POLLING_TIME)
    return () => {
      if (listener) {
        clearInterval(listener)
      }
    }
  }, [dispatch])

  return (
    <Content>
      <HomeHeaderPanel>
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
      <BlockPanel className="container">
        {homeBlocks.map((block, index) => {
          return <BlockCardItem block={block} index={index} dispatch={dispatch} key={block.blockHash} />
        })}
        <TableMorePanel
          onClick={() => {
            browserHistory.push(`/block/list`)
          }}
        >
          <div>
            <div className="table__more">{t('home.more')}</div>
          </div>
        </TableMorePanel>
      </BlockPanel>
    </Content>
  )
}
