import React from 'react'
import styled from 'styled-components'
import TooltipImage from '../../assets/tooltip_background.png'
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

  .label__status:hover .label__tip__content {
    visibility: visible;
  }

  .label__tip__content {
    width: 300px;
    height: 112px;
    position: absolute;
    margin-left: -170px;
    padding: 28px 20px 17px 20px;
    z-index: 1;
    color: white;
    font-weight: 450;
    visibility: hidden;
    font-size: 13px;
    background-image: url(${TooltipImage});
    background-repeat: no-repeat;
    background-size: 300px 112px;
  }

  @media (max-width: 700px) {
    .label__status {
      font-size: 13px;
    }

    .label__status:hover .label__tip__content {
      visibility: hidden;
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

  &:hover .label__help__content {
    visibility: visible;
  }

  .label__help__content {
    width: 300px;
    height: 120px;
    position: absolute;
    margin-left: -190px;
    padding: 20px 20px 17px 20px;
    z-index: 1;
    color: white;
    font-weight: 450;
    visibility: hidden;
    font-size: 13px;
    background-image: url(${TooltipImage});
    background-repeat: no-repeat;
    background-size: 300px 112px;
  }

  @media (max-width: 700px) {
    .label__help__image {
      width: 14px;
      height: 14px;
    }

    &:hover .label__help__content {
      visibility: hidden;
    }

    .label__help__content {
      display: none;
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
      <LabelValuePanel style={highLight ? highLightStyle : noneStyle} tooltip={tooltip}>
        {value}
      </LabelValuePanel>
      {tooltip && tooltip.status && (
        <LableTipPanel>
          <div className="label__status">
            {tooltip.status}
            <div className="label__tip__content">{tooltip.tip}</div>
          </div>
        </LableTipPanel>
      )}
      {tooltip && tooltip.haveHelpIcon && (
        <LableHelpPanel>
          <img className="label__help__image" alt="label help" src={HelpIcon} />
          <div className="label__help__content">{tooltip.tip}</div>
        </LableHelpPanel>
      )}
    </LabelPanel>
  )
}

export default SimpleLabel
