import React from 'react'
import styled from 'styled-components'

const PageDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // hack ios
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
const scrollLatency: number = 300
let scrollEndTimer: any = null

export default ({
  children,
  style,
  onScroll,
  onScrollEnd,
}: {
  children: any
  style?: object
  onScroll?: Function
  onScrollEnd?: Function
}) => {
  return (
    <PageDiv
      className="page"
      style={style}
      onScroll={(event: any) => {
        const { nativeEvent } = event
        // response on scroll
        if (onScroll) onScroll(nativeEvent)
        // response on scrollEnd
        if (onScrollEnd) {
          if (scrollEndTimer) clearTimeout(scrollEndTimer)
          scrollEndTimer = setTimeout(() => {
            scrollEndTimer = null
            onScrollEnd(nativeEvent)
          }, scrollLatency)
        }
      }}
    >
      <div className="page__content">{children}</div>
    </PageDiv>
  )
}
