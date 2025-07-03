import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import HashTag from '../HashTag'
import { HelpTip } from '../HelpTip'
import { Script } from '../../models/Script'
import styles from './index.module.scss'

const ScriptItem = ({ title, tooltip, children }: { title: string; tooltip?: string; children?: ReactNode }) => (
  <div className={styles.scriptItemPanel}>
    <div className="scriptTitle">
      <span>{title}</span>
      {tooltip && <HelpTip>{tooltip}</HelpTip>}
      <span>:</span>
    </div>
    <div className="scriptContent">{children}</div>
  </div>
)

const ScriptComp = ({ script }: { script: Script }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.scriptPanel}>
      <ScriptItem title={t('address.code_hash')}>
        <div className="scriptCodeHash">
          <span className="monospace">{script.codeHash}</span>
          <HashTag script={script} />
        </div>
      </ScriptItem>
      <ScriptItem title={t('address.hash_type')}>
        <code>{script.hashType}</code>
      </ScriptItem>
      <ScriptItem title={t('address.args')} tooltip={t('glossary.args')}>
        <span className="monospace" data-is-decodable="true">
          {script.args}
        </span>
      </ScriptItem>
    </div>
  )
}

export default ScriptComp
