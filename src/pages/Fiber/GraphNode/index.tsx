import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { Link1Icon, LinkBreak1Icon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js'
import type { Response, Fiber } from '../../../services/ExplorerService'
import { explorerService } from '../../../services/ExplorerService'
import { useSetToast } from '../../../components/Toast'
import { useSearchParams } from '../../../hooks'
import { getFundingThreshold } from '../utils'
import { handleFtImgError, shannonToCkb } from '../../../utils/util'
import { parseNumericAbbr } from '../../../utils/chart'
import { formalizeChannelAsset } from '../../../utils/fiber'
import { fetchPrices } from '../../../services/UtilityService'
import { TIME_TEMPLATE } from '../../../constants/common'
import Content from '../../../components/Content'
import { Link } from '../../../components/Link'
import Loading from '../../../components/Loading'
import GraphChannelList from '../../../components/GraphChannelList'
import LiquidityChart from './LiquidityChart'
import Qrcode from '../../../components/Qrcode'
import { ReactComponent as CopyIcon } from '../../../components/Copy/icon.svg'
import type { NodeTransaction } from './types'
import Pagination from '../Pagination'
import FtFallbackIcon from '../../../assets/ft_fallback_icon.png'
import styles from './index.module.scss'
import { uniqueColor } from '../../../utils/color'

interface QueryResponse extends Response.Response<Fiber.Graph.NodeDetail> {}

const CHANNEL_PAGE_SIZE = 10
const ACTIVITY_PAGE_SIZE = 39
const CKB_PRICE_ID = '0x0000000000000000000000000000000000000000000000000000000000000000'

const useNodeData = (id: string | undefined) => {
  return useQuery({
    queryKey: ['fiber', 'graph', 'node', id] as const,
    queryFn: () => explorerService.api.getGraphNodeDetail(id!),
    enabled: !!id,
  } satisfies UseQueryOptions<QueryResponse>)
}

const usePriceData = () => {
  return useQuery({
    queryKey: ['utility', 'prices'] as const,
    queryFn: fetchPrices,
    refetchInterval: 30000,
  })
}

const useTransactions = (node: Fiber.Graph.NodeDetail | undefined) => {
  return useMemo(() => {
    if (!node?.fiberGraphChannels) return []

    return node.fiberGraphChannels
      .flatMap(c => {
        const assets = formalizeChannelAsset(c)
        const isUdt = !!c.openTransactionInfo.udtInfo

        const transactions = [
          {
            isOpen: true,
            isUdt,
            hash: c.openTransactionInfo.txHash,
            block: {
              number: c.openTransactionInfo.blockNumber,
              timestamp: c.openTransactionInfo.blockTimestamp,
            },
            accounts: [
              {
                address: c.openTransactionInfo.address,
                amount: `${parseNumericAbbr(assets.funding.amount)} ${assets.funding.symbol}`,
              },
            ],
          },
        ]

        if (c.closedTransactionInfo?.txHash) {
          transactions.push({
            isOpen: false,
            hash: c.closedTransactionInfo.txHash,
            block: {
              number: c.closedTransactionInfo.blockNumber,
              timestamp: c.closedTransactionInfo.blockTimestamp,
            },
            isUdt,
            accounts:
              assets.close?.map(a => ({
                address: a.addr,
                amount: `${parseNumericAbbr(a.amount)} ${a.symbol}`,
              })) ?? [],
          })
        }

        return transactions
      })
      .sort((a, b) => b.block.timestamp - a.block.timestamp)
  }, [node])
}

const useChannels = (node: Fiber.Graph.NodeDetail | undefined) => {
  return useMemo<[Fiber.Graph.Channel[], Fiber.Graph.Channel[]]>(() => {
    if (!node?.fiberGraphChannels) return [[], []]

    return node.fiberGraphChannels
      .sort((a, b) => b.openTransactionInfo.blockNumber - a.openTransactionInfo.blockNumber)
      .reduce<[Fiber.Graph.Channel[], Fiber.Graph.Channel[]]>(
        ([open, closed], c) => {
          return c.closedTransactionInfo?.txHash ? [open, [...closed, c]] : [[...open, c], closed]
        },
        [[], []],
      )
  }, [node?.fiberGraphChannels])
}

const useTotalLiquidity = (
  openChannels: Fiber.Graph.Channel[],
  prices?: {
    price?: Record<
      string /* token id */,
      {
        pair: string
        price: string
      }
    >
  },
) => {
  return useMemo(() => {
    return openChannels.reduce(
      (acc, ch) => {
        if (!ch.openTransactionInfo.udtInfo) {
          const total = acc.get('ckb')?.amount ?? BigNumber(0)
          const ckbPrice = prices?.price?.[CKB_PRICE_ID]?.price
          const ckbAmount = total.plus(BigNumber(shannonToCkb(ch.capacity)))
          acc.set('ckb', {
            amount: ckbAmount,
            symbol: 'CKB',
            usd: ckbPrice ? ckbAmount.times(+ckbPrice) : undefined,
          })
        } else {
          const assets = formalizeChannelAsset(ch)
          const key = ch.openTransactionInfo.udtInfo.typeHash
          const total = acc.get(key)?.amount ?? BigNumber(0)
          const amount = total.plus(BigNumber(assets.funding.amount ?? 0))
          const price = prices?.price?.[key]?.price
          acc.set(key, {
            amount,
            symbol: assets.funding.symbol ?? '',
            iconFile: ch.openTransactionInfo.udtInfo.iconFile,
            usd: price ? amount.times(price) : undefined,
          })
        }
        return acc
      },
      new Map<
        string /* token id */,
        {
          amount: BigNumber
          symbol: string
          iconFile?: string
          usd?: BigNumber
        }
      >(),
    )
  }, [openChannels, prices])
}

const TransactionRenderer = ({ tx }: { tx: NodeTransaction }) => {
  const [t] = useTranslation()
  const key = tx.index ? `${tx.hash}#${tx.index}` : tx.hash
  const timestamp = dayjs(tx.block.timestamp).format(TIME_TEMPLATE)
  const link = tx.index ? `/transaction/${tx.hash}#${tx.index}` : `/transaction/${tx.hash}`
  const tooltip = tx.index ? `${tx.hash}-${tx.index}` : tx.hash

  if (tx.isOpen) {
    const account = tx.accounts[0]!
    return (
      <div key={key} className={styles.tx}>
        <div title={t('fiber.action.open')}>
          <Link1Icon />
          at <time dateTime={tx.block.timestamp.toString()}>{timestamp}</time>
          <Tooltip title={tooltip}>
            <Link to={link} className="monospace">
              <OpenInNewWindowIcon />
            </Link>
          </Tooltip>
        </div>
        <div>
          By
          <span className={styles.addr}>
            <Tooltip title={account.address}>
              <Link to={`/address/${account.address}`} className="monospace">
                <div>{account.address.slice(0, -8)}</div>
                <div>{account.address.slice(-8)}</div>
              </Link>
            </Tooltip>
          </span>
          <span>({account.amount})</span>
        </div>
      </div>
    )
  }

  const [acc1, acc2] = tx.accounts
  return (
    <div key={key} className={styles.tx}>
      <div title={t('fiber.action.close')}>
        <LinkBreak1Icon />
        at <time dateTime={tx.block.timestamp.toString()}>{timestamp}</time>
        <Tooltip title={tooltip}>
          <Link to={link} className="monospace">
            <OpenInNewWindowIcon />
          </Link>
        </Tooltip>
      </div>
      {[acc1, acc2].filter(Boolean).map((acc, i) => (
        <div key={acc.address}>
          {i === 0 ? 'To' : 'And'}
          <span className={styles.addr}>
            <Tooltip title={acc.address}>
              <Link to={`/address/${acc.address}`} className="monospace">
                <div>{acc.address.slice(0, -8)}</div>
                <div>{acc.address.slice(-8)}</div>
              </Link>
            </Tooltip>
          </span>
          <span>({acc.amount})</span>
        </div>
      ))}
    </div>
  )
}

const GraphNode = () => {
  const [t] = useTranslation()
  const [addr, setAddr] = useState('')
  const { id } = useParams<{ id: string }>()
  const {
    channel_state: channelState,
    channel_page: channelPage = 1,
    activity_page: activityPage = 1,
  } = useSearchParams('channel_state', 'channel_page', 'activity_page')
  const setToast = useSetToast()

  const { data, isLoading } = useNodeData(id)
  const { data: prices } = usePriceData()
  const node = data?.data

  useEffect(() => {
    if (node?.addresses[0]) {
      setAddr(node.addresses[0])
    }
  }, [node])

  const openAndClosedTxs = useTransactions(node)
  const [openChannels, closedChannels] = useChannels(node)
  const displayedChannels = channelState === 'closed' ? closedChannels : openChannels
  const totalLiquidity = useTotalLiquidity(openChannels, prices)

  if (isLoading) return <Loading show />
  if (!node) return <div>{t('fiber.graph.node.not_found')}</div>

  const handleCopy = (e: React.SyntheticEvent) => {
    const copyText = (e.target as HTMLElement)?.dataset?.copyText
    if (!copyText) return
    e.stopPropagation()
    e.preventDefault()
    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <div className={styles.overview}>
          {node.nodeName && (
            <div className={styles.name}>
              <b>{t('fiber.fiber_node')}</b>
              <span>{node.nodeName}</span>
              <button type="button" data-copy-text={node.nodeName}>
                <CopyIcon />
              </button>
            </div>
          )}

          <div className={styles.info}>
            <div data-side="left">
              <dl className={styles.addresses}>
                <dt>
                  <label htmlFor="addr">{t('fiber.graph.node.addresses')}</label>
                </dt>
                <dd>
                  <select name="addr" id="addr" onChange={e => setAddr(e.currentTarget.value)}>
                    {node.addresses.map(ra => (
                      <option value={ra} key={ra}>
                        {ra}
                      </option>
                    ))}
                  </select>
                  <Qrcode text={addr} size={16} />
                  <button type="button" data-copy-text={addr}>
                    <CopyIcon width={16} height={16} />
                  </button>
                </dd>
              </dl>
              <dl>
                <dt>{t('fiber.graph.node.first_seen')}</dt>
                <dd>{dayjs(+node.timestamp).format(TIME_TEMPLATE)}</dd>
              </dl>
              <dl>
                <dt>{t('fiber.graph.node.total_capacity')}</dt>
                <dd>{parseNumericAbbr(shannonToCkb(node.totalCapacity), 2)}</dd>
              </dl>
              <dl className={styles.thresholds}>
                <dt>{t('fiber.graph.node.auto_accept_funding_amount')}</dt>
                <dd>
                  {getFundingThreshold(node).map(threshold => (
                    <Tooltip key={threshold.id} title={threshold.title}>
                      <span className={styles.token}>
                        <img
                          src={threshold.icon ?? FtFallbackIcon}
                          alt="icon"
                          width="12"
                          height="12"
                          loading="lazy"
                          onError={handleFtImgError}
                        />
                        {threshold.display}
                      </span>
                    </Tooltip>
                  ))}
                </dd>
              </dl>
            </div>
            <div data-side="right" className={styles.totalLiquidity}>
              <div>
                <div className={styles.liquidityTitle}>{t('fiber.graph.node.total_liquidity')}</div>
                <div>
                  {[...totalLiquidity.keys()]
                    .sort((a, b) => {
                      if (a === 'ckb') return -1
                      if (b === 'ckb') return 1
                      return a.localeCompare(b)
                    })
                    .map(key => {
                      const liquidity = totalLiquidity.get(key)
                      if (!liquidity) return null
                      return (
                        <div key={key} className={styles.liquidity}>
                          <span
                            className={styles.marker}
                            style={{
                              backgroundColor: uniqueColor(key),
                            }}
                          />
                          <span>{parseNumericAbbr(liquidity.amount, 2)}</span>
                          <span>{liquidity.symbol}</span>
                          {liquidity.usd && (
                            <span className={styles.usd}>({parseNumericAbbr(liquidity.usd, 2)} USD)</span>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
              <div className={styles.liquidityAllocation}>
                <div className={styles.liquidityTitle}>{t('fiber.graph.node.liquidity_allocation')}</div>
                {totalLiquidity.size ? (
                  <LiquidityChart
                    assets={[...totalLiquidity.entries()].map(([key, v]) => ({
                      key,
                      symbol: v.symbol,
                      usd: v.usd?.toFixed() ?? '0',
                    }))}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.activities}>
          <div className={styles.channels}>
            <h3>{t('fiber.peer.channels')}</h3>
            <GraphChannelList
              list={displayedChannels.slice((+channelPage - 1) * CHANNEL_PAGE_SIZE, +channelPage * CHANNEL_PAGE_SIZE)}
              node={node.nodeId}
              startIndex={(+channelPage - 1) * CHANNEL_PAGE_SIZE}
            />
            <div className={styles.pagination}>
              <Pagination totalPages={Math.ceil(displayedChannels.length / CHANNEL_PAGE_SIZE)} keyword="channel_page" />
            </div>
          </div>
          <div className={styles.transactions}>
            <h3>Open & Closed Transactions</h3>
            <div>
              {openAndClosedTxs
                .slice((+activityPage - 1) * ACTIVITY_PAGE_SIZE, ACTIVITY_PAGE_SIZE * +activityPage)
                .map(tx => (
                  <TransactionRenderer key={tx.hash} tx={tx} />
                ))}
            </div>
            <div className={styles.pagination}>
              <Pagination
                totalPages={Math.ceil(openAndClosedTxs.length / ACTIVITY_PAGE_SIZE)}
                keyword="activity_page"
              />
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default GraphNode
