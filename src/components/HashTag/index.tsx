import { TagPanel } from './styled'

export default ({ content, category = 'lock' }: { content: string; category?: 'lock' | 'type' }) => (
  <TagPanel isLock={category === 'lock'} length={content.length}>
    <a
      href={`/scripts#${content}`}
      rel="noopener noreferrer"
      target="_blank"
      style={{
        color: '#000',
      }}
    >
      {content}
    </a>
  </TagPanel>
)
