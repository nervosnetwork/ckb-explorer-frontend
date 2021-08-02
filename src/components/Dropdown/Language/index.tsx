import i18n, { currentLanguage, changeLanguage } from '../../../utils/i18n'
import { useDispatch } from '../../../contexts/providers'
import { AppActions } from '../../../contexts/actions'
import { LanguagePanel } from './styled'
import SimpleButton from '../../SimpleButton'

export const languageText = (lan: 'en' | 'zh' | null, reverse?: boolean) => {
  if (reverse) {
    return lan === 'zh' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')
  }
  return lan === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')
}

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const dispatch = useDispatch()
  const hideDropdown = () => {
    setShow(false)
  }
  const handleLanguage = () => {
    hideDropdown()
    changeLanguage(currentLanguage() === 'en' ? 'zh' : 'en')
    dispatch({
      type: AppActions.UpdateAppLanguage,
      payload: {
        language: currentLanguage() === 'en' ? 'zh' : 'en',
      },
    })
  }
  return (
    <LanguagePanel left={left} top={top} onMouseLeave={hideDropdown}>
      <SimpleButton className="language__selected" onClick={hideDropdown}>
        {languageText(currentLanguage())}
      </SimpleButton>
      <div className="language__separate" />
      <SimpleButton className="language__normal" onClick={handleLanguage}>
        {languageText(currentLanguage(), true)}
      </SimpleButton>
    </LanguagePanel>
  )
}
