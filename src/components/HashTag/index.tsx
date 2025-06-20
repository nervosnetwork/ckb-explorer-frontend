import { useTranslation } from 'react-i18next'
import { Link } from '../Link'
import { TYPE_ID_TAG, TYPE_ID_RFC } from '../../utils/typeid'
import { scripts } from '../../pages/ScriptList'
import { Script } from '../../models/Script'
import { ReactComponent as OpenSourceIcon } from '../../assets/open-source.svg'
import Tooltip from '../Tooltip'
import styles from './index.module.scss'

export default ({
  content,
  category = 'lock',
  script,
  showScriptSuffix = false,
}: {
  content: string
  category?: 'lock' | 'type'
  script: Script
  showScriptSuffix?: boolean
}) => {
  const { t } = useTranslation()
  if (content === TYPE_ID_TAG) {
    return (
      <div className={category === 'lock' ? `${styles.tagPanel} ${styles.isLock}` : styles.tagPanel}>
        <Link to={TYPE_ID_RFC} rel="noopener noreferrer" target="_blank" style={{ color: '#000' }}>
          {content}
        </Link>
      </div>
    )
  }
  const codeUrl = scripts.get(content)?.code
  return (
    <div className={category === 'lock' ? `${styles.tagPanel} ${styles.isLock}` : styles.tagPanel}>
      <Link
        to={`/script/${script.codeHash}/${script.hashType}`}
        rel="noopener noreferrer"
        target="_blank"
        className="text-[#000]! flex items-center gap-1"
      >
        {content}
        {showScriptSuffix ? <span className="text-primary">(@{script.codeHash.slice(2, 10)})</span> : undefined}
        {codeUrl ? <Tooltip trigger={<OpenSourceIcon />}>{t(`scripts.open_source_script`)}</Tooltip> : null}
      </Link>
    </div>
  )
}
