import styled from 'styled-components'

export const BlockListPanel = styled.div`
  width: 100%;
  margin-top: 40px;
  margin-bottom: 40px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 6px 0 rgba(77, 77, 77, 0.21);

  @media (max-width: 700px) {
    margin-top: 0px;
    margin-bottom: 0px;
    padding: 0px 20px 0px 20px;

    .block__green__background {
      margin-left: -20px;
      height: 61px;
      width: calc(100% + 40px);
      background-color: #3cc68a;
      z-index: 1;
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
  overflow-x: auto;
`
export const CommonPagition = styled.div`
  .rc-pagination {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    li:focus {
      outline: none !important;
    }
    .rc-pagination-item-active {
      background-color: #4bbc8e !important;
      border-color: #4bbc8e !important;
    }
    .rc-pagination-item {
      &:hover {
        border-color: #4bbc8e !important;
      }
    }
    .rc-pagination-options {
      .rc-pagination-options-quick-jumper {
        input:hover {
          border-color: #4bbc8e !important;
        }
      }
    }
  }
`

export const BlocksPagition = styled(CommonPagition)`
  margin-top: 60px;
  @media (max-width: 700px) {
    margin-top: 15px;
    margin-left: 3%;
  }
  width: 100%;
  overflow-x: auto;
`
