import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styles from './styles.module.scss'

export const whiteList = [
  // 'suspicious',
  // 'invalid',
  // 'out-of-length-range',
  'rgbpp-compatible',
  'rgb++',
  'layer-1-asset',
  'layer-2-asset',
  'supply-limited',
]

const NFTTag = ({ tagName, to }: { tagName: string; to?: string }) => {
  const { t } = useTranslation()
  const { push } = useHistory()

  let tag = tagName

  let content = t(`xudt.tags.${tag}`)
  if (['rgb++', 'rgbpp-compatible'].includes(tag)) {
    content = 'RGB++'
  }
  if (tag.startsWith('verified-on-')) {
    // FIXME: should be i18n
    content = content.replace('Platform', tag.replace('verified-on-', ''))
    tag = 'verified-on'
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

  return whiteList.includes(tagName) ? (
    <button
      type="button"
      className={classNames(styles.container, styles.normal)}
      data-type={tagName}
      onClick={handleClick}
    >
      {content}
    </button>
  ) : null
}

export default NFTTag
