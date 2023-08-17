import styled from 'styled-components'

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
      box-shadow: 1px 1px 3px 0 #dfdfdf;
      font-size: 15px;
      padding-left: 20px;
    }
  }
`

export const DaoTabBarPanel = styled.div`
  width: 100%;
  height: 58px;
  background: white;
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  padding: 0 40px;
  font-size: 18px;
  border-radius: 6px 6px 0 0;

  @media (max-width: 1200px) {
    font-size: 16px;
  }

  @media (max-width: 750px) {
    height: ${(props: { containSearchBar: boolean }) => (props.containSearchBar ? '100px' : '50px')};
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

    div:nth-child(2) {
      margin-left: 50px;

      @media (max-width: 1200px) {
        margin-left: 30px;
      }
    }

    .tab_bar_normal {
      width: 140px;
      text-align: center;
      color: #000000;
      font-weight: normal;
      font-size: 18px;

      @media (max-width: 1200px) {
        width: 110px;
      }
    }

    .tab_bar_selected {
      width: 140px;
      text-align: center;
      font-size: 18px;
      color: #000000;
      font-weight: bold;
      border-bottom: 3px solid ${props => props.theme.primary};

      @media (max-width: 1200px) {
        width: 110px;
      }
    }
  }
`
