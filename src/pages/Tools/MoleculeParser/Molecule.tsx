/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react'
import { createParser } from '@ckb-lumos/molecule'
import { blockchainSchema, builtinCodecs, mergeBuiltinCodecs } from './constants'
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/Alert'
import styles from './styles.module.scss'

type Props = {
  updateCodecMap: (token: any) => void
}

export const Molecule: React.FC<Props> = ({ updateCodecMap }) => {
  const [showAlert, setShowAlert] = React.useState(false)
  const [parseErrorMsg, setParseErrorMsg] = React.useState<string>('')
  const [inputMol, setInputMol] = useState('')
  const [parseSuccess, setParseSuccess] = useState(false)

  const handleConfirm = () => {
    const parser = createParser()
    try {
      // get user input schema, and append with primitive schema
      const userCodecMap = parser.parse(inputMol + blockchainSchema, { refs: builtinCodecs })
      const codecMap = mergeBuiltinCodecs(userCodecMap)

      setParseSuccess(true)
      setShowAlert(true)
      setParseErrorMsg('')
      updateCodecMap(codecMap)
    } catch (error: any) {
      setParseSuccess(false)
      setShowAlert(true)
      setParseErrorMsg(error.message)
      updateCodecMap({})
      console.error('error is:', error)
    }
  }
  const handleChange = (e: any) => {
    setInputMol(e.target.value)
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div className={styles.field} style={{ marginBottom: 16 }}>
        <label htmlFor="input-schema">Input schema(mol)</label>
        <div className={styles.content}>
          <textarea
            id="input-schema"
            value={inputMol}
            onChange={handleChange}
            placeholder="e.g. vector OutPointVec <OutPoint>;"
          />
        </div>

        {showAlert && (
          <Alert variant={parseSuccess ? 'default' : 'destructive'}>
            <AlertTitle>{parseSuccess ? 'Success!' : 'Error!'}</AlertTitle>
            <AlertDescription>
              {parseSuccess ? 'Molecule successfully parsed! You can select a schema now.' : parseErrorMsg}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={handleConfirm}>
          Parse!
        </button>
      </div>
    </div>
  )
}
