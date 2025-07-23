import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ToolsContainer from '../ToolsContainer'
import { DataInput } from './DataInput'
import { Molecule } from './Molecule'
import { SchemaSelect } from './SchemaSelect'
import { CodecMap, builtinCodecs, mergeBuiltinCodecs } from './constants'
import styles from '../styles.module.scss'

export const MoleculeParser: React.FC = () => {
  const { t } = useTranslation()
  const [codecMap, setCodecMap] = useState<CodecMap>({})
  const [selectedCodecName, setSelectedCodecName] = useState<string>('')
  const handleCodecMap = useCallback(
    (codecMap: CodecMap) => {
      setCodecMap(codecMap)
      setSelectedCodecName(Object.keys(codecMap)[0])
    },
    [setCodecMap, setSelectedCodecName],
  )

  const handleSelectCodec = (name: string) => {
    setSelectedCodecName(name)
  }

  useEffect(() => {
    const codecMap = mergeBuiltinCodecs(builtinCodecs)
    handleCodecMap(codecMap)
  }, [handleCodecMap])

  return (
    <ToolsContainer>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>{t('tools.molecule_parser')}</div>
        <div style={{ marginBottom: 16 }}>
          <a
            className={styles.link}
            href="https://github.com/nervosnetwork/rfcs/blob/e419bb7ea79ebf996a104b1a7e844c792c8ab3c5/rfcs/0008-serialization/0008-serialization.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rfc-008
          </a>
          &nbsp; has defined the data serialization standard on CKB. This tool provides an online decoder for serialized
          data with known schemas. Since it is very commonly used on chain, we have added{' '}
          <a
            className={styles.link}
            href="https://github.com/nervosnetwork/ckb/blob/5a7efe7a0b720de79ff3761dc6e8424b8d5b22ea/util/types/schemas/blockchain.mol"
            target="_blank"
            rel="noopener noreferrer"
          >
            blockchain.mol
          </a>
          &nbsp; as built-in schemas to this tool.
        </div>

        <Molecule updateCodecMap={handleCodecMap} />
        {Object.keys(codecMap).length > 0 && (
          <SchemaSelect selectedCodecName={selectedCodecName} codecMap={codecMap} onSelectCodec={handleSelectCodec} />
        )}
        {Object.keys(codecMap).length > 0 && selectedCodecName !== '' && (
          <DataInput codec={codecMap[selectedCodecName]} />
        )}
      </div>
    </ToolsContainer>
  )
}

export default MoleculeParser
