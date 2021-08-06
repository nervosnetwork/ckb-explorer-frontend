import { TagPanel } from './styled'

export default ({ content, category = 'lock' }: { content: string; category?: 'lock' | 'type' }) => (
  <TagPanel isLock={category === 'lock'} length={content.length}>
    <span>{content}</span>
  </TagPanel>
)
