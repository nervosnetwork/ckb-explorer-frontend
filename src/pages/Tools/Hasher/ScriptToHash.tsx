import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Script, ScriptLike } from '@ckb-ccc/core'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/RadioGroup'
import { HashType } from '../../../constants/common'
import styles from './scriptToHash.module.scss'
import CopyableText from '../../../components/CopyableText'

const debounceInput = (fn: Function, delay = 300) => {
  let timer: NodeJS.Timeout
  return (value: unknown) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, value)
    }, delay)
  }
}

export const ScriptToHash: React.FC = () => {
  const [script, setScript] = useState<ScriptLike>({
    codeHash: '',
    hashType: 'type',
    args: '',
  })
  const { t } = useTranslation()

  const [hash, error] = useMemo(() => {
    if (!script.codeHash || !script.hashType || !script.args) return [null, null]
    try {
      return [Script.from(script).hash(), null]
    } catch (e) {
      if (e instanceof Error) {
        const msg = e.message.split('\n')[0]
        if (msg) {
          return [null, msg]
        }
        return [null, e.message]
      }
      return [null, `${e}`]
    }
  }, [script])

  const saveScript = debounceInput(setScript)

  return (
    <div>
      <div>
        <div className={styles.codeHash}>
          <label htmlFor="code-hash">Code Hash</label>

          <input
            id="code-hash"
            placeholder={`${t('tools.please_enter')} Code Hash`}
            className={styles.input}
            onChange={e => saveScript((s: Script) => ({ ...s, codeHash: e.target.value }))}
          />
        </div>

        <div className={styles.hashType}>
          <label>Hash Type</label>
          <RadioGroup
            className={styles.radioGroup}
            onValueChange={value => saveScript((s: Script) => ({ ...s, hashType: value }))}
            value={script.hashType.toString()}
          >
            {Object.values(HashType).map(hashType => (
              <div className={styles.radioItem} key={hashType}>
                <RadioGroupItem value={hashType} id={hashType} />
                <label htmlFor={hashType}>{hashType.toLowerCase()}</label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className={styles.args}>
          <label htmlFor="args">Args</label>
          <input
            id="args"
            className={styles.input}
            placeholder={`${t('tools.please_enter')} Args`}
            onChange={e => saveScript((s: Script) => ({ ...s, args: e.target.value }))}
          />
        </div>
      </div>

      {hash ? (
        <div className={styles.console}>
          <div className={styles.item}>
            <strong>Script Hash:</strong>
            <a href={`/script/${script.codeHash}/${script.hashType}`} target="_blank" rel="noopener noreferrer">
              <CopyableText>{hash}</CopyableText>
            </a>
          </div>
          <div className={styles.scriptPage}>
            {t(`tools.referred_in_script`)}
            <a href={`/script/${hash}/type`} target="_blank" rel="noopener noreferrer">
              {t('tools.visit_it')}
            </a>
          </div>
        </div>
      ) : null}
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
