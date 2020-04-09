import React from 'react'
import styled from 'styled-components'

const TagPanel = styled.div`
  height: 20px;
  width: ${({ length }: { length: number; isLock?: boolean }) => `${length * 11.5}px`};
  border-radius: 4px;
  border: solid 0.5px ${({ isLock }: { isLock?: boolean }) => (isLock ? '#b1caff' : '#caacef')};
  background-color: ${({ isLock }: { isLock?: boolean }) => (isLock ? '#d8e4ff' : '#f0e0fb')};
  display: flex;
  align-items: center;
  justify-content: center;
`

export default ({ content, category = 'lock' }: { content: string; category?: 'lock' | 'type' }) => {
  return (
    <TagPanel isLock={category === 'lock'} length={content.length}>
      <span>{content}</span>
    </TagPanel>
  )
}
