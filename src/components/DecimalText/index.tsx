import React from 'react'
import styled from 'styled-components'

export interface DecimalParams {
  integerFontSize?: string
  integerColor?: string
  decimalFontSize?: string
  decimalColor?: string
}

const DecimalPanel = styled.div`
  display: inner-block;
`

export default ({ value, decimalParams }: { value: string; decimalParams?: DecimalParams }) => {
  const integer = value.split('.')[0] || ''
  let decimal = value.split('.')[1] || ''
  decimal = decimal.length > 0 ? `.${decimal}` : ''
  return (
    <DecimalPanel>
      <span
        style={{
          fontSize: decimalParams ? decimalParams.integerFontSize : 'inherit',
          color: decimalParams ? decimalParams.integerColor : 'inherit',
        }}
      >
        {integer}
      </span>
      <span
        style={{
          fontSize: decimalParams ? decimalParams.decimalFontSize : 'inherit',
          color: decimalParams ? decimalParams.decimalColor : 'inherit',
        }}
      >
        {decimal}
      </span>
    </DecimalPanel>
  )
}
