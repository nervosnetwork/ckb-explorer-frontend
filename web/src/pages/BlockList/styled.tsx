import styled from 'styled-components'

export const BlockListPanel = styled.div`
  width: 100%;
  margin-top: ${(props: { width: number }) => (150 * props.width) / 1920}px;
  margin-bottom: ${(props: { width: number }) => (200 * props.width) / 1920}px;
`

export const ContentTitle = styled.div`
  font-size: 50px;
  color: black;
  margin: 0 auto;
  text-align: center;

  &:after {
    content: '';
    background: #3CC68A;
    height: 4px;
    width: 197px;
    display: block;
    margin: 0 auto;
  }
`

export const ContentTable = styled.div`
  margin-top: 58px;
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
  width: 100%;
  overflow-x: auto;
`
