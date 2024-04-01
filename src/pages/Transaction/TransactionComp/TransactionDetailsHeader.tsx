/* eslint-disable react/no-array-index-key */
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio } from 'antd'
import { LayoutLiteProfessional } from '../../../constants/common'
import { Card } from '../../../components/Card'
import { useIsMobile, useUpdateSearchParams } from '../../../hooks'
import styles from './TransactionDetailsHeader.module.scss'

export const TransactionDetailsHeader: FC<{
  layout: LayoutLiteProfessional
}> = ({ layout }) => {
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
      <Radio.Group
        className={styles.layoutButtons}
        options={[
          { label: t('transaction.professional'), value: LayoutLiteProfessional.Professional },
          { label: t('transaction.lite'), value: LayoutLiteProfessional.Lite },
        ]}
        onChange={({ target: { value } }) => onChangeLayout(value)}
        value={layout}
        optionType="button"
        buttonStyle="solid"
      />
    </div>
  )

  return (
    <Card className={styles.transactionHeader}>
      <div className={styles.headerContent}>
        <p>{t('transaction.transaction_details')}</p>
        {!isMobile && professionalLiteBox}
      </div>
      {isMobile && professionalLiteBox}
    </Card>
  )
}
