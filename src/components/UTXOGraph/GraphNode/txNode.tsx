import classNames from 'classnames'
import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import EllipsisMiddle from '../../EllipsisMiddle'
import { explorerService } from '../../../services/ExplorerService'
import { ReactComponent as MoreIcon } from '../../../assets/more.svg'
import { parseSimpleDate } from '../../../utils/date'
import { Link } from '../../Link'
import CopyTooltipText from '../../Text/CopyTooltipText'
import styles from '../styles.module.scss'
import Tooltip from '../../Tooltip'
import Popover from '../../Popover'

const TxNode = ({ txHash }: { txHash: string }) => {
  const query = useQuery(['transaction', txHash], async () => {
    const transaction = await explorerService.api.fetchTransactionByHash(txHash)
    return transaction
  })
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const blockNumberFormat = query.data?.blockNumber !== undefined ? (+query.data.blockNumber).toLocaleString('en') : ''
  return (
    <div className={styles.txNodeContainer} ref={ref}>
      <div className={classNames(styles.txHash, 'monospace')}>
        {t('utxo_graph.tx_hash')}:
        <Tooltip trigger={<EllipsisMiddle text={txHash} />}>
          <CopyTooltipText content={txHash} />
        </Tooltip>
        <Popover
          portalContainer={ref.current}
          trigger={
            <button type="button" className={styles.more} onClick={e => e.stopPropagation()}>
              <MoreIcon />
            </button>
          }
        >
          {[
            {
              label: query.data?.blockNumber ? (
                <Link to={`/block/${query.data.blockNumber}`} target="_blank">
                  {`${t('block.block')}: ${blockNumberFormat}`}
                </Link>
              ) : null,
              key: 'block',
            },
            {
              label: (
                <Link to={`/transaction/${txHash}`} target="_blank">
                  {`${t('utxo_graph.view_tx')}`}
                </Link>
              ),
              key: 'tx',
            },
          ].map(item => {
            return <div key={item.key}>{item.label}</div>
          })}
        </Popover>
      </div>
      <p>
        {t('block.block')} {blockNumberFormat}
      </p>
      <p>{query.data ? parseSimpleDate(query.data?.blockTimestamp) : null}</p>
    </div>
  )
}

export default TxNode
