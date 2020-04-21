import React from 'react'
import styled from 'styled-components'

const PagePanel = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: #f9f9f9;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
`

export default ({ children, style }: { children: any; style?: object }) => {
  return <PagePanel style={style}>{children}</PagePanel>
}
