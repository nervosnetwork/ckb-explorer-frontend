import { CopyIcon, HomeIcon, GlobeIcon } from '@radix-ui/react-icons'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { TIME_TEMPLATE } from '../../constants/common'
import type { Fiber } from '../../services/ExplorerService/fetcher'
import { parseNumericAbbr } from '../../utils/chart'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import styles from './index.module.scss'

const GraphChannelList: FC<{ list: Fiber.Graph.Channel[]; node?: string }> = ({ list, node }) => {
  if (!list.length) {
    return <div className={styles.container}>No Channels</div>
  }

  return (
    <div className={styles.container}>
      {list.map((channel, i) => {
        const outPoint = {
          txHash: channel.channelOutpoint.slice(0, -8),
          index: parseInt(channel.channelOutpoint.slice(-8), 16),
        }

        const ckb = shannonToCkb(channel.capacity)
        const amount = parseNumericAbbr(ckb)

        const fundingCkb = shannonToCkb(channel.openTransactionInfo.capacity)
        const fundingCkbAmount = parseNumericAbbr(fundingCkb)

        const fundingUdtAmount = channel.openTransactionInfo.udtAmount
          ? parseNumericAbbr(channel.openTransactionInfo.udtAmount)
          : null

        const outpoint = `${outPoint.txHash}#${outPoint.index}`

        return (
          <div key={channel.channelOutpoint} className={styles.channel}>
            <h1>Channel #{i + 1}</h1>
            <div>
              <dl className={styles.outPoint}>
                <dt>Out Point</dt>
                <dd>
                  <Tooltip title={`${outPoint.txHash}#${outPoint.index}`}>
                    <Link to={`/transaction/${outPoint.txHash}#${outPoint.index}`}>
                      <div>{outpoint.slice(0, -15)}</div>
                      <div>{outpoint.slice(-15)}</div>
                    </Link>
                  </Tooltip>
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
              <dl className={styles.funding}>
                <dt>Source</dt>
                <dd>
                  {fundingUdtAmount || (
                    <Tooltip title={`${localeNumberString(fundingCkb)} CKB`}>
                      <span>{`${fundingCkbAmount} CKB`}</span>
                    </Tooltip>
                  )}
                  from
                  <Tooltip title={channel.openTransactionInfo.address}>
                    <Link to={`/address/${channel.openTransactionInfo.address}`} className={styles.address}>
                      <div>{channel.openTransactionInfo.address.slice(0, -15)}</div>
                      <div>{channel.openTransactionInfo.address.slice(-15)}</div>
                    </Link>
                  </Tooltip>
                </dd>
              </dl>
              <dl>
                <dt>Position</dt>
                <dd>
                  On
                  <Tooltip title={dayjs(+channel.createdTimestamp).format(TIME_TEMPLATE)}>
                    <Link to={`/block/${channel.openTransactionInfo.blockNumber}`}>
                      {localeNumberString(channel.openTransactionInfo.blockNumber)}
                    </Link>
                  </Tooltip>
                </dd>
              </dl>
            </div>

            <div className={styles.nodesContainer}>
              <h1>Nodes</h1>
              <div className={styles.nodes}>
                <div className={styles.node}>
                  <h3>
                    First Node
                    {node ? <span>{node === channel.node1 ? <HomeIcon /> : <GlobeIcon />}</span> : null}
                  </h3>
                  <dl>
                    <dt>ID</dt>
                    <dd>
                      <Tooltip title={channel.node1}>
                        <Link to={`/fiber/graph/node/${channel.node1}`} className="monospace">
                          <div>{`0x${channel.node1.slice(0, -8)}`}</div>
                          <div>{channel.node1.slice(-8)}</div>
                        </Link>
                      </Tooltip>
                      <button type="button" data-copy-text={channel.node1}>
                        <CopyIcon />
                      </button>
                    </dd>
                  </dl>
                  <dl>
                    <dt>Fee Rate</dt>
                    <dd>{`${localeNumberString(channel.feeRateOfNode1)} shannon/kB`}</dd>
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
                        <Link to={`/fiber/graph/node/${channel.node2}`}>
                          <div>{`0x${channel.node2.slice(0, -8)}`}</div>
                          <div>{channel.node2.slice(-8)}</div>
                        </Link>
                      </Tooltip>
                      <button type="button" data-copy-text={channel.node2}>
                        <CopyIcon />
                      </button>
                    </dd>
                  </dl>
                  <dl>
                    <dt>Fee Rate</dt>
                    <dd>{`${localeNumberString(channel.feeRateOfNode2)} shannon/kB`}</dd>
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
