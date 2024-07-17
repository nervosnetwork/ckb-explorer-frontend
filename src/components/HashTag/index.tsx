import { Link } from '../Link'
import { TYPE_ID_TAG, TYPE_ID_RFC } from '../../utils/typeid'
import { TagPanel } from './styled'

export default ({ content, category = 'lock' }: { content: string; category?: 'lock' | 'type' }) =>
  content === TYPE_ID_TAG ? (
    <TagPanel isLock={category === 'lock'}>
      <Link
        to={TYPE_ID_RFC}
        rel="noopener noreferrer"
        target="_blank"
        style={{
          color: '#000',
        }}
      >
        {content}
      </Link>
    </TagPanel>
  ) : (
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
