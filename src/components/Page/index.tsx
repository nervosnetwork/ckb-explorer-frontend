import React from 'react'
import styled from 'styled-components'

const PageDiv = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: #f9f9f9;
  box-sizing: border-box;
  position: relative;
`

export default ({
  children,
  style,
}: {
  children: any
  style?: object
  onScroll?: Function
  onScrollEnd?: Function
}) => {
  return (
    <PageDiv className="page" style={style}>
      {children}
    </PageDiv>
  )
}
