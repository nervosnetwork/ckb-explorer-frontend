import React, { useCallback, useState } from 'react'
import { createParser } from '@ckb-lumos/molecule'
import { HelpTip } from '../../../components/HelpTip'
import { blockchainSchema, builtinCodecs, mergeBuiltinCodecs } from './constants'
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/Alert'
import styles from './styles.module.scss'

type Props = {
  updateCodecMap: (token: any) => void
}

export const Molecule: React.FC<Props> = ({ updateCodecMap }) => {
  const [showAlert, setShowAlert] = React.useState(false)
  const [inputMol, setInputMol] = useState('')
  const [parseErrorMsg, setParseErrorMsg] = React.useState<string>('')
  const [parseSuccess, setParseSuccess] = useState(false)

  const handleConfirm = useCallback(() => {
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
  }, [inputMol, setParseErrorMsg, setShowAlert, setParseSuccess, updateCodecMap])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMol(e.currentTarget.value)
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div className={styles.field} style={{ marginBottom: 16 }}>
        <label htmlFor="input-schema">
          Input schema(mol)
          <HelpTip title="Uint8/16/.../512, Byte32, BytesVec, Bytes, BytesVec, BytesOpt are used as primitive schemas, please do not override." />
        </label>
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
