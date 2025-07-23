import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { useQuery } from '@tanstack/react-query'
import { parseMultiVersionAddress } from './parseMultiVersionAddress'
import CopyableText from '../../../components/CopyableText'
import { MultiVersionAddress } from './MultiVersionAddress'
import { isMultiVersionAddress, isErr } from './types'
import styles from './styles.module.scss'

export const AddressToScript: React.FC = () => {
  const [address, setAddress] = useState('')
  const { t } = useTranslation()
  const { data: parsed } = useQuery({
    queryKey: ['address_to_script', address],
    queryFn: () => {
      if (!address) return null
      const prefix = address.substring(0, 3)
      const isMainnet = prefix === 'ckb'

      let script: CKBComponents.Script
      try {
        script = addressToScript(address)
      } catch {
        return { error: 'Invalid address' }
      }

      return parseMultiVersionAddress(script, isMainnet)
    },
  })

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
