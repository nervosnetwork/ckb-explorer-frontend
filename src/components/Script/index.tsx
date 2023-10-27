import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ScriptItemPanel, ScriptPanel } from './styled'
import HashTag from '../HashTag'
import { getContractHashTag } from '../../utils/util'
import { HelpTip } from '../HelpTip'
import { Script } from '../../models/Script'

const ScriptItem = ({ title, tooltip, children }: { title: string; tooltip?: string; children?: ReactNode }) => (
  <ScriptItemPanel>
    <div className="scriptTitle">
      <span>{title}</span>
      {tooltip && <HelpTip title={tooltip} />}
      <span>:</span>
    </div>
    <div className="scriptContent">{children}</div>
  </ScriptItemPanel>
)

const ScriptComp = ({ script }: { script: Script }) => {
  const contractHashTag = getContractHashTag(script)
  const { t } = useTranslation()

  return (
    <ScriptPanel>
      <ScriptItem title={t('address.code_hash')}>
        <div className="scriptCodeHash">
          <span className="monospace">{script.codeHash}</span>
          {contractHashTag && <HashTag content={contractHashTag.tag} />}
        </div>
      </ScriptItem>
      <ScriptItem title={t('address.hash_type')}>
        <code>{script.hashType}</code>
      </ScriptItem>
      <ScriptItem title={t('address.args')} tooltip={t('glossary.args')}>
        <span className="monospace">{script.args}</span>
      </ScriptItem>
    </ScriptPanel>
  )
}

export default ScriptComp
