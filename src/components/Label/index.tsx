import React from 'react'
import styled from 'styled-components'
import HelpIcon from '../../assets/qa_help.png'

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

  .label__value {
    color: rgb(136, 136, 136);
    font-size: 16px;
  }

  .label__status {
    color: rgb(136, 136, 136);
    font-size: 16px;
    margin-left: 10px;
  }

  .label__help {
    width: 18px;
    height: 18px;
    margin-left: 10px;
  }

  @media (max-width: 700px) {
    height: 24px;
    line-height: 24px;
    margin-bottom: 10px;

    .label__icon {
      display: none;
    }

    label__name {
      font-size: 16px;
      margin-right: 10px;
    }

    .label__value {
      font-size: 15px;
    }

    .label__status {
      color: rgb(136, 136, 136);
      font-size: 13px;
      margin-left: 10px;
    }

    .label__help {
      width: 14px;
      height: 14px;
      margin-left: 10px;
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

    .label__value {
      font-size: 13px;
    }

    .label__status {
      color: rgb(136, 136, 136);
      font-size: 13px;
      margin-left: 10px;
    }

    .label__help {
      width: 14px;
      height: 14px;
      margin-left: 10px;
    }
  }
`

export interface Tooltip {
  status: string
  tip: string
  hideValue?: boolean
}

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
  tooltip,
}: {
  image: string
  label: string
  value: any
  highLight?: boolean
  tooltip?: Tooltip
}) => {
  return (
    <LabelPanel>
      <img className="label__icon" src={image} alt={value} />
      <span className="label__name">{label}</span>
      {(!tooltip || (tooltip && !tooltip.hideValue)) && (
        <div className="label__value" style={highLight ? highLightStyle : noneStyle}>
          {value}
        </div>
      )}
      {tooltip && tooltip.status && <span className="label__status">{tooltip.status}</span>}
      {tooltip && tooltip.tip && <img className="label__help" src={HelpIcon} alt="label help" />}
    </LabelPanel>
  )
}

export default SimpleLabel
