import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { DecimalPanel, DecimalPartPanel, DecimalZerosPanel } from './styled'
import styles from './styles.module.scss'

export default ({
  value,
  fontSize,
  balanceChangeType = 'none',
  hideUnit,
  hideZero,
  marginBottom = '1px',
}: {
  value: string
  balanceChangeType?: 'payment' | 'income' | 'none'
  fontSize?: string
  hideUnit?: boolean
  hideZero?: boolean
  marginBottom?: string
}) => {
  const { t } = useTranslation()
  const integer = value.split('.')[0] || '0'
  const isPayment = balanceChangeType === 'payment'
  const balanceChangeTypeClass = isPayment ? 'subtraction' : 'addition'
  let decimal = value.split('.')[1] || ''
  let zeros = ''

  if (decimal.length < 8) {
    zeros = '0'.repeat(8 - decimal.length)
  }
  if (decimal.length === 0) {
    zeros = `.${'0'.repeat(8)}`
  } else if (decimal.length < 8) {
    zeros = '0'.repeat(8 - decimal.length)
  }
  decimal = decimal.length > 0 ? `.${decimal}` : ''

  return (
    <DecimalPanel>
      <span className={classNames(balanceChangeTypeClass, styles.intergerPart)}>{integer}</span>
      <DecimalPartPanel
        className={`monospace ${balanceChangeTypeClass}`}
        fontSize={fontSize}
        marginBottom={marginBottom}
      >
        {decimal}
      </DecimalPartPanel>
      {!hideZero && (
        <DecimalZerosPanel
          className={`monospace ${balanceChangeTypeClass}`}
          fontSize={fontSize}
          marginBottom={marginBottom}
        >
          {zeros}
        </DecimalZerosPanel>
      )}
      {!hideUnit && <div className={`decimalUnit monospace ${balanceChangeTypeClass}`}>{t('common.ckb_unit')}</div>}
    </DecimalPanel>
  )
}
