import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCKBNode } from '../../../hooks/useCKBNode'
import CommonModal from '../../CommonModal'
import { HelpTip } from '../../HelpTip'
import { Switch } from '../../ui/Switch'
import CloseIcon from '../../../assets/modal_close.png'
import styles from './style.module.scss'

export const CKBNodeModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { isActivated, setIsActivated } = useCKBNode()

  return (
    <CommonModal isOpen onClose={onClose}>
      <div ref={ref} className={styles.modalWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.modalTitle}>
            <p>{t('navbar.node')}</p>
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              <img src={CloseIcon} alt="close icon" />
            </button>
          </div>

          <div className={styles.switcher}>
            <label htmlFor="node-connect-mode">{t('node.node_connect_mode')}</label>
            <HelpTip title={t('node.node_connect_tooltip')} />
            <Switch
              id="node-connect-mode"
              style={{ marginLeft: 'auto' }}
              checked={isActivated}
              onCheckedChange={checked => setIsActivated(checked)}
            />
          </div>

          <button type="button" className={styles.doneBtn} onClick={onClose}>
            {t('node.done')}
          </button>
        </div>
      </div>
    </CommonModal>
  )
}
