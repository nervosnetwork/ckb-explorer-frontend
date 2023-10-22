import { useLanguageText, useOtherLanguageText, useToggleLanguage } from '../../../utils/i18n'
import { LanguagePanel } from './styled'
import SimpleButton from '../../SimpleButton'

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const toggleLanguage = useToggleLanguage()
  const hideDropdown = () => {
    setShow(false)
  }
  const handleLanguage = () => {
    hideDropdown()
    toggleLanguage()
  }
  return (
    <LanguagePanel left={left} top={top} onMouseLeave={hideDropdown}>
      <SimpleButton className="languageSelected" onClick={hideDropdown}>
        {useLanguageText()}
      </SimpleButton>
      <div className="languageSeparate" />
      <SimpleButton className="languageNormal" onClick={handleLanguage}>
        {useOtherLanguageText()}
      </SimpleButton>
    </LanguagePanel>
  )
}
