import styled from 'styled-components'

export const BlockListPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (100 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (150 * props.width) / 1920}px;

  @media (max-width: 700px) {
    margin 20px 0px;
  }
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 700px) {
    font-size: 30px;
  }

  &:after {
    content: '';
    background: #3cc68a;
    height: 4px;
    width: 197px;
    display: block;
    margin: 0 auto;

    @media (max-width: 700px) {
      width: 90px;
    }
  }
`

export const ContentTable = styled.div`
  margin-top: 58px;
  @media (max-width: 700px) {
    margin-top: 30px;
  }
  overflow-x: auto;
`
export const CommonPagition = styled.div`
  .rc-pagination {
    min-width: 450px;
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
  }
  width: 100%;
  overflow-x: auto;
`
