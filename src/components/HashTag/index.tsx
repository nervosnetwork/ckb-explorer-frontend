import React from 'react'
import styled from 'styled-components'

const TagPanel = styled.div`
  padding: 6px;
  border-radius: 4px;
  border: solid 0.5px ${({ isLock }: { isLock?: boolean }) => (isLock ? '#b1caff' : '#caacef')};
  background-color: ${({ isLock }: { isLock?: boolean }) => (isLock ? '#d8e4ff' : '#f0e0fb')};
  text-align: center;
`

export default ({ content, isLock = true }: { content: string; isLock?: boolean }) => {
  return (
    <TagPanel isLock={isLock}>
      <span>{content}</span>
    </TagPanel>
  )
}
