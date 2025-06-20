import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { type ContractHashTag, SCRIPT_TAGS } from '../../constants/scripts'
import { ScriptItemPanel, ScriptPanel } from './styled'
import HashTag from '../HashTag'
import { getContractHashTag } from '../../utils/util'
import { isTypeIdScript, TYPE_ID_TAG } from '../../utils/typeid'
import { HelpTip } from '../HelpTip'
import { Script } from '../../models/Script'

const IGNORE_HASH_TYPE = true

const ScriptItem = ({ title, tooltip, children }: { title: string; tooltip?: string; children?: ReactNode }) => (
  <ScriptItemPanel>
    <div className="scriptTitle">
      <span>{title}</span>
      {tooltip && <HelpTip>{tooltip}</HelpTip>}
      <span>:</span>
    </div>
    <div className="scriptContent">{children}</div>
  </ScriptItemPanel>
)

const ScriptComp = ({ script }: { script: Script }) => {
  const { t } = useTranslation()
  let hashTag: Pick<ContractHashTag, 'tag' | 'category'> | undefined
  if (isTypeIdScript(script)) {
    hashTag = { tag: TYPE_ID_TAG }
  } else {
    hashTag = getContractHashTag(script, IGNORE_HASH_TYPE)
  }

  return (
    <ScriptPanel>
      <ScriptItem title={t('address.code_hash')}>
        <div className="scriptCodeHash">
          <span className="monospace">{script.codeHash}</span>
          {hashTag && (
            <HashTag
              content={hashTag.tag}
              script={script}
              showScriptSuffix={hashTag.tag === SCRIPT_TAGS.SECP_MULTISIG}
            />
          )}
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
    </ScriptPanel>
  )
}

export default ScriptComp
