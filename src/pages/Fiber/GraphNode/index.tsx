import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon, Link1Icon, LinkBreak1Icon, OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import QRCode from 'qrcode'
import dayjs from 'dayjs'
import Content from '../../../components/Content'
import { explorerService } from '../../../services/ExplorerService'
import { useSetToast } from '../../../components/Toast'
import styles from './index.module.scss'
import Loading from '../../../components/Loading'
import GraphChannelList from '../../../components/GraphChannelList'
import { getFundingThreshold } from '../utils'
import { shannonToCkb } from '../../../utils/util'
import { parseNumericAbbr } from '../../../utils/chart'
import { Link } from '../../../components/Link'
import { Fiber } from '../../../services/ExplorerService/fetcher'
import { useSearchParams } from '../../../hooks'
import { TIME_TEMPLATE } from '../../../constants/common'
import { formalizeChannelAsset } from '../../../utils/fiber'

const GraphNode = () => {
  const [t] = useTranslation()
  const [addr, setAddr] = useState('')
  const { id } = useParams<{ id: string }>()
  const qrRef = useRef<HTMLCanvasElement | null>(null)
  const { channel_state: channelState } = useSearchParams('channel_state')

  const setToast = useSetToast()

  const { data, isLoading } = useQuery({
    queryKey: ['fiber', 'graph', 'node', id],
    queryFn: () => {
      return explorerService.api.getGraphNodeDetail(id)
    },
    enabled: !!id,
  })

  const node = data?.data

  const connectId = addr

  const handleAddrSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const r = e.currentTarget.value
    if (r) {
      setAddr(r)
    }
  }

  useEffect(() => {
    const firstAddr = node?.addresses[0]
    if (firstAddr) {
      setAddr(firstAddr)
    }
  }, [node, setAddr])

  useEffect(() => {
    const cvs = qrRef.current
    if (!cvs || !connectId) return
    QRCode.toCanvas(
      cvs,
      connectId,
      {
        margin: 5,
        errorCorrectionLevel: 'H',
        width: 144,
      },
      err => {
        if (err) {
          console.error(err)
        }
      },
    )
  }, [qrRef, connectId])

  const openAndClosedTxs = useMemo(() => {
    const list: {
      hash: string
      index?: string
      block: {
        number: number
        timestamp: number
      }
      isUdt: boolean
      isOpen: boolean
      accounts: Record<'amount' | 'address', string>[]
    }[] = []

    if (!node?.fiberGraphChannels) return list

    node.fiberGraphChannels.forEach(c => {
      const assets = formalizeChannelAsset(c)

      const isUdt = !!c.openTransactionInfo.udtInfo
      const open = {
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
            amount: `${assets.funding.amount} ${assets.funding.symbol}`,
          },
        ],
      }

      list.push(open)

      const close = c.closedTransactionInfo?.txHash
        ? {
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
                amount: `${a.amount} ${a.symbol}`,
              })) ?? [],
          }
        : null
      if (close) {
        list.push(close)
      }
    })
    return list.sort((a, b) => b.block.timestamp - a.block.timestamp)
  }, [node])

  const [openChannels, closedChannels] = useMemo(() => {
    const open: Fiber.Graph.Channel[] = []
    const closed: Fiber.Graph.Channel[] = []
    node?.fiberGraphChannels
      .sort((a, b) => b.openTransactionInfo.blockNumber - +a.openTransactionInfo.blockNumber)
      .forEach(c => {
        if (c.closedTransactionInfo?.txHash) {
          closed.push(c)
        } else {
          open.push(c)
        }
      })
    return [open, closed]
  }, [node?.fiberGraphChannels])

  if (isLoading) {
    return <Loading show />
  }

  if (!node) {
    return <div>Fiber Peer Not Found</div>
  }

  const thresholds = getFundingThreshold(node)

  const totalCkb = parseNumericAbbr(shannonToCkb(node.totalCapacity))

  const handleCopy = (e: React.SyntheticEvent) => {
    const elm = e.target
    if (!(elm instanceof HTMLElement)) return
    const { copyText } = elm.dataset
    if (!copyText) return
    e.stopPropagation()
    e.preventDefault()
    navigator?.clipboard.writeText(copyText).then(() => setToast({ message: t('common.copied') }))
  }

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <div className={styles.overview}>
          {node.nodeName ? (
            <div className={styles.name}>
              <b>{`${t('fiber.fiber_node')}`}</b>
              <span>{node.nodeName}</span>
              <button type="button" data-copy-text={node.nodeName}>
                <CopyIcon />
              </button>
              {/* {connectId ? ( */}
              {/*   <div> */}
              {/*     <canvas ref={qrRef} className={styles.qrcode} /> */}
              {/*   </div> */}
              {/* ) : null} */}
            </div>
          ) : null}

          <div className={styles.info}>
            <div data-side="left">
              <dl className={styles.addresses}>
                <dt>
                  <label htmlFor="addr">{t('fiber.graph.node.addresses')}</label>
                </dt>
                <dd>
                  <select name="addr" id="addr" onChange={handleAddrSelect}>
                    {node.addresses.map(ra => {
                      return (
                        <option value={ra} key={ra}>
                          {ra}
                        </option>
                      )
                    })}
                  </select>
                  <button type="button" data-copy-text={node.addresses}>
                    <CopyIcon />
                  </button>
                  <a href={addr} title={addr} target="_blank" rel="noopener noreferrer">
                    <OpenInNewWindowIcon />
                  </a>
                </dd>
              </dl>
              <dl>
                <dt>{t('fiber.graph.node.first_seen')}</dt>
                <dd>{dayjs(+node.timestamp).format(TIME_TEMPLATE)}</dd>
              </dl>
              <dl>
                <dt>{t('fiber.graph.node.total_capacity')}</dt>
                <dd>{totalCkb}</dd>
              </dl>
              <dl className={styles.thresholds}>
                <dt>{t('fiber.graph.node.auto_accept_funding_amount')}</dt>
                <dd>
                  {thresholds.map(threshold => {
                    return (
                      <Tooltip key={threshold.id} title={threshold.title}>
                        <span className={styles.token}>
                          <img src={threshold.icon} alt="icon" width="12" height="12" loading="lazy" />
                          {threshold.display}
                        </span>
                      </Tooltip>
                    )
                  })}
                </dd>
              </dl>
            </div>
            <div data-side="right">
              <div>Total Liquidity</div>
              <div className={styles.liquidityDistribution}>Distribution</div>
            </div>
          </div>
        </div>
        <div className={styles.activities}>
          <div className={styles.channels}>
            <h3>{`${t('fiber.peer.channels')}`}</h3>
            <GraphChannelList list={channelState === 'closed' ? closedChannels : openChannels} node={node.nodeId} />
          </div>
          <div className={styles.transactions}>
            <h3>Open & Closed Transactions</h3>
            <div>
              {openAndClosedTxs.map(tx => {
                const key = tx.isOpen ? `${tx.hash}#${tx.index}` : tx.hash
                if (tx.isOpen) {
                  const account = tx.accounts[0]!
                  return (
                    <div key={key} className={styles.tx}>
                      <div title={t('fiber.action.open')}>
                        <Link1Icon />
                        at
                        <time dateTime={tx.block.timestamp.toString()}>
                          {dayjs(tx.block.timestamp).format(TIME_TEMPLATE)}
                        </time>
                        <Tooltip title={`${tx.hash}-${tx.index}`}>
                          <Link to={`/transaction/${tx.hash}#${tx.index}`} className="monospace">
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
                      at
                      <time dateTime={tx.block.timestamp.toString()}>
                        {dayjs(tx.block.timestamp).format(TIME_TEMPLATE)}
                      </time>
                      <Tooltip title={`${tx.hash}-${tx.index}`}>
                        <Link to={`/transaction/${tx.hash}#${tx.index}`} className="monospace">
                          <OpenInNewWindowIcon />
                        </Link>
                      </Tooltip>
                    </div>
                    <div>
                      To
                      <span className={styles.addr}>
                        <Tooltip title={acc1.address}>
                          <Link to={`/address/${acc1.address}`} className="monospace">
                            <div>{acc1.address.slice(0, -8)}</div>
                            <div>{acc1.address.slice(-8)}</div>
                          </Link>
                        </Tooltip>
                      </span>
                      <span>({acc1.amount})</span>
                    </div>
                    {acc2 ? (
                      <div>
                        And
                        <span className={styles.addr}>
                          <Tooltip title={acc2.address}>
                            <Link to={`/address/${acc2.address}`} className="monospace">
                              <div>{acc2.address.slice(0, -8)}</div>
                              <div>{acc2.address.slice(-8)}</div>
                            </Link>
                          </Tooltip>
                        </span>
                        <span>({acc2.amount})</span>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default GraphNode
