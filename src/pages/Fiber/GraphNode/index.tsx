import { useEffect, useMemo, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, FilterIcon } from 'lucide-react'
import { utils } from '@ckb-lumos/base'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { Link1Icon, LinkBreak1Icon, OpenInNewWindowIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js'
import type { Response, Fiber } from '../../../services/ExplorerService'
import { explorerService } from '../../../services/ExplorerService'
import { useSetToast } from '../../../components/Toast'
import { useIsMobile, useSearchParams, useUpdateSearchParams } from '../../../hooks'
import { getFundingThreshold } from '../utils'
import { handleFtImgError, shannonToCkb } from '../../../utils/util'
import { parseNumericAbbr } from '../../../utils/chart'
import { formalizeChannelAsset, getIpFromP2pAddr } from '../../../utils/fiber'
import { CKB_PRICE_ID, fetchIpsInfo, fetchPrices } from '../../../services/UtilityService'
import Content from '../../../components/Content'
import { Link } from '../../../components/Link'
import Loading from '../../../components/Loading'
import GraphChannelList from '../../../components/GraphChannelList'
import LiquidityChart from './LiquidityChart'
import Qrcode from '../../../components/Qrcode'
import { ReactComponent as CopyIcon } from '../../../components/Copy/icon.svg'
import Pagination from '../Pagination'
import FtFallbackIcon from '../../../assets/ft_fallback_icon.png'
import styles from './index.module.scss'
import { uniqueColor } from '../../../utils/color'

import { Button } from '../../../components/ui/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/Popover'
import { Drawer, DrawerContent, DrawerTrigger } from '../../../components/ui/Drawer'

import { Label } from '../../../components/ui/Label'
import { Input } from '../../../components/ui/Input'
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/Tabs'

interface QueryResponse extends Response.Response<Fiber.Graph.NodeDetail> {}

const CHANNEL_PAGE_SIZE = 10
const ACTIVITY_PAGE_SIZE = 39
const TIME_TEMPLATE = 'YYYY-MM-DD HH:mm:ss'

const ResponsivePopover = ({ children, content }: { children: ReactNode; content: ReactNode }) => {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger>{children}</DrawerTrigger>
        <DrawerContent
          style={{
            padding: 24,
          }}
        >
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  )
}

const isChannelSort = (
  sort?: string,
): sort is 'position_time.desc' | 'position_time.asc' | 'capacity.desc' | 'capacity.asc' | undefined => {
  if (!sort) return true
  return ['position_time.desc', 'position_time.asc', 'capacity.desc', 'capacity.asc'].includes(sort)
}

const isTxSort = (sort?: string): sort is 'block_timestamp.desc' | 'block_timestamp.asc' | undefined => {
  if (!sort) return true
  return ['block_timestamp.desc', 'block_timestamp.asc'].includes(sort)
}

const isTxStatus = (status?: string): status is 'open' | 'closed' | undefined => {
  if (!status) return true
  return ['open', 'closed'].includes(status)
}

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

