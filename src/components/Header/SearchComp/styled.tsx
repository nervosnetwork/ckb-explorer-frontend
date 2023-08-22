import styled from 'styled-components'

export const HeaderSearchPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 40px;
  height: 38px;
  width: 440px;

  @media (width <= 750px) {
    padding: 40px 15px;
    height: 38px;
    width: 100%;
  }

  @media (width <= 1600px) {
    width: 360px;
    margin-right: 16px;
  }

  @media (width <= 1480px) {
    width: 320px;
    margin-right: 16px;
  }
`

export const HeaderSearchBarPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;

  > img {
    width: 18px;
    height: 18px;
  }
`
