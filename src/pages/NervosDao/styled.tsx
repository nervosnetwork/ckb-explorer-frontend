import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const DaoContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 40px;

  @media (max-width: 750px) {
    margin: 0px;
    padding: 20px;
  }

  .nervos_dao_title {
    width: 100%;
    border-radius: 6px;
    box-shadow: 2px 2px 6px 0 #dfdfdf;
    background-color: #ffffff;
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 40px;
    font-size: 30px;
    font-weight: 500;
    color: #000000;

    @media (max-width: 750px) {
      height: 50px;
      border-radius: 3px;
      box-shadow: 1px 1px 3px 0 #dfdfdf;
      font-size: 15px;
      padding-left: 20px;
    }
  }
`

export const DaoTabBarPanel = styled.div`
  width: 100%;
  height: 70px;
  background: white;
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  padding: 0 40px;
  font-size: 18px;

  @media (max-width: 1200px) {
    font-size: 16px;
  }

  @media (max-width: 750px) {
    height: ${(props: { containSearchBar: boolean }) => (props.containSearchBar ? '90px' : '60px')};
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
  }

  .nervos_dao_tab_bar {
    display: flex;
    height: 30px;
    cursor: pointer;
    margin-right: 15px;

    @media (max-width: 750px) {
      margin-bottom: ${(props: { containSearchBar: boolean }) => (props.containSearchBar ? '15px' : '0px')};
    }

    .div {
      font-size: 20px;

      @media (max-width: 750px) {
        font-size: 13px;
      }
    }

    div: nth-child(2) {
      margin-left: 50px;

      @media (max-width: 1200px) {
        margin-left: 30px;
      }
    }

    .tab_bar_normal {
      color: #000000;
      font-weight: normal;
    }

    .tab_bar_selected {
      color: ${props => props.theme.primary};
      font-weight: bold;
      border-bottom: 2px solid ${props => props.theme.primary};
    }
  }
`

export const TransactionsPagination = styled.div`
  margin: 20px 0px 0px 0px;
  width: 100%;

  @media (max-width: 750px) {
    margin: 10px 0px 0px 0px;
  }
`

export const DepositorRankPanel = styled.div`
  width: 100%;
  background: white;
  padding: 20px 40px;
`

export const DepositorRankCardPanel = styled.div`
  width: 100%;
`

export const DepositorRankTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: 600;
  height: 40px;

  > div {
    text-align: center;
  }

  >div: nth-child(1) {
    width: 10%;
  }
  >div: nth-child(2) {
    width: 48%;
  }
  >div: nth-child(3) {
    width: 22%;
  }
  >div: nth-child(4) {
    width: 20%;
  }
`

export const DepositorSeparate = styled.div`
  background: #e2e2e2;
  height: 1px;
  width: 100%;
  margin-bottom: 10px;
`

export const DepositorRankItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 40px;

  @media (max-width: 1000px) {
    font-size: 14px;
  }

  > div {
    text-align: center;
  }

  >div: nth-child(1) {
    width: 10%;
  }
  >div: nth-child(2) {
    width: 48%;
  }
  >div: nth-child(3) {
    width: 22%;
  }
  >div: nth-child(4) {
    width: 20%;
  }
`
export const AddressPanel = styled(props => <Link {...props} />)`
  color: ${props => props.theme.primary};
  width: 48%;
  text-align: center;

  @media (max-width: 750px) {
    width: 100%;
    text-align: start;
  }

  :hover {
    color: ${props => props.theme.primary};
  }
`

export const DaoOverviewPanel = styled.div`
  width: 100%;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  margin-top: 5px;
  padding: 16px 20px;
  background-color: #ffffff;
  display: flex;

  color: #000000;
  font-size: 16px;

  @media (max-width: 1000px) {
    font-size: 13px;
  }

  @media (max-width: 750px) {
    border-radius: 0px 0px 3px 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    padding: 5px 0 15px 0;

    font-size: 13px;
    flex-direction: column;
  }

  .dao__overview__separate {
    width: 1px;
    height: auto;
    background: #eaeaea;
    margin-left: 2%;

    @media (max-width: 750px) {
      width: 100%;
      height: 1px;
      background: #eaeaea;
      margin-left: 0;
    }
  }
