import React, { useContext } from 'react'
import styled from 'styled-components'
import AppContext from '../../contexts/App'

const MaintainPanel = styled.div`
  width: 100%;
  overflow-x: hidden;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    font-size: 36px;
    font-weight: bold;
    color: #3cc68a;
    margin-top: 20%;

    @media (max-width: 700px) {
      margin-top: 40%;
      font-size: 16px;
      padding: 0 10%;
    }
  }
`

export default () => {
  const appContext = useContext(AppContext)
  return (
    <MaintainPanel>
      <div>{appContext.errorMessage}</div>
    </MaintainPanel>
  )
}
