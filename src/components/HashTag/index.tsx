import { Link } from '../Link'
import { TagPanel } from './styled'

export default ({ content, category = 'lock' }: { content: string; category?: 'lock' | 'type' }) => (
  <TagPanel isLock={category === 'lock'}>
    <Link
      to={`/scripts#${content}`}
      rel="noopener noreferrer"
      target="_blank"
      style={{
        color: '#000',
      }}
    >
      {content}
    </Link>
  </TagPanel>
)
