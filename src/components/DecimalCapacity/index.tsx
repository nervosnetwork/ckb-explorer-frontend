import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'

const DecimalPanel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  .decimal__zeros {
    color: rgb(0, 0, 0, 0);
  }

  .decimal__unit {
    margin-left: 5px;
  }
`

export default ({
  value,
  fontSize,
  color,
  hideUnit,
}: {
  value: string
  fontSize?: string
  color?: string
  hideUnit?: boolean
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
    <DecimalPanel>
      <span>{integer}</span>
      <span
        style={{
          fontSize: fontSize || '11px',
          color: color || '#999999',
        }}
      >
        {decimal}
      </span>
      <span
        className="decimal__zeros"
        style={{
          fontSize: fontSize || '11px',
        }}
      >
        {zeros}
      </span>
      {!hideUnit && <span className="decimal__unit">{i18n.t('common.ckb_unit')}</span>}
    </DecimalPanel>
  )
}
