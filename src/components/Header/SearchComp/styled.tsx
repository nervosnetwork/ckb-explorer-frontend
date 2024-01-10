import styled from 'styled-components'

export const HeaderSearchPanel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  height: 38px;
  width: 440px;

  @media (max-width: 1200px) {
    height: 38px;
  }

  @media (max-width: 1600px) {
    margin-right: 16px;
  }

  @media (max-width: 1023px) {
    margin: 40px 56px;
    align-items: flex-start;
    flex-direction: column;
    width: auto;
  }
`

export const HeaderSearchBarPanel = styled.div`
  display: flex;
  align-items: center;

  > img {
    width: 18px;
    height: 18px;
  }
`
