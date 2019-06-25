import React from 'react'
import styled from 'styled-components'

const PageDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // hack ios
  background-color: #f9f9f9;
  box-sizing: border-box;
  position: relative;
`

export default ({ children, style }: { children: any; style?: object }) => {
  return (
    <PageDiv className="page" style={style}>
      {children}
    </PageDiv>
  )
}
