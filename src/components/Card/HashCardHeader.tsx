import { ComponentProps, FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import styles from './HashCardHeader.module.scss'
import { ReactComponent as CopyIcon } from './copy.svg'
import AddressText from '../AddressText'
import { useIsMobile } from '../../hooks'
import SimpleButton from '../SimpleButton'
import { useSetToast } from '../Toast'

interface HashCardHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode
  hash: string
  customActions?: ReactNode[]
  rightContent?: ReactNode
}

export const HashCardHeader: FC<HashCardHeaderProps> = ({ title, hash, customActions, rightContent, ...elProps }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const setToast = useSetToast()

  // TODO: SimpleButton may not be necessary.
  const copyAction = (
    <SimpleButton
      className={styles.copyAction}
      onClick={() => {
        navigator.clipboard.writeText(hash)
        setToast({ message: t('common.copied') })
      }}
    >
      <CopyIcon />
    </SimpleButton>
  )

  const actions: ReactNode[] = [hash && copyAction, ...(customActions ?? [])].filter(v => v)

  const hashFontClass = isMobile ? styles.small : ''

  return (
    <div {...elProps} className={classNames(styles.hashCardHeader, elProps.className)}>
      <div className={styles.left}>
        {title && <div className={styles.title}>{title}</div>}

        {/* `hash__text` may be a historical legacy unused ID. */}
        <div id="hash__text" className={classNames(styles.hash, hashFontClass)}>
          <AddressText disableTooltip fontKey={hashFontClass}>
            {hash}
          </AddressText>
        </div>

        <div className={styles.actions}>
          {actions.map((action, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={idx} className={styles.action}>
              {action}
            </div>
          ))}
        </div>
      </div>

      {rightContent}
    </div>
  )
}
