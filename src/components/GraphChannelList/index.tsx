import { CopyIcon, HomeIcon, GlobeIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import type { Fiber } from '../../services/ExplorerService/fetcher'
import { parseNumericAbbr } from '../../utils/chart'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import styles from './index.module.scss'

const TIME_TEMPLATE = 'YYYY/MM/DD hh:mm:ss'

const GraphChannelList: FC<{ list: Fiber.Graph.Channel[]; isFullWidth?: boolean; node?: string }> = ({
  list,
  isFullWidth = true,
  node,
}) => {
  if (!list.length) {
    return <div className={styles.container}>No Channels</div>
  }

  return (
    <div className={styles.container}>
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
              <div className={styles.nodes} data-is-full-width={!!isFullWidth}>
                <div className={styles.node}>
                  <h3>
                    First Node
                    {node ? <span>{node === channel.node1 ? <HomeIcon /> : <GlobeIcon />}</span> : null}
                  </h3>
                  <dl>
                    <dt>ID</dt>
                    <dd>
                      <Tooltip title={channel.node1}>
                        <Link to={`/fiber/graph/node${channel.node1}`} className="monospace">{`0x${channel.node1.slice(
                          0,
                          8,
                        )}...${channel.node1.slice(-8)}`}</Link>
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
                  <h3>
                    Second Node
                    {node ? <span>{node === channel.node2 ? <HomeIcon /> : <GlobeIcon />}</span> : null}
                  </h3>
                  <dl>
                    <dt>ID</dt>
                    <dd>
                      <Tooltip title={channel.node2}>
                        <Link to={`/fiber/graph/node${channel.node2}`} className="monospace">{`0x${channel.node2.slice(
                          0,
                          8,
                        )}...${channel.node2.slice(-8)}`}</Link>
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
  )
}

export default GraphChannelList
