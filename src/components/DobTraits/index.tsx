import type { FC } from 'react'
import type { Dob } from '../../services/DobsService'
import styles from './index.module.scss'

const HIDDEN_KEY = ['prev.type', 'prev.bg', 'prev.bgcolor', 'asset', 'media_type', 'protocol']

const DobTraits: FC<{ dob: Dob }> = ({ dob }) => {
  return (
    <div className={styles.container}>
      {[...Object.keys(dob)].map(key => {
        if (HIDDEN_KEY.includes(key)) return null
        return (
          <dl key={key}>
            <dt>{key}</dt>
            <dd title={dob[key]}>{dob[key]}</dd>
          </dl>
        )
      })}
    </div>
  )
}

export default DobTraits
