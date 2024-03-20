/* eslint-disable react/no-array-index-key */
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/Card'
import styles from './TransactionDetailsHeader.module.scss'
import { TransactionRGBPPDigestContent } from '../../../components/TransactionItem/TransactionRGBPPDigestModal/TransactionRGBPPDigestContent'
import { RGBDigest } from '../../../services/ExplorerService'
import { TransactionLeapDirection } from '../../../components/TransactionItem/TransactionRGBPPDigestModal/types'

export const RGBDigestComp = ({ tx, leapDirection }: { tx: RGBDigest; leapDirection: TransactionLeapDirection }) => {
  const { t } = useTranslation()
  return (
    <>
      <Card className={styles.transactionHeader}>
        <div className={styles.headerContent}>
          <p>{t('transaction.rgb_digest')} </p>
        </div>
      </Card>
      <Card className={styles.digestContent}>
        <TransactionRGBPPDigestContent tx={tx} leapDirection={leapDirection} />
      </Card>
    </>
  )
}
