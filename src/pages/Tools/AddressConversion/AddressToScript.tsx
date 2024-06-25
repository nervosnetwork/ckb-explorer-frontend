import React, { useMemo, useState } from 'react'
import type { Script } from '@ckb-lumos/base'
import { useTranslation } from 'react-i18next'
import { parseAddress } from '@ckb-lumos/helpers'
import { parseMultiVersionAddress, ParseResult } from './parseMultiVersionAddress'
import CopyableText from '../../../components/CopyableText'
import { MultiVersionAddress } from './MultiVersionAddress'
import { LUMOS_MAINNET_CONFIG, LUMOS_TESTNET_CONFIG } from '../../../constants/scripts'
import { isMultiVersionAddress, isErr } from './types'
import styles from './styles.module.scss'

export const AddressToScript: React.FC = () => {
  const [address, setAddress] = useState('')
  const { t } = useTranslation()

  const parsed = useMemo<ParseResult | null>(() => {
    if (!address) return null
    const prefix = address.substring(0, 3)

    const config = prefix === 'ckb' ? LUMOS_MAINNET_CONFIG : LUMOS_TESTNET_CONFIG

    let script: Script
    try {
      script = parseAddress(address, { config })
    } catch {
      return { error: 'Invalid address' }
    }

    return parseMultiVersionAddress(script, config)
  }, [address])

  return (
    <div>
      <div>
        <input
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder={`${t('tools.please_enter')} CKB address`}
          className={styles.input}
        />
      </div>

      {isErr(parsed) && <div className={styles.console}>{parsed.error}</div>}
      {isMultiVersionAddress(parsed) && (
        <div className={styles.console}>
          <MultiVersionAddress displayName multiVersionAddr={parsed} />

          <div>
            <strong>Code Hash:</strong> <CopyableText>{parsed.script.codeHash}</CopyableText>
          </div>
          <div>
            <strong>Hash Type:</strong> <CopyableText>{parsed.script.hashType}</CopyableText>
          </div>
          <div>
            <strong>Args: </strong> <CopyableText>{parsed.script.args}</CopyableText>
          </div>
        </div>
      )}
    </div>
  )
}
