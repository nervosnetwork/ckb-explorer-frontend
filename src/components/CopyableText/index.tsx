import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CopyIcon } from './copy.svg'
import { useSetToast } from '../Toast'
import styles from './styles.module.scss'

const CopyableText: FC<{
  children: string
}> = ({ children: text }) => {
  const { t } = useTranslation()
  const setToast = useSetToast()

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const { detail } = e.currentTarget.dataset
    if (!detail) return
    navigator.clipboard.writeText(detail).then(() => {
      setToast({ message: t('common.copied') })
    })
  }

  const content = (
    <>
      {text}

      <button type="button" className={styles.copy} onClick={handleCopy} data-detail={text}>
        <CopyIcon />
      </button>
    </>
  )

  return content
}

export default CopyableText
