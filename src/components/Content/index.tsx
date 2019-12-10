import React from 'react'
import styled from 'styled-components'

const parseMargin = (width: number) => {
  if (width >= 1200) {
    return 80
  }
  return 90 / (width / 1200)
}

const ContentDiv = styled.div`
  width: 100%;
  overflow-x: hidden;
  flex: 1;
  margin-top: ${(props: { width: number }) => `${parseMargin(props.width)}px`};

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
