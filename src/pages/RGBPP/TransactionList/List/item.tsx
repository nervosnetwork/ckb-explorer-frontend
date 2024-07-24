import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import AddressText from '../../../../components/AddressText'
import { Link } from '../../../../components/Link'
import { useStatistics } from '../../../../services/ExplorerService'
import { localeNumberString } from '../../../../utils/number'
import { dayjs } from '../../../../utils/date'
import { ReactComponent as ShareIcon } from './share_icon.svg'
import config from '../../../../config'
import { TransactionLeapDirection } from '../../../../components/RGBPP/types'
import styles from './styles.module.scss'
import { getBtcChainIdentify } from '../../../../services/BTCIdentifier'
import { IS_MAINNET } from '../../../../constants/common'
import { HelpTip } from '../../../../components/HelpTip'

export type Transaction = {
  ckbTxId: string
  blockNumber: number
  time: number
  type: TransactionLeapDirection
  cellChange: number
  btcTxId: string
}

const Item = ({ item }: { item: Transaction }) => {
  const [t] = useTranslation()
  const statistics = useStatistics()
  const tipBlockNumber = parseInt(statistics?.tipBlockNumber ?? '0', 10)

  const { data: identity } = useQuery({
    queryKey: ['btc-testnet-identity', item.btcTxId],
    queryFn: () => (item.btcTxId ? getBtcChainIdentify(item.btcTxId) : null),
    enabled: !IS_MAINNET && !!item.btcTxId,
  })

  const btcExplorerUrl = `${config.BITCOIN_EXPLORER}${IS_MAINNET ? '' : `/${identity}`}`

  return (
    <tr key={item.ckbTxId}>
      <td className={styles.hash} title={t('rgbpp.transaction.ckb_tx')}>
        <div className={styles.transactionHash}>
          <AddressText
            disableTooltip
            linkProps={{
              to: `/transaction/${item.ckbTxId}`,
            }}
          >
            {item.ckbTxId}
          </AddressText>
        </div>
      </td>
      <td className={styles.height} title={t('rgbpp.transaction.block_number')}>
        <Link className={styles.blockLink} to={`/block/${item.blockNumber}`}>
          {localeNumberString(item.blockNumber)}
        </Link>
      </td>
      <td className={styles.confirmation} title={t('rgbpp.transaction.confirmation')}>
        {localeNumberString(tipBlockNumber - item.blockNumber)}{' '}
        {tipBlockNumber - item.blockNumber === 1
          ? t('rgbpp.transaction.confirmation')
          : t('rgbpp.transaction.confirmations')}
      </td>
      <td className={styles.time} title={t('rgbpp.transaction.time')}>
        {dayjs(item.time).fromNow()}
      </td>
      <td title={t('rgbpp.transaction.type')}>
        {item.type === TransactionLeapDirection.NONE ? (
          <div className={styles.type}>
            <span>{t('rgbpp.transaction.direction.other')}</span>
            <HelpTip title={t('rgbpp.transaction.direction.description.other')} />
          </div>
        ) : (
          t(`address.leap_${item.type}`)
        )}
      </td>
      <td className={styles.cellChange} title={t('rgbpp.transaction.rgbpp_cell_change')}>
        {`${item.cellChange > 0 ? '+' : ''}${item.cellChange}`}{' '}
        {Math.abs(item.cellChange) === 1 ? t('rgbpp.transaction.cell') : t('rgbpp.transaction.cells')}
      </td>
      <td className={styles.hash} title={t('rgbpp.transaction.btc_txid')}>
        {item.btcTxId ? (
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}
            title={t('rgbpp.transaction.view_on_bitcoin_explorer')}
          >
            <AddressText
              style={{ marginLeft: 'auto' }}
              disableTooltip
              linkProps={{
                to: `${btcExplorerUrl}/tx/${item.btcTxId}`,
              }}
            >
              {item.btcTxId}
            </AddressText>
            <a
              href={`${btcExplorerUrl}/tx/${item.btcTxId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <ShareIcon />
            </a>
          </div>
        ) : (
          '/'
        )}
      </td>
    </tr>
  )
}

export default Item
