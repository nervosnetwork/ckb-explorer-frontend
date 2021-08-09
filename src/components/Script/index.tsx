import { ReactNode } from 'react'
import { ScriptItemPanel, ScriptPanel } from './styled'
import i18n from '../../utils/i18n'
import HashTag from '../HashTag'
import { matchCodeHash } from '../../utils/util'

const ScriptItem = ({ title, children }: { title: string; children?: ReactNode }) => (
  <ScriptItemPanel>
    <div className="script__title">
      <span>{title}</span>
    </div>
    <div className="script__content">{children}</div>
  </ScriptItemPanel>
)

const Script = ({ script }: { script: State.Script }) => {
  const contractHashTag = matchCodeHash(script.codeHash)
  return (
    <ScriptPanel>
      <ScriptItem title={i18n.t('address.code_hash')}>
        <div className="script__code_hash">
          <span className="monospace">{script.codeHash}</span>
          {contractHashTag && <HashTag content={contractHashTag.tag} />}
        </div>
      </ScriptItem>
      <ScriptItem title={i18n.t('address.args')}>
        <span className="monospace">{script.args}</span>
      </ScriptItem>
      <ScriptItem title={i18n.t('address.hash_type')}>
        <code>{script.hashType}</code>
      </ScriptItem>
    </ScriptPanel>
  )
}

export default Script
