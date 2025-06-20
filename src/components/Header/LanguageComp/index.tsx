import { useState, FC } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './style.module.scss'
import SimpleButton from '../../SimpleButton'
import WhiteDropdownIcon from '../../../assets/white_dropdown.png'
import WhiteDropUpIcon from './white_drop_up.png'
import { SupportedLngs, useLanguageText } from '../../../utils/i18n'
import { Link } from '../../Link'

export const LanguageMenu: FC<{ hideMobileMenu: () => void }> = ({ hideMobileMenu }) => {
  const { t } = useTranslation()
  const [showSubMenu, setShowSubMenu] = useState(false)
  const currentLanguageText = useLanguageText()

  return (
    <div className={styles.mobileSubMenuPanel}>
      <SimpleButton
        className="mobileMenusMainItem"
        onClick={() => {
          setShowSubMenu(!showSubMenu)
        }}
      >
        <div className="mobileMenusMainItemContent">{currentLanguageText}</div>
        <img
          className="mobileMenusMainItemIcon"
          alt="mobile language icon"
          src={showSubMenu ? WhiteDropUpIcon : WhiteDropdownIcon}
        />
      </SimpleButton>
      {showSubMenu &&
        SupportedLngs.map(lng => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link key={lng} className="mobileMenusSubItem" lng={lng} onClick={hideMobileMenu}>
            {t(`navbar.language_${lng}`)}
          </Link>
        ))}
    </div>
  )
}
