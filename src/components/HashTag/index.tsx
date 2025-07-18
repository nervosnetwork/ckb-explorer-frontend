import { Link } from '../Link'
import { TYPE_ID_TAG, isTypeIdScript } from '../../utils/typeid'
import { Script } from '../../models/Script'
import styles from './index.module.scss'

export default ({ script }: { script: Script & { category?: 'lock' | 'type' } }) => {
  let hashTag = null

  const scriptType = 'tags' in script ? 'lock' : 'type'

  if (script.verifiedScriptName) {
    hashTag = {
      tag: script.verifiedScriptName,
      category: scriptType ?? script.category,
    }
  } else if (isTypeIdScript(script)) {
    hashTag = { tag: TYPE_ID_TAG, category: 'type' }
  } else if (script.tags?.length) {
    hashTag = {
      tag: script.tags?.[0] ?? '',
      category: scriptType ?? script.category,
    }
  }

  if (!hashTag) return null

  return (
    <div className={hashTag.category === 'lock' ? `${styles.tagPanel} ${styles.isLock}` : styles.tagPanel}>
      <Link
        to={`/script/${script.codeHash}/${script.hashType}`}
        rel="noopener noreferrer"
        target="_blank"
        className="text-[#000]! flex items-center gap-1"
      >
        {hashTag.tag}
      </Link>
    </div>
  )
}
