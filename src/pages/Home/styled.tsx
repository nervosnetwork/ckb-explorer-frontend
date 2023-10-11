import classNames from 'classnames'
import { FC, HTMLAttributes } from 'react'
import styled from 'styled-components'
import styles from './index.module.scss'

export const HomeHeaderItemPanel = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  flex: 1;

  .blockchainItemContent {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 30px;

    @media (max-width: 750px) {
      margin: 0 20px;
    }

    .blockchainItemName {
      color: #555;
      font-size: 14px;

      @media (max-width: 750px) {
        font-size: 12px;
      }
    }

    .blockchainItemValue {
      color: #000;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .blockchainItemLeftValue {
        font-size: 20px;

        @media (max-width: 750px) {
          font-size: 16px;
        }
      }

      .blockchainItemRightValue {
        font-size: 14px;

        @media (max-width: 750px) {
          font-size: 12px;
        }
      }
    }
  }

  .blockchainItemBetweenSeparate {
    height: 90%;
    background: #eaeaea;
    width: 1px;

    @media (max-width: 750px) {
      display: none;
    }
  }
`

export const HomeStatisticItemPanel = styled.div`
  @media (max-width: 750px) {
    flex: 1;
    margin-left: ${(props: { isFirst?: boolean }) => (props.isFirst ? '0px' : '40px')};
  }

  .homeStatisticItemName {
    font-size: 14px;
    color: #fff;

    @media (max-width: 1200px) {
      font-size: 12px;
    }
  }

  .homeStatisticItemValue {
    font-size: ${(props: { isFirst?: boolean }) => (props.isFirst ? '26px' : '20px')};
    color: #fff;
    font-weight: bold;

    @media (max-width: 1200px) {
      font-size: 18px;
    }
  }
`

export const HomeTablePanel = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 750px) {
    flex-direction: column;
  }
`

export const BlockPanel = styled.div`
  width: 100%;
  margin-bottom: 40px;
  margin-right: 20px;
  background: white;
  flex: 1;
  min-width: 0;
  border: 0 solid white;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgb(77 77 77 / 20%);

  .blockCardSeparate {
    background: #eaeaea;
    width: auto;
    margin: 0 16px;
    height: 1px;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

export const TransactionPanel = styled.div`
  width: 100%;
  margin-bottom: 40px;
  background: white;
  flex: 1;
  min-width: 0;
  border: 0 solid white;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgb(77 77 77 / 20%);

  .transactionCardSeparate {
    background: #eaeaea;
    width: auto;
    margin: 0 16px;
    height: 1px;
    transform: ${() => `scaleY(${Math.ceil((1.0 / window.devicePixelRatio) * 10.0) / 10.0})`};
  }
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: #141414;
  font-weight: bold;
  text-align: center;
  margin-bottom: 58px;

  &::after {
    content: '';
    display: block;
    background: ${props => props.theme.primary};
    height: 4px;
    width: 197px;
    margin: 0 auto;
  }

  @media (max-width: 750px) {
    font-size: 30px;
    color: #141414;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;

    &::after {
      content: '';
      display: block;
      background: ${props => props.theme.primary};
      height: 4px;
      width: 100px;
      margin: 0 auto;
    }
  }
`
export const ContentTable = styled.div`
  margin: 0 auto;
  width: 100%;
  z-index: 2;

  .blockGreenBackground {
    margin-left: -20px;
    height: 61px;
    width: calc(100% + 40px);
    background-color: ${props => props.theme.primary};
    z-index: 1;
  }
`

export const TableHeaderPanel = styled.div`
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${props => props.theme.primary};
  border: 0 solid #f9f9f9;
  border-radius: 6px 6px 0 0;

  > img {
    width: 20px;
    height: 20px;
    margin-left: 12px;
    margin-right: 8px;
  }

  > span {
    font-size: 16px;
    font-weight: 600;
    color: white;
  }
`

export const TableMorePanel: FC<HTMLAttributes<HTMLDivElement>> = props => {
  const { children, className, ...rest } = props
  return (
    <div className={classNames(styles.tableMorePanel, className)} {...rest}>
      {children}
    </div>
  )
}

export const HighLightValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 13px;
  height: 16px;

  a {
    color: ${props => props.theme.primary};
  }

  a:hover {
    color: ${props => props.theme.primary};
  }
`

export const BlockRewardContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: 750px) {
    align-items: flex-end;
    justify-content: flex-start;
  }

  ::after {
    display: inline;
    content: '+';
    color: #7f7d7d;
    font-size: 13px;
  }
`

export const BlockRewardPanel = styled.div`
  margin-right: 8px;
  display: flex;
  justify-content: center;
`
