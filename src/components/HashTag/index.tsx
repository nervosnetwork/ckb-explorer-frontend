import React from 'react'
import { TagPanel } from './styled'

export default ({ content, category = 'lock' }: { content: string; category?: 'lock' | 'type' }) => {
  return (
    <TagPanel isLock={category === 'lock'} length={content.length}>
      <span>{content}</span>
    </TagPanel>
  )
}
