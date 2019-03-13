import React from 'react'
import styled from 'styled-components'

const ContentDiv = styled.div`
  width: 100%;
  overflow-x: hidden;
  flex: 1;
`
export default ({ children, style }: { children: any; style?: any }) => {
  return <ContentDiv style={style}>{children}</ContentDiv>
}
