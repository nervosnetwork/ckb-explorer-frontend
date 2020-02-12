import React from 'react'
import styled from 'styled-components'

export const MenusPanel = styled.div`
  width: 100%;
  height: 100%;
  background: #1c1c1c;
  display: flex;
  flex-direction: column;
  position: fixed;
  position: -webkit-fixed;
  z-index: 1000;
  color: white;
  top: 42px;
`

export default () => {
  return (
    <React.Fragment>
      <MenusPanel />
    </React.Fragment>
  )
}
