import React from 'react'
import styled from 'styled-components'
import i18n from '../../utils/i18n'

const DecimalPanel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;

  .decimal__zeros {
    margin-bottom: 1px;
  }

  .decimal__unit {
    margin-left: 5px;

    @media (max-width: 700px) {
      margin-bottom: 0px;
    }
  }
`

const DecimalPartPanel = styled.div`
  margin-bottom: 1px;
  font-size: ${(props: { fontSize?: string; color?: string }) => (props.fontSize ? props.fontSize : '12px')}
  color: ${(props: { fontSize?: string; color?: string }) => (props.color ? props.color : '#999999')}

  @media (max-width: 1000px) {
    font-size: ${(props: { fontSize?: string; color?: string }) => (props.fontSize ? props.fontSize : '11px')}
  }

  @media (max-width: 700px) {
    margin-bottom: 0px;
  }
`

const DecimalZerosPanel = styled.div`
  margin-bottom: 1px;
  font-size: ${(props: { fontSize?: string; color?: string }) => (props.fontSize ? props.fontSize : '12px')}
  color: ${(props: { fontSize?: string; color?: string }) => (props.color ? props.color : '#999999')}

  @media (max-width: 1000px) {
    font-size: ${(props: { fontSize?: string; color?: string }) => (props.fontSize ? props.fontSize : '11px')}
  }

  @media (max-width: 700px) {
    margin-bottom: 0px;
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
      <DecimalPartPanel fontSize={fontSize} color={color}>
        {decimal}
      </DecimalPartPanel>
      <DecimalZerosPanel fontSize={fontSize} color={color}>
        {zeros}
      </DecimalZerosPanel>
      {!hideUnit && <div className="decimal__unit">{i18n.t('common.ckb_unit')}</div>}
    </DecimalPanel>
  )
}
