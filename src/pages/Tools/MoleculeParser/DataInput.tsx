/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react'
import { BytesCodec } from '@ckb-lumos/codec/lib/base'
import { JSONTree } from 'react-json-tree'
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/Alert'
import styles from './styles.module.scss'

export type UnpackType = string | number | undefined | { [property: string]: UnpackType } | UnpackType[]

type Props = {
  codec: BytesCodec | undefined
}

const formatInput = (input: string): string => {
  if (!input.startsWith('0x')) {
    return `0x${input}`
  }
  return input
}

const isBlank = (data: UnpackType): boolean => {
  if (!data) {
    return true
  }
  return false
}

export const DataInput: React.FC<Props> = ({ codec }) => {
  const [inputData, setInputData] = useState<string>('')
  const [result, setResult] = useState<UnpackType>(undefined)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleDecode = () => {
    if (!codec) {
      setErrorMsg('please select codec')
      return
    }
    try {
      const result = codec.unpack(formatInput(inputData))
      setResult(result)
      setErrorMsg('')
    } catch (error: unknown) {
      setResult(undefined)
      setErrorMsg((error as Error).message)
    }
  }
  const handleChange = (e: any) => {
    setInputData(e.target.value)
  }
  return (
    <div>
      <div className={styles.field} style={{ marginBottom: 16 }}>
        <label htmlFor="input-data">Input data</label>
        <div className={styles.content}>
          <textarea id="input-data" value={inputData} onChange={handleChange} placeholder="0x..." />
        </div>
      </div>

      <div className={styles.actions} style={{ marginBottom: 16 }}>
        <button type="button" onClick={handleDecode}>
          Decode!
        </button>
      </div>

      {!isBlank(result) && <div>{typeof result === 'object' ? <JSONTree data={result} /> : result}</div>}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
