import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/RadioGroup'
import { parseMultiVersionAddress } from './parseMultiVersionAddress'
import { HashType } from '../../../constants/common'
import { MultiVersionAddress } from './MultiVersionAddress'
import { isMultiVersionAddress, isErr } from './types'
import styles from './styles.module.scss'

export const ScriptToAddress: React.FC = () => {
  const [codeHash, setCodeHash] = useState('')
  const [args, setArgs] = useState('')
  const [hashType, setHashType] = useState(HashType.TYPE)
  const { t } = useTranslation()

  const {
    data: parsed = {
      mainnet: undefined,
      testnet: undefined,
    },
  } = useQuery({
    queryKey: ['script_to_address', codeHash, hashType, args],
    queryFn: async () => {
      const [mainnet, testnet] = await Promise.all([
        parseMultiVersionAddress({ codeHash, hashType, args }, true),
        parseMultiVersionAddress({ codeHash, hashType, args }, false),
      ])

      return { mainnet, testnet }
    },
  })

  return (
    <div>
      <div>
        <input
          placeholder={`${t('tools.please_enter')} Code Hash`}
          className={styles.input}
          value={codeHash}
          onChange={e => setCodeHash(e.target.value)}
        />

        <div className={styles.radioWrapper}>
          <div>Hash Type</div>
          <RadioGroup
            className={styles.radioGroup}
            onValueChange={value => setHashType(value as HashType)}
            value={hashType}
          >
            {Object.values(HashType).map(hashType => (
              <div className={styles.radioItem} key={hashType}>
                <RadioGroupItem value={hashType} id={hashType} />
                <label htmlFor={hashType}>{hashType.toLowerCase()}</label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <input
          className={styles.input}
          placeholder={`${t('tools.please_enter')} Args`}
          value={args}
          onChange={e => setArgs(e.target.value)}
        />
      </div>

      {args !== '' && codeHash !== '' && (
        <div className={styles.console} style={{ marginBottom: 16 }}>
          <h2>Mainnet</h2>
          {isErr(parsed.mainnet) && <>{parsed.mainnet.error}</>}
          {isMultiVersionAddress(parsed.mainnet) && (
            <MultiVersionAddress displayName multiVersionAddr={parsed.mainnet} />
          )}
        </div>
      )}

      {args !== '' && codeHash !== '' && (
        <div className={styles.console} style={{ marginBottom: 16 }}>
          <h2>Testnet</h2>
          {isErr(parsed.testnet) && <>{parsed.testnet.error}</>}
          {isMultiVersionAddress(parsed.testnet) && (
            <MultiVersionAddress displayName multiVersionAddr={parsed.testnet} />
          )}
        </div>
      )}
    </div>
  )
}
