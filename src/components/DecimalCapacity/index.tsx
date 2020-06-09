import React from 'react'
import i18n from '../../utils/i18n'
import { DecimalPanel, DecimalPartPanel, DecimalZerosPanel } from './styled'

export default ({
  value,
  fontSize,
  color,
  hideUnit,
  hideZero,
  marginBottom = '1px',
  isFlexStart = false,
}: {
  value: string
  fontSize?: string
  color?: string
  hideUnit?: boolean
  hideZero?: boolean
  marginBottom?: string
  isFlexStart?: boolean
}) => {
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
    <DecimalPanel isFlexStart={isFlexStart}>
      <span>{integer}</span>
      <DecimalPartPanel className="monospace" fontSize={fontSize} color={color} marginBottom={marginBottom}>
        {decimal}
      </DecimalPartPanel>
      {!hideZero && (
        <DecimalZerosPanel className="monospace" fontSize={fontSize} color={color} marginBottom={marginBottom}>
          {zeros}
        </DecimalZerosPanel>
      )}
      {!hideUnit && <div className="decimal__unit monospace">{i18n.t('common.ckb_unit')}</div>}
    </DecimalPanel>
  )
}
