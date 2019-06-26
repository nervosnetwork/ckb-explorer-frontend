import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 22px;
  margin-top: 11px;
  margin-bottom: 11px;

  .cell {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 260px;
  }

  .link {
    width: 260px;
  }

  .capacity {
    font-size: 16px;
    color: rgb(136, 136, 136);
    margin-left: 15px;
  }
`

export const CellHash = styled.code`
  font-size: 16px;
  color: rgb(136, 136, 136);
`

export const CellHashHighLight = styled(CellHash)`
  font-size: 16px;
  color: rgb(75, 188, 142);
`
