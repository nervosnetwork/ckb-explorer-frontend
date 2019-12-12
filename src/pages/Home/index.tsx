import React, { useEffect, useContext, useMemo } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HomeHeaderPanel,
  HomeHeaderItemPanel,
  BlockPanel,
  ContentTable,
  TableMorePanel,
  HighLightValue,
  BlockRewardContainer,
  BlockRewardPanel,
} from './styled'
import Content from '../../components/Content'
import {
  TableTitleRow,
  TableTitleItem,
  TableContentRow,
  TableContentItem,
  TableMinerContentItem,
} from '../../components/Table'
import { shannonToCkb } from '../../utils/util'
import { parseTime, parseSimpleDate, parseTimeNoSecond } from '../../utils/date'
import { BLOCK_POLLING_TIME, DELAY_BLOCK_NUMBER } from '../../utils/const'
import { localeNumberString, handleHashRate, handleDifficulty } from '../../utils/number'
import { adaptMobileEllipsis, handleBigNumber } from '../../utils/string'
import { isMobile } from '../../utils/screen'
import browserHistory from '../../routes/history'
import { StateWithDispatch } from '../../contexts/providers/reducer'
import { AppContext } from '../../contexts/providers'
import { getLatestBlocks } from '../../service/app/block'
import getStatistics from '../../service/app/statistics'
import i18n from '../../utils/i18n'
import OverviewCard, { OverviewItemData } from '../../components/Card/OverviewCard'
import DecimalCapacity from '../../components/DecimalCapacity'

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
          {blockchain.rightValue && <div>{`${blockchain.rightValue}(th)`}</div>}
        </div>
      </div>
      {blockchain.showSeparate && <div className="blockchain__item__between_separate" />}
    </HomeHeaderItemPanel>
  )
}

const BlockValueItem = ({ value, to }: { value: string; to: string }) => {
  return (
    <HighLightValue>
      <Link to={to}>{value}</Link>
    </HighLightValue>
  )
}

interface TableTitleData {
  title: string
  width: string
}

interface TableContentData {
  width: string
  to?: any
  content: string
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

const getTableContentDataList = (block: State.Block, index: number) => {
  const blockReward =
    index < DELAY_BLOCK_NUMBER ? (
      <BlockRewardContainer>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardContainer>
    ) : (
      <BlockRewardPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardPanel>
    )
  return [
    {
      width: '14%',
      to: `/block/${block.number}`,
      content: localeNumberString(block.number),
    },
    {
      width: '8%',
      content: `${block.transactionsCount}`,
    },
    {
      width: '20%',
      content: blockReward,
    },
    {
      width: '43%',
      content: block.minerHash,
    },
    {
      width: '15%',
      content: parseSimpleDate(block.timestamp),
    },
  ] as TableContentData[]
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
      bottomValue: `${statistics.epochInfo.epochNumber}/${statistics.epochInfo.epochLength}`,
      rightValue: statistics.epochInfo.index,
      showSeparate: true,
    },
    {
      topName: i18n.t('blockchain.average_block_time'),
      topValue: parseBlockTime(statistics.averageBlockTime),
      bottomName: i18n.t('blockchain.estimated_epoch_time'),
      bottomValue: parseTimeNoSecond(Number(statistics.estimatedEpochTime)),
      showSeparate: true,
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

const blockCardItems = (block: State.Block, index: number) => {
  const blockReward =
    index < DELAY_BLOCK_NUMBER ? (
      <BlockRewardContainer>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardContainer>
    ) : (
      <BlockRewardPanel>
        <DecimalCapacity value={localeNumberString(shannonToCkb(block.reward))} hideUnit />
      </BlockRewardPanel>
    )

  return [
    {
      title: i18n.t('home.height'),
      content: <BlockValueItem value={localeNumberString(block.number)} to={`/block/${block.number}`} />,
    },
    {
      title: i18n.t('home.transactions'),
      content: localeNumberString(block.transactionsCount),
    },
    {
      title: i18n.t('home.block_reward'),
      content: blockReward,
    },
    {
      title: i18n.t('block.miner'),
      content: <BlockValueItem value={adaptMobileEllipsis(block.minerHash, 12)} to={`/address/${block.minerHash}`} />,
    },
    {
      title: i18n.t('home.time'),
      content: parseSimpleDate(block.timestamp),
    },
  ] as OverviewItemData[]
}

export default ({ dispatch }: React.PropsWithoutRef<StateWithDispatch & RouteComponentProps>) => {
  const { homeBlocks = [], statistics } = useContext(AppContext)
  const [t] = useTranslation()

  const TableTitles = useMemo(() => {
    return [
      {
        title: t('home.height'),
        width: '14%',
      },
      {
        title: t('home.transactions'),
        width: '8%',
      },
      {
        title: t('home.block_reward'),
        width: '20%',
      },
      {
        title: t('block.miner'),
        width: '43%',
      },
      {
        title: t('home.time'),
        width: '15%',
      },
    ]
  }, [t])

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
          {blockchainDataList(statistics).map((data: BlockchainData) => {
            return <BlockchainItem blockchain={data} key={data.topName} />
          })}
        </div>
      </HomeHeaderPanel>
      <BlockPanel className="container">
        {isMobile() ? (
          <ContentTable>
            <div className="block__green__background" />
            <div className="block__panel">
              {homeBlocks.map((block: State.Block, index: number) => {
                return <OverviewCard key={block.number} items={blockCardItems(block, index)} />
              })}
            </div>
          </ContentTable>
        ) : (
          <ContentTable>
            <TableTitleRow>
              {TableTitles.map((data: TableTitleData) => {
                return <TableTitleItem width={data.width} title={data.title} key={data.title} />
              })}
            </TableTitleRow>
            {homeBlocks.map((block: State.Block, blockIndex: number) => {
              return (
                block && (
                  <TableContentRow
                    key={block.number}
                    onClick={() => {
                      browserHistory.replace(`/block/${block.blockHash}`)
                    }}
                  >
                    {getTableContentDataList(block, blockIndex).map((data: TableContentData, index: number) => {
                      const key = index
                      return (
                        <React.Fragment key={key}>
                          {data.content === block.minerHash ? (
                            <TableMinerContentItem width={data.width} content={data.content} />
                          ) : (
                            <TableContentItem width={data.width} content={data.content} to={data.to} />
                          )}
                        </React.Fragment>
                      )
                    })}
                  </TableContentRow>
                )
              )
            })}
          </ContentTable>
        )}
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
