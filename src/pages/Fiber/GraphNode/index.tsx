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
import { ChainHash } from '../../../constants/fiberChainHash'
import { Link } from '../../../components/Link'
import { localeNumberString } from '../../../utils/number'

const TIME_TEMPLATE = 'YYYY/MM/DD hh:mm:ss'

const GraphNode = () => {
  const [t] = useTranslation()
  const [addr, setAddr] = useState('')
  const { id } = useParams<{ id: string }>()
  const qrRef = useRef<HTMLCanvasElement | null>(null)

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
      const isUdt = !!c.openTransactionInfo.udtAmount
      const open = {
        isOpen: true,
        isUdt,
        hash: c.openTransactionInfo.txHash,
        index: c.fundingTxIndex,
        block: {
          number: c.openTransactionInfo.blockNumber,
          timestamp: c.openTransactionInfo.blockTimestamp,
        },
        accounts: [
          {
            address: c.openTransactionInfo.address,
            amount:
              c.openTransactionInfo.udtAmount ??
              `${localeNumberString(shannonToCkb(c.openTransactionInfo.capacity))} CKB`,
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
            accounts: c.closedTransactionInfo.closeAccounts.map(acc => {
              return {
                amount: acc.udtAmount ?? `${localeNumberString(shannonToCkb(acc.capacity))} CKB`,
                address: acc.address,
              }
            }),
          }
        : null
      if (close) {
        list.push(close)
      }
    })
    return list.sort((a, b) => a.block.timestamp - b.block.timestamp)
  }, [node])

  if (isLoading) {
    return <Loading show />
  }

  if (!node) {
    return <div>Fiber Peer Not Found</div>
  }
  const channels = node.fiberGraphChannels.filter(c => !c.closedTransactionInfo)

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

  const chain = ChainHash.get(node.chainHash) ?? '-'

  return (
    <Content>
      <div className={styles.container} onClick={handleCopy}>
        <div className={styles.overview}>
          <div className={styles.fields}>
            {node.alias ? (
              <dl>
                <dt>{t('fiber.graph.alias')}</dt>
                <dd className={styles.alias}>
                  <span>{node.alias}</span>
                  <button type="button" data-copy-text={node.alias}>
                    <CopyIcon />
                  </button>
                </dd>
              </dl>
            ) : null}
            <dl>
              <dt>{t('fiber.graph.node.id')}</dt>
              <dd className={styles.id}>
                <span>{`0x${node.nodeId}`}</span>
                <button type="button" data-copy-text={`0x${node.nodeId}`}>
                  <CopyIcon />
                </button>
              </dd>
            </dl>
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
              <dt>{t('fiber.graph.node.chain')}</dt>
              <dd>
                <Tooltip title={node.chainHash}>{chain}</Tooltip>
              </dd>
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
          {connectId ? (
            <div>
              <canvas ref={qrRef} className={styles.qrcode} />
            </div>
          ) : null}
        </div>
        <div className={styles.activities}>
          <div className={styles.channels}>
            <h3>{`${t('fiber.peer.channels')}(${channels.length})`}</h3>
            <GraphChannelList list={channels} node={node.nodeId} />
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
                      <div>
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
                    <div>
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
