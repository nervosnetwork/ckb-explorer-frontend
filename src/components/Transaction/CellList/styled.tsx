import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 13;
  width: 100%;

  > button {
    border: none;
    padding: 10px 0px;
    color: #888888;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    outline: none;

    > img {
      width: 16px;
      height: 9px;
      flex: 1;
      margin-left: 10px;
    }
  }
`
