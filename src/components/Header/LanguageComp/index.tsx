import { useState, useLayoutEffect, FC } from 'react'
import i18n, { currentLanguage, changeLanguage } from '../../../utils/i18n'
import { HeaderLanguagePanel, MobileSubMenuPanel } from './styled'
import SimpleButton from '../../SimpleButton'
import WhiteDropdownIcon from '../../../assets/white_dropdown.png'
import WhiteDropUpIcon from '../../../assets/white_drop_up.png'
import BlueDropUpIcon from '../../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../../assets/green_drop_up.png'
import { isMainnet } from '../../../utils/chain'
import LanDropdown, { languageText } from '../../Dropdown/Language'

const getDropdownIcon = (showDropdown: boolean) => {
  if (!showDropdown) return WhiteDropdownIcon
  return isMainnet() ? GreenDropUpIcon : BlueDropUpIcon
}

export const LanguageDropdown = () => {
  const [showLanguage, setShowLanguage] = useState(false)
  const [languageLeft, setLanguageLeft] = useState(0)
  const [languageTop, setLanguageTop] = useState(0)

  useLayoutEffect(() => {
    if (showLanguage) {
      const languageDropdownComp = document.getElementById('header__language__panel')
      if (languageDropdownComp) {
        const languageDropdownReact = languageDropdownComp.getBoundingClientRect()
        if (languageDropdownReact) {
          setLanguageLeft(languageDropdownReact.left + (currentLanguage() === 'en' ? -15 : 3))
          setLanguageTop(languageDropdownReact.bottom - 3)
        }
      }
    }
  }, [showLanguage])

  return (
    <HeaderLanguagePanel
      id="header__language__panel"
      showLanguage={showLanguage}
      onMouseLeave={() => {
        setShowLanguage(false)
      }}
    >
      <SimpleButton
        className="headerLanguageFlag"
        onMouseOver={() => {
          setShowLanguage(true)
        }}
      >
        <div className="headerLanguageContentPanel">
          <div className="headerLanguageContent">{languageText(currentLanguage())}</div>
          <img src={getDropdownIcon(showLanguage)} alt="dropdown icon" />
        </div>
      </SimpleButton>
      {showLanguage && <LanDropdown setShow={setShowLanguage} left={languageLeft} top={languageTop} />}
    </HeaderLanguagePanel>
  )
}

export const LanguageMenu: FC<{ hideMobileMenu: () => void }> = ({ hideMobileMenu }) => {
  const [showSubMenu, setShowSubMenu] = useState(false)

  return (
    <MobileSubMenuPanel showSubMenu={false}>
      <SimpleButton
        className="mobileMenusMainItem"
        onClick={() => {
          setShowSubMenu(!showSubMenu)
        }}
      >
        <div className="mobileMenusMainItemContent">
          {currentLanguage() === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')}
        </div>
        <img
          className="mobileMenusMainItemIcon"
          alt="mobile language icon"
          src={showSubMenu ? WhiteDropUpIcon : WhiteDropdownIcon}
        />
      </SimpleButton>
      {showSubMenu && (
        <>
          <SimpleButton
            className="mobileMenusSubItem"
            onClick={() => {
              hideMobileMenu()
            }}
          >
            {currentLanguage() === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')}
          </SimpleButton>
          <SimpleButton
            className="mobileMenusSubItem"
            onClick={() => {
              changeLanguage(currentLanguage() === 'en' ? 'zh' : 'en')
              hideMobileMenu()
            }}
          >
            {currentLanguage() === 'en' ? i18n.t('navbar.language_zh') : i18n.t('navbar.language_en')}
          </SimpleButton>
        </>
      )}
    </MobileSubMenuPanel>
  )
}
