import { HomeIcon, GlobeIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import type { Fiber } from '../../services/ExplorerService'
import { TIME_TEMPLATE } from '../../constants/common'
import { parseNumericAbbr } from '../../utils/chart'
import { formalizeChannelAsset } from '../../utils/fiber'
import { localeNumberString } from '../../utils/number'
import { ReactComponent as CopyIcon } from '../Copy/icon.svg'
import styles from './index.module.scss'
import Tooltip from '../Tooltip'

const GraphChannelList: FC<{ list: Fiber.Graph.Channel[]; node?: string; startIndex?: number }> = ({
  list,
  node,
  startIndex = 0,
}) => {
  if (!list.length) {
    return <div className={styles.container}>No Channels</div>
  }

  return (
    <div className={styles.container}>
      {list.map((ch, i) => {
        const { totalLiquidity, funding } = formalizeChannelAsset(ch)

        const outPoint = {
          txHash: ch.channelOutpoint.slice(0, -8),
          index: parseInt(ch.channelOutpoint.slice(-8), 16),
        }

        const outpoint = `${outPoint.txHash}#${outPoint.index}`

        return (
          <div key={ch.channelOutpoint} className={styles.channel}>
            <h1>Channel #{i + 1 + startIndex}</h1>
            <dl className={styles.outPoint}>
              <dt>Out Point</dt>
              <dd>
                <Tooltip
                  trigger={
                    <Link to={`/transaction/${outPoint.txHash}#${outPoint.index}`}>
                      <div>{outpoint.slice(0, -15)}</div>
                      <div>{outpoint.slice(-15)}</div>
                    </Link>
                  }
                >
                  {`${outPoint.txHash}#${outPoint.index}`}
                </Tooltip>
                <button type="button" data-copy-text={outPoint.txHash} className={styles.copy}>
                  <CopyIcon />
                </button>
              </dd>
            </dl>

            <dl className={styles.amount}>
              <dt>Liquidity</dt>
              <dd>
                <span>{`${parseNumericAbbr(totalLiquidity)} ${funding.symbol}`}</span>
              </dd>
            </dl>

            <dl className={styles.funding}>
              <dt>Source</dt>
              <dd>
                <Tooltip trigger={<span>{`${parseNumericAbbr(funding.amount)} ${funding.symbol}`}</span>}>
                  {`${localeNumberString(funding.value)} ${funding.symbol}`}
                </Tooltip>
                from
                <Tooltip
                  trigger={
                    <Link to={`/address/${ch.openTransactionInfo.address}`} className={styles.address}>
                      <div>{ch.openTransactionInfo.address.slice(0, -15)}</div>
                      <div>{ch.openTransactionInfo.address.slice(-15)}</div>
                    </Link>
                  }
                >
                  {ch.openTransactionInfo.address}
                </Tooltip>
              </dd>
            </dl>
            <dl>
              <dt>Position</dt>
              <dd>
                On
                <Tooltip
                  trigger={
                    <Link to={`/block/${ch.openTransactionInfo.blockNumber}`}>
                      {localeNumberString(ch.openTransactionInfo.blockNumber)}
                    </Link>
                  }
                >
                  {dayjs(+ch.createdTimestamp).format(TIME_TEMPLATE)}
                </Tooltip>
              </dd>
            </dl>

            <div className={styles.nodesContainer}>
              <h1>Nodes</h1>
              <div className={styles.nodes}>
                <div className={styles.node}>
                  <h3>
                    {node ? <span>{node === ch.node1 ? <HomeIcon /> : <GlobeIcon />}</span> : null}
                    First Node
                  </h3>
                  <dl>
                    <dt>ID</dt>
                    <dd>
                      <Tooltip
                        trigger={
                          <Link to={`/fiber/graph/node/${ch.node1}`} className="monospace">
                            <div>{`0x${ch.node1.slice(0, -8)}`}</div>
                            <div>{ch.node1.slice(-8)}</div>
                          </Link>
                        }
                      >
                        {ch.node1}
                      </Tooltip>
                      <button type="button" data-copy-text={ch.node1} className={styles.copy}>
                        <CopyIcon />
                      </button>
                    </dd>
                  </dl>
                  <dl>
                    <dt>Fee Rate</dt>
                    <dd>{`${localeNumberString(ch.feeRateOfNode1)} shannon/kB`}</dd>
                  </dl>
                </div>
                <div className={styles.node}>
                  <h3>
                    {node ? <span>{node === ch.node2 ? <HomeIcon /> : <GlobeIcon />}</span> : null}
                    Second Node
                  </h3>
                  <dl>
                    <dt>ID</dt>
                    <dd>
                      <Tooltip
                        trigger={
                          <Link to={`/fiber/graph/node/${ch.node2}`}>
                            <div>{`0x${ch.node2.slice(0, -8)}`}</div>
                            <div>{ch.node2.slice(-8)}</div>
                          </Link>
                        }
                      >
                        {ch.node2}
                      </Tooltip>
                      <button type="button" data-copy-text={ch.node2} className={styles.copy}>
                        <CopyIcon />
                      </button>
                    </dd>
                  </dl>
                  <dl>
                    <dt>Fee Rate</dt>
                    <dd>{`${localeNumberString(ch.feeRateOfNode2)} shannon/kB`}</dd>
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
