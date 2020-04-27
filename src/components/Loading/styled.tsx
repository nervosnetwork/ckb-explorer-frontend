import styled from 'styled-components'

export const LoadingPanel = styled.div`
  margin: 100px 0;
  > img {
    width: 270px;
    height: 78px;
  }

  @media (max-width: 750px) {
    margin: 60px 0;
    > img {
      width: 135px;
      height: 39px;
    }
  }
`
