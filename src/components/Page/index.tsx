import React from 'react'
import styled from 'styled-components'

const PageDiv = styled.div`
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  -webkit-transform: translate3d(0,0,0)
  background-color: #f9f9f9;
  box-sizing: border-box;
  position: relative;
  .page__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
  }

  /* hide inner scroll bar*/

  div::-webkit-scrollbar {
    width: 0 !important; // chrome, Safari
  }
  div {
    overflow: -moz-scrollbars-none; // Firefox
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE 10
  }
`

export default ({ children, style }: { children: any; style?: object }) => {
  return (
    <PageDiv className="page" style={style}>
      <div className="page__content">{children}</div>
    </PageDiv>
  )
}
