import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { SupportedLngs } from '../../../utils/i18n'
import { LanguagePanel } from './styled'
import { Link } from '../../Link'

export default ({ setShow, left, top }: { setShow: Function; left: number; top: number }) => {
  const { t } = useTranslation()
  const hideDropdown = () => setShow(false)

  return (
    <LanguagePanel left={left} top={top} onMouseLeave={hideDropdown}>
      {SupportedLngs.map((lng, idx) => (
        <Fragment key={lng}>
          {idx !== 0 && <div className="languageSeparate" />}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link className="languageNormal" lng={lng} onClick={hideDropdown}>
            {t(`navbar.language_${lng}`)}
          </Link>
        </Fragment>
      ))}
    </LanguagePanel>
  )
}
