import styled from 'styled-components'

export const LoadingPanel = styled.div`
  width: 100%;
  margin: 100px 0;
  text-align: center;

  > img {
    max-width: 100%;
    width: 270px;
  }

  @media (max-width: 750px) {
    margin: 60px 0;

    > img {
      width: 135px;
    }
  }
`
