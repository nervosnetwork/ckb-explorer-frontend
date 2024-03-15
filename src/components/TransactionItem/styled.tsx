import styled from 'styled-components'
import { CircleCorner } from '.'
import variables from '../../styles/variables.module.scss'

export const TransactionPanel = styled.div`
  width: 100%;
  margin-top: 4px;
  border-radius: ${(props: { circleCorner: CircleCorner }) =>
    `${props.circleCorner.top ? '6px 6px' : '0 0'}${props.circleCorner.bottom ? ' 6px 6px' : ' 0 0'}`};
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #fff;
  padding: 10px 40px 15px;
  display: flex;
  flex-direction: column;
  font-size: 16px;

  @media (max-width: ${variables.mobileBreakPoint}) {
    padding: 15px 20px;
    font-size: 13px;
  }
`

export const TransactionHashBlockPanel = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  .transactionItemContent {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      flex-direction: column;
      justify-content: normal;
      margin-bottom: 10px;
    }

    .transactionItemHash {
      font-size: 14px;
      color: ${props => props.theme.primary};
      font-weight: 500;
    }

    .transactionItemBlock {
      color: #000;

      @media (max-width: ${variables.mobileBreakPoint}) {
        font-weight: normal;
      }
    }
  }

  &::after {
    content: '';
    background: #e2e2e2;
    height: 1px;
    width: 100%;
    display: block;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

export const TransactionCellPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: ${variables.extraLargeBreakPoint}) {
    flex-direction: column;
    align-items: center;
  }

  > img {
    margin-top: 16px;
    width: 16px;
    height: 16px;
  }

  .transactionItemInput {
    margin-right: 40px;
    flex: 1;
    min-width: 0;

    @media (max-width: ${variables.extraLargeBreakPoint}) {
      margin: 0;
      flex: none;
      width: 100%;
    }
  }

  .transactionItemOutput {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 40px;

    @media (max-width: ${variables.extraLargeBreakPoint}) {
      margin: 0;
      flex: none;
      width: 100%;
    }
  }

  .transactionItemOutputEmpty {
    font-size: 16px;
    color: #666;
    margin-top: 18px;

    @media (max-width: ${variables.mobileBreakPoint}) {
      font-size: 13px;
    }
  }
`

export const FullPanel = styled.div`
  width: 100%;
`

export const RGBPlusPlus = styled.div`
  color: rgb(51 51 51 / 100%);
  display: flex;
  border-radius: 4px;
  font-size: 12px;
  line-height: 14px;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 22px;
  background: linear-gradient(90.24deg, #ffd176 0.23%, #ffdb81 6.7%, #84ffcb 99.82%);
  vertical-align: middle;
`
