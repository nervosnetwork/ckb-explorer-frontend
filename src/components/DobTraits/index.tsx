import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { Dob } from '../../services/DobsService'
import styles from './index.module.scss'

const HIDDEN_KEY = ['prev.type', 'prev.bg', 'prev.bgcolor', 'asset', 'media_type', 'protocol']

const DobTraits: FC<{ dob: Dob }> = ({ dob }) => {
  const { t } = useTranslation()
  const keys = [...Object.keys(dob)].filter(k => !HIDDEN_KEY.includes(k))
  if (!keys.length) return <div>{t('nft.no-traits')}</div>
  return (
    <div className={styles.container}>
      {keys.map(key => {
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
