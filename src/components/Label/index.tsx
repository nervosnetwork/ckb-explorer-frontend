import React from 'react'
import { LabelPanel, LabelValuePanel } from './styled'

const highLightStyle = {
  color: '#4BBC8E',
  fontWeight: 450,
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
}

const noneStyle = {
  color: '#888888',
}

const SimpleLabel = ({
  image,
  label,
  value,
  highLight,
}: {
  image: string
  label: string
  value: any
  highLight?: boolean
}) => {
  return (
    <LabelPanel>
      <img className="label__icon" src={image} alt={value} />
      <span className="label__name">{label}</span>
      <LabelValuePanel style={highLight ? highLightStyle : noneStyle}>{value}</LabelValuePanel>
    </LabelPanel>
  )
}

export default SimpleLabel
