import styled from 'styled-components'

export const DaoContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 40px;

  @media (max-width: 750px) {
    margin: 0;
    padding: 20px;
  }
`

export const DaoTabBarPanel = styled.div`
  width: 100%;
  background: white;
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 6px 0 #dfdfdf;
  padding: 10px 40px;
  font-size: 18px;
  border-radius: 6px 6px 0 0;

  @media (max-width: 1200px) {
    font-size: 16px;
  }

  @media (max-width: 750px) {
    padding: 10px 0;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    align-items: stretch;

    > div {
      padding-left: 10px;
      padding-right: 10px;
      width: auto;
    }
  }

  .nervosDaoTabBar {
    display: flex;
    height: 30px;
    cursor: pointer;
    margin-right: 15px;

    @media (max-width: 750px) {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      margin-right: 0;
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

    .tabBarNormal {
      width: 140px;
      text-align: center;
      color: #000;
      font-weight: normal;
      font-size: 18px;

      @media (max-width: 1200px) {
        width: 110px;
      }
    }

    .tabBarSelected {
      width: 140px;
      text-align: center;
      font-size: 18px;
      color: #000;
      font-weight: bold;
      border-bottom: 3px solid ${props => props.theme.primary};

      @media (max-width: 1200px) {
        width: 110px;
      }
    }
  }
`
