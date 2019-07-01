import React, { useState } from 'react'
import styled from 'styled-components'
import HelpIcon from '../../assets/qa_help.png'
import Tooltip, { TargetSize } from '../Tooltip'

const LabelPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;
  margin-bottom: 24px;

  .label__icon {
    width: 20px;
    height: 20px;
  }

  .label__name {
    font-size: 18px;
    color: rgb(77, 77, 77);
    margin-left: 10px;
    margin-right: 21px;
    font-weight: 450;
  }

  @media (max-width: 700px) {
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;

    .label__icon {
      display: none;
    }

    .label__name {
      font-size: 16px;
      margin-right: 10px;
    }
  }

  @media (max-width: 320px) {
    height: 20px;
    line-height: 20px;
    margin-bottom: 8px;

    .label__icon {
      display: none;
    }

    .label__name {
      font-size: 14px;
      margin-right: 10px;
    }
  }
`

const LabelValuePanel = styled.div`
  color: rgb(136, 136, 136);
  font-size: 16px;
  margin-right: 10px;
  display: ${(props: { tooltip: Tooltip | undefined }) =>
    props.tooltip && props.tooltip.hideValue ? 'none' : 'inline'};

  @media (max-width: 700px) {
    font-size: 15px;
    display: ${(props: { tooltip: Tooltip | undefined }) =>
      props.tooltip && props.tooltip.status ? 'none' : 'inline'};
  }

  @media (max-width: 320px) {
    font-size: 12px;
    display: ${(props: { tooltip: Tooltip | undefined }) =>
      props.tooltip && props.tooltip.status ? 'none' : 'inline'};
  }
`

const LableTipPanel = styled.div`
  height: 25px;
  position: relative;
  display: flex;

  .label__status {
    color: #ff7070;
    font-size: 16px;
    height: 18px;
    font-weight: 450;
  }

  @media (max-width: 700px) {
    .label__status {
      font-size: 13px;
    }
  }
`

const LableHelpPanel = styled.div`
  height: 25px;
  position: relative;

  .label__help__image {
    margin-top: 4px;
    width: 18px;
    height: 18px;
  }

  @media (max-width: 700px) {
    .label__help__image {
      margin-top: 6px;
      width: 14px;
      height: 14px;
    }
  }
`

export interface Tooltip {
  status?: string
  tip: string
  hideValue?: boolean
  haveHelpIcon?: boolean
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
            onMouseOver={() => setShowStatusTip(true)}
            onMouseLeave={() => setShowStatusTip(false)}
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
          onMouseOver={() => setShowHelpTip(true)}
          onMouseLeave={() => setShowHelpTip(false)}
        >
          <img className="label__help__image" alt="label help" src={HelpIcon} />
          <Tooltip show={showHelpTip} targetSize={helpTargetSize} message={tooltip.tip} />
        </LableHelpPanel>
      )}
    </LabelPanel>
  )
}

export default SimpleLabel
