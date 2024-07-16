import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { Dropdown, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import EllipsisMiddle from '../../EllipsisMiddle'
import { explorerService } from '../../../services/ExplorerService'
import { ReactComponent as MoreIcon } from '../../../assets/more.svg'
import { parseSimpleDate } from '../../../utils/date'
import { Link } from '../../Link'
import CopyTooltipText from '../../Text/CopyTooltipText'
import styles from '../styles.module.scss'

const TxNode = ({ txHash, modalRef }: { txHash: string; modalRef?: HTMLDivElement | null }) => {
  const query = useQuery(['transaction', txHash], async () => {
    const transaction = await explorerService.api.fetchTransactionByHash(txHash)
    return transaction
  })
  const { t } = useTranslation()
  const blockNumberFormat = query.data?.blockNumber !== undefined ? (+query.data.blockNumber).toLocaleString('en') : ''
  return (
    <div className={styles.txNodeContainer}>
      <div className={classNames(styles.txHash, 'monospace')}>
        {t('utxo_graph.tx_hash')}:
        <Tooltip
          trigger="hover"
          placement="top"
          title={<CopyTooltipText content={txHash} />}
          getPopupContainer={() => modalRef ?? document.body}
        >
          <EllipsisMiddle text={txHash} />
        </Tooltip>
        <Dropdown
          menu={{
            items: [
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
            ],
            onClick(e) {
              e.domEvent.stopPropagation()
            },
          }}
          trigger={['click']}
          getPopupContainer={() => modalRef ?? document.body}
        >
          <button type="button" className={styles.more} onClick={e => e.stopPropagation()}>
            <MoreIcon />
          </button>
        </Dropdown>
      </div>
      <p>
        {t('block.block')} {blockNumberFormat}
      </p>
      <p>{query.data ? parseSimpleDate(query.data?.blockTimestamp) : null}</p>
    </div>
  )
}

export default TxNode
