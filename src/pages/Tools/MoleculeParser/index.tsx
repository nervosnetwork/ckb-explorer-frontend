/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CodecMap } from '@ckb-lumos/molecule'
import { HelpTip } from '../../../components/HelpTip'
import ToolsContainer from '../ToolsContainer'
import { DataInput } from './DataInput'
import { Molecule } from './Molecule'
import { SchemaSelect } from './SchemaSelect'
import styles from '../styles.module.scss'

export const MoleculeParser: React.FC = () => {
  const { t } = useTranslation()
  const [codecMap, setCodecMap] = useState<CodecMap>({})
  const [selectedCodecName, setSelectedCodecName] = useState<string>('')
  const handleCodecMap = (codecMap: CodecMap) => {
    setCodecMap(codecMap)
    setSelectedCodecName(Object.keys(codecMap)[0])
  }

  const handleSelectCodec = (name: string) => {
    setSelectedCodecName(name)
  }

  return (
    <ToolsContainer>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>{t('tools.molecule_parser')}</div>
        <div style={{ marginBottom: 16 }}>
          <a
            className={styles.link}
            href="https://github.com/nervosnetwork/rfcs/blob/e419bb7ea79ebf996a104b1a7e844c792c8ab3c5/rfcs/0008-serialization/0008-serialization.md"
            target="_blank"
            rel="noreferrer"
          >
            Rfc-008
          </a>{' '}
          has defined the data serialization standard on CKB. This tool provides an online decoder for serialized data
          with known schemas. Since it is very commonly used on chain, we have added{' '}
          <a
            className={styles.link}
            href="https://github.com/nervosnetwork/ckb/blob/5a7efe7a0b720de79ff3761dc6e8424b8d5b22ea/util/types/schemas/blockchain.mol"
            target="_blank"
            rel="noreferrer"
          >
            blockchain.mol
          </a>{' '}
          as built-in schemas to this tool.
          <HelpTip title="Uint8/16...512,Byte32,BytesVec,Bytes,BytesVec,BytesOpt are used as primitive schemas, please do not override." />
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
