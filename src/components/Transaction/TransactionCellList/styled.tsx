import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 13;
  width: 100%;

  > button {
    @media (max-width: 700px) {
      font-size: 14px;
    }

    border: none;
    padding: 10px 0px;
    color: #888888;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    background: #ffffff;

    > img {
      @media (max-width: 700px) {
        width: 11px;
        height: 7px;
        margin-left: 5px;
      }

      width: 16px;
      height: 9px;
      flex: 1;
      margin-left: 10px;
    }
  }
`
