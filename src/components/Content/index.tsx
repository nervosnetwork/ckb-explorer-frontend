import React from 'react'
import styled from 'styled-components'

const ContentDiv = styled.div`
  margin-top: 80px;
  width: 100%;
  overflow-x: hidden;
  flex: 1;
  @media (max-width: 700px) {
    margin-top: 42px;
  }
`
export default ({ children, style }: { children: any; style?: any }) => {
  return <ContentDiv style={style}>{children}</ContentDiv>
}
