import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styles from './styles.module.scss'

const HIDDEN_TAGS = ['duplicate', 'suspicious', 'utility', 'supply-unlimited', 'out-of-length-range']

const XUDTTag = ({ tagName, to }: { tagName: string; to?: string }) => {
  const { t } = useTranslation()
  const { push } = useHistory()

  // FIXME: the tag should be updated in the backend
  if (HIDDEN_TAGS.includes(tagName)) return null

  let tag = tagName
  let content = t(`xudt.tags.${tag}`)
  if (tag.startsWith('verified-on-')) {
    // FIXME: should be i18n
    content = content.replace('Platform', tag.replace('verified-on-', ''))
    tag = 'verified-on'
  }

  // FIXME: data should be updated in the backend
  // issue: https://github.com/Magickbase/ckb-explorer-public-issues/issues/754
  if (tag === 'rgb++' || tag === 'rgbpp-compatible') {
    content = 'RGB++'
  }

  const handleClick = () => {
    const search = new URLSearchParams(window.location.search)
    const tags = search.get('tags')?.split(',') ?? []
    if (tags.includes(tag)) {
      const newTags = tags.filter(t => t !== tag)
      if (newTags.length) {
        search.set('tags', newTags.join(','))
      } else {
        search.delete('tags')
      }
    } else {
      search.set('tags', [...tags, tag].join(','))
    }
    push(`${to ?? window.location.pathname}?${search}`)
  }

  return (
    <button
      type="button"
      className={classNames(styles.container, styles.normal)}
      data-type={tagName}
      onClick={handleClick}
    >
      {content}
    </button>
  )
}

export default XUDTTag
