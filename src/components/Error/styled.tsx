import styled from 'styled-components'

export const ErrorPanel = styled.div`
  width: 100%;
  margin: 112px 0 203px 0;
  text-align: center;

  @media (max-width: 750px) {
    margin: 120px 0 130px 0;
  }

  > img {
    width: 1038px;
    max-width: 100%;
    margin: 0 auto;

    @media (max-width: 750px) {
      width: 282px;
      height: 130px;
    }
  }
`
