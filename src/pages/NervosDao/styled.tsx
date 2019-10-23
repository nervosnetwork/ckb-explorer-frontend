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
`

export const DaoTabBarPanel = styled.div`
  width: 100%;
  height: 70px;
  background: white;
  display: flex;
  margin: 20px 0 5px 0;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;

  @media (max-width: 700px) {
    height: 90px;
    flex-direction: column;
    justify-content: center;
  }

  .nervos_dao_tab_bar {
    display: flex;
    height: 30px;
    cursor: pointer;

    @media (max-width: 700px) {
      margin-bottom: 23px;
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
    }

    .tab_bar_selected {
      color: ${props => props.theme.primary};
      border-bottom: 1px solid ${props => props.theme.primary};
    }
  }
`

export const TransactionsPagition = styled.div`
  margin: 20px 0px 0px 0px;
  width: 100%;

  @media (max-width: 700px) {
    margin: 10px 0px 0px 0px;
  }
`
