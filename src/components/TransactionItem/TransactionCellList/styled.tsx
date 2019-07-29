import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 13;
  width: 100%;

  > a {
    font-size: 16px;
    color: #888888;
    margin-top: 18px;

    @media (max-width: 700px) {
      font-size: 14px;
      margin-top: 10px;
    }
  }
`
