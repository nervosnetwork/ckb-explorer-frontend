import { useTranslation } from 'react-i18next'
import { DecimalPanel, DecimalPartPanel, DecimalZerosPanel } from './styled'

export default ({
  value,
  fontSize,
  color,
  hideUnit,
  hideZero,
  marginBottom = '1px',
}: {
  value: string
  fontSize?: string
  color?: string
  hideUnit?: boolean
  hideZero?: boolean
  marginBottom?: string
}) => {
  const { t } = useTranslation()
  const integer = value.split('.')[0] || '0'
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
      <span>{integer}</span>
      <DecimalPartPanel className="monospace" fontSize={fontSize} color={color} marginBottom={marginBottom}>
        {decimal}
      </DecimalPartPanel>
      {!hideZero && (
        <DecimalZerosPanel className="monospace" fontSize={fontSize} color={color} marginBottom={marginBottom}>
          {zeros}
        </DecimalZerosPanel>
      )}
      {!hideUnit && <div className="decimalUnit monospace">{t('common.ckb_unit')}</div>}
    </DecimalPanel>
  )
}
