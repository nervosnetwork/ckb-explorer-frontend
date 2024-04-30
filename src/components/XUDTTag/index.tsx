import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'

const XUDTTag = ({ tagName }: { tagName: string }) => {
  const { t } = useTranslation()
  let tag = tagName
  let content = t(`xudt.${tag}`)
  if (tag.startsWith('verified-on-')) {
    content = content.replace('Platform', tag.replace('verified-on-', ''))
    tag = 'verified-on'
  }
  return (
    <div className={classNames(styles.container, styles.normal)} data-type={tagName}>
      <span>{content}</span>
    </div>
  )
}

export default XUDTTag
