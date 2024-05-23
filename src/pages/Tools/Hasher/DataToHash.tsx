import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CKBHasher } from '@ckb-lumos/lumos/utils'
import { bytes } from '@ckb-lumos/lumos/codec'
import styles from './dataToHash.module.scss'
import CopyableText from '../../../components/CopyableText'

const blake2b = (data: string) => {
  const hasher = new CKBHasher()
  hasher.update(bytes.bytify(data))
  return hasher.digestHex()
}

export const DataToHash: React.FC = () => {
  const [data, setData] = useState('')
  const { t } = useTranslation()

  const [hash, error] = useMemo(() => {
    const v = data.trim()
    if (!v) return [null, null]
    try {
      return [blake2b(v), null]
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
  }, [data])

  return (
    <div>
      <div className={styles.value}>
        <label htmlFor="value">{t('tools.data')}</label>

        <textarea
          id="value"
          placeholder={`${t('tools.please_enter')} ${t('tools.data')}`}
          className={styles.input}
          value={data}
          onChange={e => setData(e.target.value?.replace(/\s/g, ''))}
        />
      </div>

      {hash ? (
        <div className={styles.console}>
          <div className={styles.item}>
            <strong>{t('tools.data_hash')}</strong>
            <CopyableText>{hash}</CopyableText>
          </div>
          <div className={styles.scriptPage}>
            {t(`tools.referred_in_script`)}
            &nbsp; As
            <a href={`/script/${hash}/data`} target="_blank" rel="noopener noreferrer">
              Data
            </a>
            or
            <a href={`/script/${hash}/data1`} target="_blank" rel="noopener noreferrer">
              Data1
            </a>
            or
            <a href={`/script/${hash}/data2`} target="_blank" rel="noopener noreferrer">
              Data2
            </a>
          </div>
        </div>
      ) : null}
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
