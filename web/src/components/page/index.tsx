import React from 'react'
import styled from 'styled-components'

const PageDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: transparent;
  box-sizing: border-box;
  position: relative;
  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
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
      <div>{children}</div>
    </PageDiv>
  )
}
