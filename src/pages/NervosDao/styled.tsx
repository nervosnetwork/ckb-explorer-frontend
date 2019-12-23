import styled from 'styled-components'

export const DaoContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 100%;

  @media (max-width: 700px) {
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

    @media (max-width: 700px) {
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
  margin: 20px 0 5px 0;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  padding: 0 40px;
  font-size: 18px;

  @media (max-width: 700px) {
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

    @media (max-width: 700px) {
      margin-bottom: ${(props: { containSearchBar: boolean }) => (props.containSearchBar ? '15px' : '0px')};
    }

    .div {
      font-size: 20px;

      @media (max-width: 700px) {
        font-size: 13px;
      }
    }

    div: nth-child(2) {
      margin-left: 50px;
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

  @media (max-width: 700px) {
    margin: 10px 0px 0px 0px;
  }
`

export const DaoOverviewPanel = styled.div`
  width: 100%;
  border-radius: 0px 0px 6px 6px;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  background-color: #ffffff;
  margin-top: 5px;
  padding: 16px 30px 30px 20px;
  background-color: #ffffff;
  display: flex;

  color: #000000;
  font-size: 16px;

  @media (max-width: 1000px) {
    font-size: 13px;
  }

  @media (max-width: 700px) {
    border-radius: 0px 0px 3px 3px;
    box-shadow: 1px 1px 3px 0 #dfdfdf;
    padding: 5px 20px 15px 20px;

    font-size: 13px;
  }

  .dao__overview__separate {
    width: 1px;
    height: auto;
    background: #eaeaea;
    margin: 0 2%;
  }
`

export const DaoOverviewLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 58;

  > div {
    display: flex;
    justify-content: space-between;
  }

  .dao__overview__left_separate {
    width: 100%;
    height: 1px;
    background: #eaeaea;
  }
`

export const DaoOverviewRightPanel = styled.div`
  display: flex;
  flex-direction: row;
  flex: 38;

  .nervos__dao__overview_pie_panel {
    display: flex;
    flex-direction: column;
  }
`

export const DaoOverviewItemPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;

  .dao__overview__item_top {
    display: flex;
    flex-direction: row;
    align-items: center;

    .dao__overview__item_title {
      color: #5e5e5e;
      font-size: 12px;
      font-weight: bold;
    }

    > img {
      width: 7px;
      height: 10px;
      margin-left: 5px;
      margin-right: 3px;
    }

    .dao__overview__item_change {
      font-size: 12px;
      font-weight: bold;
      color: ${props => props.theme.primary};
    }
  }

  .dao__overview__item_content {
    color: #000000;
    font-size: 18px;
    font-weight: bold;
  }
`

export const NervosDaoPieItemPanel = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  > img {
    width: 9px;
    height: 9px;
    margin-right: 5px;
  }

  > div {
    > span {
      font-size: 12px;
      color: #5e5e5e;
      font-weight: bold;
    }
    > div {
      font-size: 18px;
      color: #000000;
    }
  }
`
