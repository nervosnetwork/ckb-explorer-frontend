import React, { useState } from 'react'
import HelpIcon from '../../assets/qa_help.png'
import Tooltip, { TargetSize } from '../Tooltip'
import { LabelPanel, LabelValuePanel, LableTipPanel, LableHelpPanel } from './styled'

export interface Tooltip {
  status?: string
  tip: string
  hideValue?: boolean
  haveHelpIcon?: boolean
  offset?: number
}

const highLightStyle = {
  color: '#4BBC8E',
  fontWeight: 450,
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
}

const noneStyle = {
  color: '#888888',
}

const statusTargetSize: TargetSize = {
  width: 60,
  height: 30,
}

const helpTargetSize: TargetSize = {
  width: 20,
  height: 36,
}

const SimpleLabel = ({
  image,
  label,
  value,
  highLight,
  tooltip,
}: {
  image: string
  label: string
  value: any
  highLight?: boolean
  tooltip?: Tooltip
}) => {
  const [showStatusTip, setShowStatusTip] = useState(false)
  const [showHelpTip, setShowHelpTip] = useState(false)
  if (tooltip && tooltip.offset) {
    helpTargetSize.offset = tooltip.offset
  }
  return (
    <LabelPanel>
      <img className="label__icon" src={image} alt={value} />
      <span className="label__name">{label}</span>
      <LabelValuePanel style={highLight ? highLightStyle : noneStyle} tooltip={tooltip}>
        {value}
      </LabelValuePanel>
      {tooltip && tooltip.status && (
        <LableTipPanel>
          <div
            className="label__status"
            tabIndex={-1}
            onFocus={() => {}}
            onMouseOver={() => {
              setShowStatusTip(true)
              const p = document.querySelector('.page') as HTMLElement
              if (p) {
                p.setAttribute('tabindex', '-1')
              }
            }}
            onMouseLeave={() => {
              setShowStatusTip(false)
              const p = document.querySelector('.page') as HTMLElement
              if (p) {
                p.removeAttribute('tabindex')
              }
            }}
          >
            {tooltip.status}
            <Tooltip show={showStatusTip} targetSize={statusTargetSize} message={tooltip.tip} />
          </div>
        </LableTipPanel>
      )}
      {tooltip && tooltip.haveHelpIcon && (
        <LableHelpPanel
          tabIndex={-1}
          onFocus={() => {}}
          onMouseOver={() => {
            setShowHelpTip(true)
            const p = document.querySelector('.page') as HTMLElement
            if (p) {
              p.setAttribute('tabindex', '-1')
            }
          }}
          onMouseLeave={() => {
            setShowHelpTip(false)
            const p = document.querySelector('.page') as HTMLElement
            if (p) {
              p.removeAttribute('tabindex')
            }
          }}
        >
          <img className="label__help__image" alt="label help" src={HelpIcon} />
          <Tooltip show={showHelpTip} targetSize={helpTargetSize} message={tooltip.tip} />
        </LableHelpPanel>
      )}
    </LabelPanel>
  )
}

export default SimpleLabel
