import { useTranslation } from 'react-i18next'
import { Lumiflex } from 'uvcanvas'
import styles from './styles.module.scss'
import { IS_MAINNET } from '../../constants/common'
import { ReactComponent as Logo } from './rgbpp_logo.svg'

const words = ['UTXO', 'BTC', 'RGB++', 'UTXO', 'BTC', 'RGB++']

const RGBPP_EXPLORER_URL = IS_MAINNET ? 'https://explorer.rgbpp.io' : 'https://testnet.explorer.rgbpp.io'

const RgbppBanner = ({ path = '/' }) => {
  const [t] = useTranslation()

  return (
    <a
      href={`${RGBPP_EXPLORER_URL}${path}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.container}
      title={t('rgbpp.visit_this_item_on_rgbpp_explorer')}
    >
      <div className={styles.logo}>
        {t('rgbpp.visit')}
        <Logo />
        {t('rgbpp.rgbpp_explorer')}
      </div>
      <div className={styles.slogan}>
        <div className={styles.lumi}>
          <Lumiflex />
        </div>
        {t('rgbpp.explore_the')}
        <div className={styles.words}>
          {words.map((w, i) => {
            // eslint-disable-next-line react/no-array-index-key
            return <div key={w + i}>{w}</div>
          })}
        </div>
        {t(`rgbpp.ecosystem`)}
      </div>
    </a>
  )
}

RgbppBanner.displayName = 'RGB++ Banner'

export default RgbppBanner
