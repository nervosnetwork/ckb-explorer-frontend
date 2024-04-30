import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrentLanguage, SupportedLngs, useChangeLanguage } from '../../../utils/i18n'
import CommonModal from '../../CommonModal'
import CommonSelect from '../../CommonSelect'
import CloseIcon from '../../../assets/modal_close.png'
import styles from './style.module.scss'

export const LanguageModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const currentLanguage = useCurrentLanguage()
  const { changeLanguage } = useChangeLanguage()

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng)
  }

  return (
    <CommonModal isOpen onClose={onClose}>
      <div ref={ref} className={styles.modalWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.modalTitle}>
            <p>{t('navbar.language')}</p>
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              <img src={CloseIcon} alt="close icon" />
            </button>
          </div>

          <div className={styles.modalContent}>
            <CommonSelect
              className={styles.languageSelect}
              options={SupportedLngs.map(lng => ({
                value: lng,
                label: t(`navbar.language_${lng}`),
              }))}
              onChange={handleLanguageChange}
              defaultValue={currentLanguage}
            />
          </div>

          <button type="button" className={styles.doneBtn} onClick={onClose}>
            {t('nervos_dao.done')}
          </button>
        </div>
      </div>
    </CommonModal>
  )
}
