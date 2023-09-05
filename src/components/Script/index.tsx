import { ReactNode } from 'react'
import { ScriptItemPanel, ScriptPanel } from './styled'
import i18n from '../../utils/i18n'
import HashTag from '../HashTag'
import { getContractHashTag } from '../../utils/util'
import { HelpTip } from '../HelpTip'

const ScriptItem = ({ title, tooltip, children }: { title: string; tooltip?: string; children?: ReactNode }) => (
  <ScriptItemPanel>
    <div className="script__title">
      <span>{title}</span>
      {tooltip && <HelpTip title={tooltip} />}
      <span>:</span>
    </div>
    <div className="script__content">{children}</div>
  </ScriptItemPanel>
)

const Script = ({ script }: { script: State.Script }) => {
  const contractHashTag = getContractHashTag(script)
  return (
    <ScriptPanel>
      <ScriptItem title={i18n.t('address.code_hash')}>
        <div className="script__code_hash">
          <span className="monospace">{script.codeHash}</span>
          {contractHashTag && <HashTag content={contractHashTag.tag} />}
        </div>
      </ScriptItem>
      <ScriptItem title={i18n.t('address.hash_type')}>
        <code>{script.hashType}</code>
      </ScriptItem>
      <ScriptItem title={i18n.t('address.args')} tooltip={i18n.t('glossary.args')}>
        <span className="monospace">{script.args}</span>
      </ScriptItem>
    </ScriptPanel>
  )
}

export default Script
