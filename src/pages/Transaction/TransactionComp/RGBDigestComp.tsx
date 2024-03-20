/* eslint-disable react/no-array-index-key */
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/Card'
import styles from './TransactionDetailsHeader.module.scss'
import { TransactionRGBPPDigestContent } from '../../../components/TransactionItem/TransactionRGBPPDigestModal/TransactionRGBPPDigestContent'
import { TransactionLeapDirection } from '../../../components/TransactionItem/TransactionRGBPPDigestModal/types'

export const RGBDigestComp = ({ hash, leapDirection }: { hash: string; leapDirection: TransactionLeapDirection }) => {
  const { t } = useTranslation()
  return (
    <>
      <Card className={styles.transactionHeader}>
        <div className={styles.headerContent}>
          <p>{t('transaction.rgb_digest')} </p>
        </div>
      </Card>
      <Card className={styles.digestContent}>
        <TransactionRGBPPDigestContent hash={hash} leapDirection={leapDirection} />
      </Card>
    </>
  )
}
