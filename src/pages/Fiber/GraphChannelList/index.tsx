import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { CopyIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import Content from '../../../components/Content'
import { useSetToast } from '../../../components/Toast'
import { explorerService } from '../../../services/ExplorerService'
import { shannonToCkb } from '../../../utils/util'
import { localeNumberString } from '../../../utils/number'
import { parseNumericAbbr } from '../../../utils/chart'
import styles from './index.module.scss'
import Pagination from '../Pagination'
import { PAGE_SIZE } from '../../../constants/common'

const TIME_TEMPLATE = 'YYYY/MM/DD hh:mm:ss'

const GraphNodeList = () => {
  const [t] = useTranslation()
  const setToast = useSetToast()

  const { data } = useQuery({
    queryKey: ['fiber', 'graph', 'channels'],
    queryFn: () => explorerService.api.getGraphChannels(),
  })

  const list = data?.data.fiberGraphChannels ?? []
  const pageInfo = data?.data.meta ?? { total: 1, pageSize: PAGE_SIZE }
  const totalPages = Math.ceil(pageInfo.total / pageInfo.pageSize)

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
        <h1 className={styles.header}>
          <span>CKB Fiber Graph Channels</span>
        </h1>
        <div className={styles.channels}>
          <div className={styles.list}>
            {list.map(channel => {
              const outPoint = {
                txHash: channel.channelOutpoint.slice(0, -8),
                index: parseInt(channel.channelOutpoint.slice(-8), 16),
              }

              const ckb = shannonToCkb(channel.capacity)
              const amount = parseNumericAbbr(ckb)
              return (
                <div key={channel.channelOutpoint} className={styles.channel}>
                  <h1>General</h1>
                  <div className={styles.general}>
                    <dl className={styles.outPoint}>
                      <dt>Out Point</dt>
                      <dd>
                        <div className={styles.content}>
                          <Tooltip title={`${outPoint.txHash}#${outPoint.index}`}>
                            <Link to={`/transaction/${outPoint.txHash}#${outPoint.index}`}>
                              {`${outPoint.txHash.slice(0, 6)}...${outPoint.txHash.slice(-6)}#${outPoint.index}`}
                            </Link>
                          </Tooltip>
                          <Link to={`/transaction/${outPoint.txHash}#${outPoint.index}`}>
                            {`${outPoint.txHash}#${outPoint.index}`}
                          </Link>
                        </div>
                        <button type="button" data-copy-text={outPoint.txHash}>
                          <CopyIcon />
                        </button>
                      </dd>
                    </dl>

                    <dl className={styles.amount}>
                      <dt>Capacity</dt>
                      <dd>
                        <Tooltip title={`${localeNumberString(ckb)} CKB`}>
                          <span>{`${amount} CKB`}</span>
                        </Tooltip>
                      </dd>
                    </dl>

                    <dl className={styles.chainHash}>
                      <dt>Chain Hash</dt>
                      <dd>
                        <div className={styles.content}>
                          <Tooltip title={channel.chainHash}>
                            <span className="monospace">{`${channel.chainHash.slice(0, 8)}...${channel.chainHash.slice(
                              -8,
                            )}`}</span>
                          </Tooltip>
                          <span className="monospace">{channel.chainHash}</span>
                        </div>
                        <button type="button" data-copy-text={channel.chainHash}>
                          <CopyIcon />
                        </button>
                      </dd>
                    </dl>

                    <dl className={styles.time}>
                      <dt>Funded at</dt>
                      <dd>
                        <Link to={`/block/${channel.fundingTxBlockNumber}`}>
                          {localeNumberString(channel.fundingTxBlockNumber)}
                        </Link>
                        (<div>{dayjs(+channel.lastUpdatedTimestamp).format(TIME_TEMPLATE)}</div>)
                      </dd>
                    </dl>
                  </div>

                  <div className={styles.nodesContainer}>
                    <h1>Nodes</h1>
                    <div className={styles.nodes}>
                      <div className={styles.node}>
                        <h3>First Node</h3>
                        <dl>
                          <dt>Public Key</dt>
                          <dd>
                            <Tooltip title={channel.node1}>
                              <span className="monospace">{`${channel.node1.slice(0, 8)}...${channel.node1.slice(
                                -8,
                              )}`}</span>
                            </Tooltip>
                            <button type="button" data-copy-text={channel.node1}>
                              <CopyIcon />
                            </button>
                          </dd>
                        </dl>
                        <dl>
                          <dt>Fee Rate</dt>
                          <dd>{`${localeNumberString(channel.node1ToNode2FeeRate)} shannon/kB`}</dd>
                        </dl>
                      </div>
                      <div className={styles.node}>
                        <h3>Second Node</h3>
                        <dl>
                          <dt>Public Key</dt>
                          <dd>
                            <Tooltip title={channel.node2}>
                              <span className="monospace">{`${channel.node2.slice(0, 8)}...${channel.node2.slice(
                                -8,
                              )}`}</span>
                            </Tooltip>
                            <button type="button" data-copy-text={channel.node2}>
                              <CopyIcon />
                            </button>
                          </dd>
                        </dl>
                        <dl>
                          <dt>Fee Rate</dt>
                          <dd>{`${localeNumberString(channel.node2ToNode1FeeRate)} shannon/kB`}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.pagination}>
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </Content>
  )
}

export default GraphNodeList