`

export const DaoOverviewLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 54;

  @media (max-width: 750px) {
    margin: 0 16px;
  }

  > div {
    display: flex;
    justify-content: space-between;

    @media (max-width: 750px) {
      justify-content: space-around;
    }
  }

  .dao__overview__left_separate {
    width: 100%;
    height: 1px;
    background: #eaeaea;
  }

  .dao__overview__left_column_separate {
    width: 1px;
    height: auto;
    margin: 3% 0;
    background: #eaeaea;
  }
`

export const DaoOverviewRightPanel = styled.div`
  display: flex;
  flex-direction: row;
  flex: 44;

  @media (max-width: 750px) {
    margin: 5px 0;
  }

  .nervos__dao__overview_pie_chart {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 750px) {
      flex: 4;
    }

    .nervos__dao__overview_pie_title {
      font-size: 16px;
      font-weight: bold;

      @media (max-width: 1000px) {
        font-size: 12px;
      }

      @media (max-width: 750px) {
        font-size: 12px;
      }
    }
  }

  .nervos__dao__overview_pie_panel {
    display: flex;
    flex-direction: column;
    flex: 1;

    @media (max-width: 750px) {
      flex: 3;
    }
  }
`

export const DaoOverviewItemPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  flex: 1;

  &:hover {
    background: #f8f9fa;
  }

  .dao__overview__item_top {
    display: flex;
    flex-direction: row;
    align-items: center;

    .dao__overview__item_title {
      color: #5e5e5e;
      font-size: 11px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 140px;
      cursor: ${(props: { hasTitleTooltip?: boolean; hasChange?: boolean; symbol?: string }) =>
        props.hasTitleTooltip ? 'default' : 'none'};

      @media (max-width: 1000px) {
        font-size: 9px;
        max-width: ${(props: { hasChange?: boolean }) => (props.hasChange ? '60px' : '200px')};
      }

      @media (max-width: 750px) {
        font-size: 9px;
        max-width: ${(props: { hasChange?: boolean }) => (props.hasChange ? '70px' : '200px')};
      }
    }

    > img {
      width: ${(props: { symbol?: string }) => (props.symbol === 'zero' ? '10px' : '7px')};
      height: ${(props: { symbol?: string }) => (props.symbol === 'zero' ? '7px' : '10px')};
      margin-left: 5px;
      margin-right: 3px;
    }

    .dao__overview__item_change {
      font-size: 12px;
      font-weight: bold;
      color: ${(props: { symbol?: string; hasChange?: boolean; theme: any }) =>
        props.symbol === 'negative' ? '#FF464F' : props.theme.primary};
      cursor: default;

      @media (max-width: 1000px) {
        font-size: 10px;
      }

      @media (max-width: 750px) {
        font-size: 10px;
      }
    }
  }

  .dao__overview__item_content {
    color: #000000;
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;

    @media (max-width: 1000px) {
      font-size: 12px;
      margin-top: 5px;
    }

    @media (max-width: 750px) {
      font-size: 12px;
    }
  }
`

export const NervosDaoPieItemPanel = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  @media (max-width: 750px) {
    margin: 5px 0;
  }

  > img {
    width: 9px;
    height: 9px;
    margin-right: 10px;

    @media (max-width: 1000px) {
      width: 7px;
      height: 7px;
      margin-right: 5px;
    }
  }

  > div {
    > span {
      font-size: 12px;
      color: #5e5e5e;
      font-weight: bold;

      @media (max-width: 1000px) {
        font-size: 10px;
      }

      @media (max-width: 750px) {
        font-size: 10px;
      }
    }
    > div {
      font-size: 18px;
      color: #000000;

      @media (max-width: 1000px) {
        font-size: 12px;
      }

      @media (max-width: 750px) {
        font-size: 12px;
      }
    }
  }
`
