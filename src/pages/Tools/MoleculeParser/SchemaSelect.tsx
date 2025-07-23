import React from 'react'
import { CodecMap } from './constants'
import CommonSelect from '../../../components/CommonSelect'
import styles from './styles.module.scss'

type Props = {
  codecMap: CodecMap
  selectedCodecName: string
  onSelectCodec: (name: string) => void
}

const createCodecOptionsFromMap = (codecMap: CodecMap): string[] => {
  return Object.keys(codecMap)
}

export const SchemaSelect: React.FC<Props> = ({ onSelectCodec, selectedCodecName, codecMap }) => {
  const handleChange = (newValue: string | null) => {
    onSelectCodec(newValue as string)
  }
  const top100Films = createCodecOptionsFromMap(codecMap).map(film => ({
    label: film,
    value: film,
  }))

  return (
    <div className={styles.field} style={{ marginBottom: 16 }}>
      <label>Select schema(mol)</label>
      <CommonSelect value={selectedCodecName} options={top100Films} onChange={value => handleChange(value)} />
    </div>
  )
}
