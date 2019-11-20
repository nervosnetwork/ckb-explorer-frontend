import React from 'react'
import styled from 'styled-components'

const ContentDiv = styled.div`
  width: 100%;
  overflow-x: hidden;
  flex: 1;
  margin-top: ${(props: { width: number }) => `${80 / (props.width / 1200)}px`};

  @media (max-width: 700px) {
    margin-top: 42px;
  }
`
export default ({ children, style }: { children: any; style?: any }) => {
  return (
    <ContentDiv style={style} width={window.innerWidth}>
      {children}
    </ContentDiv>
  )
}
