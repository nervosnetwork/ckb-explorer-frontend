import styled from 'styled-components'

export const BlockListPanel = styled.div`
  width: 100%;

  @media (min-width: 700px) {
    margin-top: 40px;
    margin-bottom: 40px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 6px 0 rgba(77, 77, 77, 0.21);
  }

  @media (max-width: 700px) {
    margin-top: 0px;
    padding: 0px 20px 0px 20px;

    .block__green__background {
      margin-left: -20px;
      height: 61px;
      width: calc(100% + 40px);
      background-color: #3cc68a;
      z-index: 1;
    }
  }

  .block_list__pagination {
    @media (max-width: 700px) {
      margin-top: 5px;
    }
  }
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 700px) {
    font-size: 26px;
  }

  &:after {
    content: '';
    background: #3cc68a;
    height: 4px;
    width: 197px;
    display: block;
    margin: 0 auto;

    @media (max-width: 700px) {
      width: 80px;
    }
  }
`

export const ContentTable = styled.div`
  @media (max-width: 700px) {
    margin-top: -41px;
    z-index: 2;
  }
`

export const HighLightValue = styled.div`
  color: #3cc68a;
  font-size: 13px;
  height: 16px;
`
