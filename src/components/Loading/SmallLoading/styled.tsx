import styled from 'styled-components'

export const SmallLoadingPanel = styled.div`
  margin: 15px 0;
  text-align: center;

  .loading__white {
    opacity: 0.8;
  }

  > img {
    width: 135px;
    height: 39px;
  }

  @media (max-width: 750px) {
    margin: 8px 0;

    > img {
      width: 68px;
      height: 20px;
    }
  }
`
