import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'

const DecimalPanel = styled.div`
  display: inner-block;

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
  let integer = value.split('.')[0] || '0'
  let decimal = value.split('.')[1] || ''
  let zeros = ''

  if (decimal.length < 8) {
    zeros = '0'.repeat(8 - decimal.length)
  }
  decimal = integer.length > 0 && decimal.length > 0 ? `.${decimal}` : ''

  if (value === '0') {
    integer = '0'
    decimal = ''
    zeros = `.${'0'.repeat(8)}`
  }

  return (
    <DecimalPanel>
      <span>{integer}</span>
      <span
        style={{
          fontSize: fontSize || 'inherit',
          color,
        }}
      >
        {decimal}
      </span>
      <span
        className="decimal__zeros"
        style={{
          fontSize: fontSize || 'inherit',
        }}
      >
        {zeros}
      </span>
      {!hideUnit && (
        <span className="decimal__unit">{i18n.t('common.ckb_unit')}</span>
      )}
    </DecimalPanel>
  )
}
