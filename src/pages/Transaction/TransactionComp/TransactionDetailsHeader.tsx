/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { LayoutLiteProfessional } from '../../../constants/common'
import { Card } from '../../../components/Card'
import { useIsMobile, useUpdateSearchParams } from '../../../hooks'
import styles from './TransactionDetailsHeader.module.scss'

export const TransactionDetailsHeader: FC<{
  layout: LayoutLiteProfessional
  showLayoutSwitcher?: boolean
}> = ({ showLayoutSwitcher = true, layout }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const defaultLayout = LayoutLiteProfessional.Professional
  const updateSearchParams = useUpdateSearchParams<'layout'>()
  const onChangeLayout = (layoutType: LayoutLiteProfessional) => {
    updateSearchParams(params =>
      layoutType === defaultLayout
        ? Object.fromEntries(Object.entries(params).filter(entry => entry[0] !== 'layout'))
        : { ...params, layout: layoutType },
    )
  }

  const professionalLiteBox = (
    <div className={styles.professionalLiteBox}>
      <button
        type="button"
        className={classNames(styles.button, layout === LayoutLiteProfessional.Professional ? styles.selected : '')}
        onClick={() => onChangeLayout(LayoutLiteProfessional.Professional)}
      >
        {t('transaction.professional')}
      </button>
      <button
        className={classNames(styles.button, layout === LayoutLiteProfessional.Lite ? styles.selected : '')}
        type="button"
        onClick={() => onChangeLayout(LayoutLiteProfessional.Lite)}
      >
        {t('transaction.lite')}
      </button>
    </div>
  )

  return (
    <Card className={styles.transactionHeader}>
      <div className={styles.headerContent}>
        <p>{t('transaction.transaction_details')}</p>
        {!isMobile && showLayoutSwitcher && professionalLiteBox}
      </div>
      {isMobile && showLayoutSwitcher && professionalLiteBox}
    </Card>
  )
}
