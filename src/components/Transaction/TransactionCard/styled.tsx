import styled from 'styled-components'

export const CardPanel = styled.div`
  width: 88%;
  background-color: white;
  padding: 20px;
  margin: 10px 6% 10px 6%;
  border: 0px solid white;
  border-radius: 3px;
  box-shadow: 2px 2px 6px #eaeaea;
  display: flex;
  flex-direction: column;
  .sperate__line_top {
    width: 100%;
    height: 1px;
    background-color: #dfdfdf;
    margin-top: 10px;
  }
  .green__arrow {
    text-align: center;
    margin-top: 10px;
    height: 20px;
    > img {
      width: 20px;
      height: 20px;
    }
  }
  .sperate__line_bottom {
    width: 100%;
    height: 1px;
    background-color: #dfdfdf;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`

export const CardHashBlockPanel = styled.div`
  .card__hash {
    font-size: 14px;
    color: #4bbc8e;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: monospace;
  }
  .card__block_date {
    margin-top: 5px;
    font-size: 12px;
    color: #888888;
  }
`
export const CardCellPanel = styled.div`
  margin-top: 10px;
  .card__cell_address {
    font-size: 13px;
    color: ${({ highLight = false }: { highLight?: boolean }) => (highLight ? '#4bbc8e' : '#888888')};
    font-family: monospace;
  }
  .card__cell_capacity {
    font-size: 12px;
    color: #888888;
    margin-top: 5px;
  }
`

export const CellbasePanel = styled.div`
  display: flex;
  margin-top: 10px;
  .cellbase__content {
    color: #888888;
    font-size: 13px;
    margin-right: 10px;
  }

  .cellbase__help {
    margin-left: 10px;
    position: relative;
    &:focus {
      outline: 0;
    }

    > img {
      width: 14px;
      height: 14px;
    }
  }
`

export const CellHashHighLight = styled.div`
  font-size: 14px;
  color: rgb(75, 188, 142);
`

export const FullPanel = styled.div`
  width: 100%;
`
