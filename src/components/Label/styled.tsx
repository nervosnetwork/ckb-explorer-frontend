import styled from 'styled-components'
import { Tooltip } from './index'

export const LabelPanel = styled.div`
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

export const LabelValuePanel = styled.div`
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

export const LableTipPanel = styled.div`
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

export const LableHelpPanel = styled.div`
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