const useTransactions = (id: string, query: Parameters<typeof explorerService.api.getGraphNodeTransactions>[1]) => {
  return useQuery({
    queryKey: ['fiber', 'graph', 'node', id, 'transaction', query] as const,
    queryFn: () => explorerService.api.getGraphNodeTransactions(id!, query),
    enabled: !!id,
  })
}
const useNodeChannels = (id: string, query: Parameters<typeof explorerService.api.getGraphNodeChannels>[1]) => {
  return useQuery({
    queryKey: ['fiber', 'graph', 'node', id, 'channels', query] as const,
    queryFn: () => explorerService.api.getGraphNodeChannels(id!, query),
    enabled: !!id,
  })
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

const TransactionRenderer = ({ tx }: { tx: Fiber.Graph.Transaction }) => {
  const [t] = useTranslation()
  const key = tx.index ? `${tx.txHash}#${tx.index}` : tx.txHash
  const timestamp = dayjs(tx.blockTimestamp).format(TIME_TEMPLATE)
  const link = tx.index ? `/transaction/${tx.txHash}#${tx.index}` : `/transaction/${tx.txHash}`
  const tooltip = tx.index ? `${tx.txHash}-${tx.index}` : tx.txHash

  if (tx.isOpen) {
    return (
      <div key={key} className={styles.tx}>
        <dl title={t('fiber.action.open')}>
          <dt>
            <Link1Icon height={20} width={20} fill="#666" color="#666" />
          </dt>
          <dd>
            <time dateTime={tx.blockTimestamp.toString()}>at {timestamp}</time>
            <Tooltip title={tooltip}>
              <Link to={link} className="monospace">
                <OpenInNewWindowIcon />
              </Link>
            </Tooltip>
          </dd>
        </dl>
        <dl>
          <dt>By</dt>
          <dd>
            <span className={styles.addr}>
              <Tooltip title={tx.address}>
                <Link to={`/address/${tx.address}`} className="monospace">
                  <div>{tx.address.slice(0, -8)}</div>
                  <div>{tx.address.slice(-8)}</div>
                </Link>
              </Tooltip>
            </span>
            <span>({tx.capacity})</span>
          </dd>
        </dl>
      </div>
    )
  }

  return (
    <div key={key} className={styles.tx}>
      <dl title={t('fiber.action.close')}>
        <dt>
          <LinkBreak1Icon />
        </dt>
        <dd>
          <time dateTime={tx.blockTimestamp.toString()}>at {timestamp}</time>
          <Tooltip title={tooltip}>
            <Link to={link} className="monospace">
              <OpenInNewWindowIcon />
            </Link>
          </Tooltip>
        </dd>
      </dl>
      {tx.closeAccounts.map((acc, i) => (
        <dl key={acc.address}>
          <dt>{i === 0 ? 'To' : 'And'}</dt>
          <dd>
            <span className={styles.addr}>
              <Tooltip title={acc.address}>
                <Link to={`/address/${acc.address}`} className="monospace">
                  <div>{acc.address.slice(0, -8)}</div>
                  <div>{acc.address.slice(-8)}</div>
                </Link>
              </Tooltip>
            </span>
            <span>({acc.capacity})</span>
          </dd>
        </dl>
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
    channel_page: channelPage = '1',
    channel_sort: channelSort = 'position_time.desc',
    channel_type_hash: channelTypeHash,
    channel_time_range: channelTimeRange,
    channel_amount_range: channelAmountRange,
    channel_address: channelAddress,

    activity_page: activityPage = '1',
    tx_sort: txSort = 'block_timestamp.desc',
    tx_type_hash: txTypeHash,
    tx_time_range: txTimeRange,
    tx_amount_range: txAmountRange,
    tx_status: txStatus,
    tx_address: txAddress,
  } = useSearchParams(
    'channel_state',
    'channel_page',
    'channel_sort',
    'channel_type_hash',
    'channel_time_range',
    'channel_amount_range',
    'channel_address',
    'activity_page',
    'tx_sort',
    'tx_type_hash',
    'tx_time_range',
    'tx_amount_range',
    'tx_status',
    'tx_address',
  )

  const [txSortKey, txSortOrder] = txSort?.split('.')
  const [minTxAmount, maxTxAmount] = (txAmountRange ?? '').split('-')
  const [minChannelAmount, maxChannelAmount] = (channelAmountRange ?? '').split('-')
  const [channelSortKey, channelSortOrder] = channelSort.split('.')

  const updateSearchParams = useUpdateSearchParams<
    | 'channel_state'
    | 'channel_sort'
    | 'channel_type_hash'
    | 'channel_time_range'
    | 'channel_amount_range'
    | 'channel_address'
    | 'channel_page'
    | 'activity_page'
    | 'tx_sort'
    | 'tx_type_hash'
    | 'tx_time_range'
    | 'tx_amount_range'
    | 'tx_status'
    | 'tx_address'
  >()

  const setToast = useSetToast()

  const { data, isLoading } = useNodeData(id)
  const { data: prices } = usePriceData()
  const node = data?.data

  const relatedTokens = (node?.udtCfgInfos ?? []).map(i => ({
    typeHash: utils.computeScriptHash({
      codeHash: i.codeHash,
      hashType: i.hashType,
      args: i.args,
    }),
    symbol: i.symbol,
  }))

  const ips =
    (node?.addresses
      ?.filter(a => !!a)
      .map(getIpFromP2pAddr)
      .filter(ip => !!ip) as string[]) ?? []

  const { data: ipInfos } = useQuery({
    queryKey: ['fiber_graph_ips_info', ips.join(',')],
    queryFn: () => (ips.length ? fetchIpsInfo(ips) : undefined),
    enabled: !!ips.length,
  })

  useEffect(() => {
    if (node?.addresses[0]) {
      setAddr(node.addresses[0])
    }
  }, [node])

  const { data: txData = { fiberGraphTransactions: [], meta: { total: 0, pageSize: 0 } } } = useTransactions(id, {
    page: activityPage,
    pageSize: ACTIVITY_PAGE_SIZE.toString(),
    sort: isTxSort(txSort) ? txSort : undefined,
    typeHash: txTypeHash,
    minTokenAmount: txAmountRange?.split('-')[0],
    maxTokenAmount: txAmountRange?.split('-')[1],
    addressHash: txAddress !== '' ? txAddress : undefined,
    status: isTxStatus(txStatus) ? txStatus : undefined,
    startDate: txTimeRange?.split('-')[0],
    endDate: txTimeRange?.split('-')[1],
  })
  const { data: channelData = { fiberGraphChannels: [], meta: { total: 0, pageSize: 0 } } } = useNodeChannels(id, {
    page: channelPage,
    pageSize: CHANNEL_PAGE_SIZE.toString(),
    sort: isChannelSort(channelSort) ? channelSort : undefined,
    typeHash: channelTypeHash,
    minTokenAmount: channelAmountRange?.split('-')[0],
    maxTokenAmount: channelAmountRange?.split('-')[1],
    addressHash: channelAddress,
    startDate: channelTimeRange?.split('-')[0],
    endDate: channelTimeRange?.split('-')[1],
    status: channelState === 'closed' ? 'closed' : 'open',
  })
  const { fiberGraphChannels: channels = [], meta: channelMeta } = channelData
  const { fiberGraphTransactions: openAndClosedTxs = [], meta: txMeta } = txData

  const totalLiquidity = useTotalLiquidity(channels, prices)

  if (isLoading) return <Loading show />
  if (!node) return <div>{t('fiber.graph.node.not_found')}</div>

  const handleCopy = (e: React.SyntheticEvent) => {
    const copyText = (e.target as HTMLElement)?.dataset?.copyText
    if (!copyText) return
    e.stopPropagation()
    e.preventDefault()
    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }
  const firstSeen = node.createdTimestamp
  const lastUpdate = node.deletedAtTimestamp ?? node.lastUpdatedTimestamp
  const firstSeenISO = new Date(+firstSeen).toISOString()
  const lastUpdateISO = new Date(+lastUpdate).toISOString()

  const ipOfSelectedAddr = getIpFromP2pAddr(addr)
  const ipInfo = ipOfSelectedAddr && ipInfos?.ips ? ipInfos.ips[ipOfSelectedAddr] : null

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
              {ipInfo ? (
                <dl className={styles.isp}>
                  <dt>{t('fiber.graph.node.isp')}</dt>
                  <dd>
                    <Tooltip title={`${ipInfo.isp}`}>
                      <span>{ipInfo.isp}</span>
                    </Tooltip>
                    <span>@{ipInfo.city}</span>
                  </dd>
                </dl>
              ) : null}
              <dl>
                <dt>{t('fiber.graph.node.first_seen_last_update')}</dt>
                <dd className={styles.times}>
                  <time dateTime={firstSeenISO} title={firstSeenISO}>
                    <Link1Icon color="var(--primary-color)" />
                    {dayjs(+firstSeen).format(TIME_TEMPLATE)}
                  </time>
                  <time dateTime={lastUpdateISO} title={lastUpdateISO} data-is-offline={!!node.deletedAtTimestamp}>
                    {node.deletedAtTimestamp ? (
                      <LinkBreak1Icon color="#666" />
                    ) : (
                      <UpdateIcon color="var(--primary-color)" />
                    )}
                    {dayjs(+lastUpdate).format(TIME_TEMPLATE)}
                  </time>
                </dd>
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
                ) : (
                  <div className={styles.noData}>
                    <img src="/images/icons/empty-data.svg" alt="empty data" />
                    <span>{t('common.no_data')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.activities}>
          <div className={styles.channels}>
            <div className={styles.tabHeader}>
              <span className={styles.tabTitle}>{t('fiber.peer.channels')}</span>

              <div className={styles.tabActions}>
                <Button
                  variant="outline"
                  size="icon"
                  style={{ borderWidth: 1 }}
                  onClick={() => {
                    updateSearchParams(params => ({
                      ...params,
                      channel_sort: `${channelSortKey}.${channelSortOrder === 'desc' ? 'asc' : 'desc'}`,
                    }))
                  }}
                >
                  {channelSortOrder === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
                </Button>
                <Select
                  value={channelSortKey}
                  onValueChange={value =>
                    updateSearchParams(params => ({ ...params, channel_sort: `${value}.${channelSortOrder}` }))
                  }
                >
                  <SelectTrigger style={{ borderWidth: 1, padding: '0.5rem 0.75rem', width: '180px' }}>
                    <SelectValue placeholder="sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="position_time">position time</SelectItem>
                    <SelectItem value="capacity">capacity</SelectItem>
                  </SelectContent>
                </Select>

                <ResponsivePopover
                  content={
                    <div className={styles.filterList}>
                      <div className={styles.filterItem}>
                        <Label>Address</Label>
                        <Input
                          placeholder="input address for filter"
                          value={channelAddress}
                          onChange={e =>
                            updateSearchParams(params => ({
                              ...params,
                              channel_address: e.target.value === '' ? undefined : e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className={styles.filterItem}>
                        <Label>Transaction Type</Label>
                        <Tabs
                          value={channelState ?? undefined}
                          onValueChange={value => updateSearchParams(params => ({ ...params, channel_state: value }))}
                        >
                          <TabsList>
                            <TabsTrigger value={undefined as unknown as string}>All</TabsTrigger>
                            <TabsTrigger value="open">Open</TabsTrigger>
                            <TabsTrigger value="closed">Closed</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>

                      <div className={styles.filterItem}>
                        <Label>Asset</Label>
                        <Select
                          value={channelTypeHash}
                          onValueChange={value =>
                            updateSearchParams(params => ({ ...params, channel_type_hash: value }))
                          }
                        >
                          <SelectTrigger style={{ borderWidth: 1, padding: '0.5rem 0.75rem', width: '100%' }}>
                            <SelectValue placeholder="filter token" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null as unknown as string}>All</SelectItem>
                            <SelectItem value="0x0">CKB</SelectItem>
                            {relatedTokens.map(token => (
                              <SelectItem value={token.typeHash} key={token.typeHash}>
                                {token.symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className={styles.group}>
                          <Input
                            placeholder="Min Amount"
                            value={minChannelAmount}
                            onChange={e =>
                              updateSearchParams(params => ({
                                ...params,
                                channel_amount_range: `${e.target.value}-${maxChannelAmount ?? ''}`,
                              }))
                            }
                          />
                          <Input
                            placeholder="Max Amount"
                            value={maxChannelAmount}
                            onChange={e =>
                              updateSearchParams(params => ({
                                ...params,
                                channel_amount_range: `${minChannelAmount ?? ''}-${e.target.value}`,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Button variant="outline" size="icon" style={{ borderWidth: 1 }}>
                    <FilterIcon />
                  </Button>
                </ResponsivePopover>
              </div>
            </div>
            {channels.length ? (
              <>
                <GraphChannelList
                  list={channels}
                  node={node.nodeId}
                  startIndex={(+channelPage - 1) * CHANNEL_PAGE_SIZE}
                />
                <div className={styles.pagination}>
                  <Pagination totalPages={Math.ceil(channelMeta.total / channelMeta.pageSize)} keyword="channel_page" />
                </div>
              </>
            ) : (
              <div className={styles.noData}>
                <img src="/images/icons/empty-data.svg" alt="empty data" />
                <span>{t('common.no_data')}</span>
              </div>
            )}
          </div>
          <div className={styles.transactions}>
            <div className={styles.tabHeader}>
              <span className={styles.tabTitle}>Open & Closed Transactions</span>

              <div className={styles.tabActions}>
                <Button
                  variant="outline"
                  size="icon"
                  style={{ borderWidth: 1 }}
                  onClick={() => {
                    updateSearchParams(params => ({
                      ...params,
                      tx_sort: `${txSortKey}.${txSortOrder === 'desc' ? 'asc' : 'desc'}`,
                    }))
                  }}
                >
                  {txSortOrder === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
                </Button>
                <Select
                  value={txSortKey}
                  onValueChange={value =>
                    updateSearchParams(params => ({ ...params, tx_sort: `${value}.${txSortOrder}` }))
                  }
                >
                  <SelectTrigger style={{ borderWidth: 1, padding: '0.5rem 0.75rem', width: '180px' }}>
                    <SelectValue placeholder="sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block_timestamp">block timestamp</SelectItem>
                  </SelectContent>
                </Select>

                <ResponsivePopover
                  content={
                    <div className={styles.filterList}>
                      <div className={styles.filterItem}>
                        <Label>Address</Label>
                        <Input
                          placeholder="input address for filter"
                          value={txAddress}
                          onChange={e =>
                            updateSearchParams(params => ({
                              ...params,
                              tx_address: e.target.value === '' ? undefined : e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className={styles.filterItem}>
                        <Label>Transaction Type</Label>
                        <Tabs
                          value={txStatus ?? undefined}
                          onValueChange={value => updateSearchParams(params => ({ ...params, tx_status: value }))}
                        >
                          <TabsList>
                            <TabsTrigger value={undefined as unknown as string}>All</TabsTrigger>
                            <TabsTrigger value="open">Open</TabsTrigger>
                            <TabsTrigger value="closed">Closed</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>

                      <div className={styles.filterItem}>
                        <Label>Asset</Label>
                        <Select
                          value={txTypeHash}
                          onValueChange={value => updateSearchParams(params => ({ ...params, tx_type_hash: value }))}
                        >
                          <SelectTrigger style={{ borderWidth: 1, padding: '0.5rem 0.75rem', width: '100%' }}>
                            <SelectValue placeholder="filter token" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null as unknown as string}>All</SelectItem>
                            <SelectItem value="0x0">CKB</SelectItem>
                            {relatedTokens.map(token => (
                              <SelectItem value={token.typeHash} key={token.typeHash}>
                                {token.symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className={styles.group}>
                          <Input
                            placeholder="Min Amount"
                            value={minTxAmount}
                            onChange={e =>
                              updateSearchParams(params => ({
                                ...params,
                                tx_amount_range: `${e.target.value}-${maxTxAmount ?? ''}`,
                              }))
                            }
                          />
                          <Input
                            placeholder="Max Amount"
                            value={maxTxAmount}
                            onChange={e =>
                              updateSearchParams(params => ({
                                ...params,
                                tx_amount_range: `${minTxAmount ?? ''}-${e.target.value}`,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Button variant="outline" size="icon" style={{ borderWidth: 1 }}>
                    <FilterIcon />
                  </Button>
                </ResponsivePopover>
              </div>
            </div>
            {openAndClosedTxs?.length ? (
              <>
                <div>
                  {openAndClosedTxs.map(tx => (
                    <TransactionRenderer key={tx.txHash} tx={tx} />
                  ))}
                </div>
                <div className={styles.pagination}>
                  <Pagination totalPages={Math.ceil(txMeta.total / txMeta.pageSize)} keyword="activity_page" />
                </div>
              </>
            ) : (
              <div className={styles.noData}>
                <img src="/images/icons/empty-data.svg" alt="empty data" />
                <span>{t('common.no_data')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Content>
  )
}

export default GraphNode
