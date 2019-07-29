import styled from 'styled-components'

export default styled.div`
  width: 100%;
  max-height: 400px;
  margin-top: 20px;

  @media (max-width: 700px) {
    margin-top: 10px;
  }

  #transaction__detail_content {
    border: none;
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-all;
    padding: 20px 30px;
    font-size: 16px;
    color: #888888;
    font-weight: bold;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    margin-top: 5px;
    background-color: #f9f9f9;
    border-radius: 6px;

    @media (max-width: 700px) {
      font-size: 10px;
      border-radius: 3px;
      padding: 10px;
    }
  }

  .transaction__detail_copy {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    width: 100%;

    @media (max-width: 700px) {
      margin-top: 10px;
    }
  }
`

export const TransactionCellDetailCopyButtonPanel = styled.div`
  margin: auto;
  cursor: pointer;
  width: 150px;
  height: 40px;

  @media (max-width: 700px) {
    width: 75px;
    height: 20px;
  }

  > img {
    width: 100%;
    height: 100%;
  }
`
