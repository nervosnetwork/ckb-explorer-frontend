import { useTranslation } from 'react-i18next'
import { Link } from '../Link'
import { TYPE_ID_TAG, isTypeIdScript } from '../../utils/typeid'
import { scripts } from '../../pages/ScriptList'
import { Script } from '../../models/Script'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import Tooltip from '../Tooltip'
import styles from './index.module.scss'
import { getContractHashTag } from '../../utils/util'

export default ({ script }: { script: Script & { tag?: string | null; category?: 'lock' | 'type' } }) => {
  const { t } = useTranslation()

  let hashTag = null

  if (script.tag && script.category) {
    hashTag = {
      tag: script.tag,
      category: script.category,
      multiple: false,
    }
  } else if (isTypeIdScript(script)) {
    hashTag = { tag: TYPE_ID_TAG, category: 'type', multiple: false }
  } else {
    hashTag = getContractHashTag(script)
  }

  if (!hashTag) return null

  const info = scripts.get(hashTag.tag)

  return (
    <div className={hashTag.category === 'lock' ? `${styles.tagPanel} ${styles.isLock}` : styles.tagPanel}>
      <Link
        to={`/script/${script.codeHash}/${script.hashType}`}
        rel="noopener noreferrer"
        target="_blank"
        className="text-[#000]! flex items-center gap-1"
      >
        {info?.name ?? hashTag.tag}
        {hashTag.multiple ? <span className="text-primary">(@{script.codeHash.slice(2, 10)})</span> : undefined}
        {info?.code ? (
          <Tooltip trigger={<OpenSourceIcon width={14} />}>{t(`scripts.open_source_script`)}</Tooltip>
        ) : null}
      </Link>
    </div>
  )
}
