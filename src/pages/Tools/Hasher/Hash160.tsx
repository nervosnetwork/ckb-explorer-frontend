import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HasherCkb } from '@ckb-ccc/core'
import styles from './hash160.module.scss'
import CopyableText from '../../../components/CopyableText'

const debounceInput = (fn: Function, delay = 300) => {
  let timer: NodeJS.Timeout
  return (value: unknown) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(fn, value)
    }, delay)
  }
}

export const Hash160: React.FC = () => {
  const [value, setValue] = useState('')
  const { t } = useTranslation()

  const [hash, error] = useMemo(() => {
    if (!value) return [null, null]
    try {
      // 42 for 0x + 40 for hash
      return [new HasherCkb().update(value).digest().slice(0, 42), null]
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
  }, [value])

  const saveValue = debounceInput(setValue)

  return (
    <div>
      <div className={styles.value}>
        <label htmlFor="value">Value</label>

        <input
          id="value"
          placeholder={`${t('tools.please_enter')} Value`}
          className={styles.input}
          value={value}
          onChange={e => saveValue(e.target.value?.replace(/\s/g, ''))}
        />
      </div>

      {hash ? (
        <div className={styles.console}>
          <strong>Blake160:</strong>
          <CopyableText>{hash}</CopyableText>
        </div>
      ) : null}
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
