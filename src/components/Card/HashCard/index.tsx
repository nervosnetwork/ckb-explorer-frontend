import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import CopyIcon from '../../../assets/copy.png'
import i18n from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { v2AxiosIns } from '../../../service/http/fetcher'
import { copyElementValue } from '../../../utils/util'
import { AppActions } from '../../../contexts/actions'
import SmallLoading from '../../Loading/SmallLoading'
import { useDispatch } from '../../../contexts/providers'
import { useNewAddr, useDeprecatedAddr } from '../../../utils/hook'
import SimpleButton from '../../SimpleButton'
import { ReactComponent as OpenInNew } from '../../../assets/open_in_new.svg'
import { ReactComponent as DownloadIcon } from '../../../assets/download_tx.svg'
import { HashCardPanel, LoadingPanel } from './styled'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'
import { useDASAccount } from '../../../contexts/providers/dasQuery'

const DASInfo: FC<{ address: string }> = ({ address }) => {
  const alias = useDASAccount(address)

  if (alias == null) return null

  return (
    <Tooltip placement="top" title={alias}>
      <a className={styles.dasAccount} href={`https://data.did.id/${alias}`} target="_blank" rel="noreferrer">
        <img src={`https://display.did.id/identicon/${alias}`} alt={alias} />
        <span>{alias}</span>
      </a>
    </Tooltip>
  )
}

export default ({
  title,
  hash,
  loading,
  specialAddress = '',
  iconUri,
  children,
  showDASInfoOnHeader,
}: {
  title: string
  hash: string
  loading?: boolean
  specialAddress?: string
  iconUri?: string
  children?: ReactNode
  showDASInfoOnHeader?: boolean
}) => {
  const dispatch = useDispatch()

  const isTx = i18n.t('transaction.transaction') === title
  const newAddr = useNewAddr(hash)
  const deprecatedAddr = useDeprecatedAddr(hash)
  const counterpartAddr = newAddr === hash ? deprecatedAddr : newAddr

  const handleExportTxClick = async () => {
    const res = await v2AxiosIns(`transactions/${hash}/raw`).catch(error => {
      dispatch({
        type: AppActions.ShowToastMessage,
        payload: {
          message: error.message,
        },
      })
    })
    if (!res) return

    const blob = new Blob([JSON.stringify(res.data, null, 2)])

    const link = document.createElement('a')
    link.download = `tx-${hash}.json`
    link.href = URL.createObjectURL(blob)
    document.body.append(link)
    link.click()
    link.remove()
  }

  return (
    <HashCardPanel isColumn={!!iconUri}>
      <div className="hash__card__content__panel" id="hash_content">
        {iconUri && isMobile() ? (
          <div>
            <img className="hash__icon" src={iconUri} alt="hash icon" />
            <div className="hash__title">{title}</div>
          </div>
        ) : (
          <>
            {iconUri && <img className="hash__icon" src={iconUri} alt="hash icon" />}
            <div className="hash__title">{title}</div>
          </>
        )}

        <div className={styles.hashCardHeaderRight}>
          <div className="hash__card__hash__content">
            {loading ? (
              <LoadingPanel>
                <SmallLoading />
              </LoadingPanel>
            ) : (
              <div id="hash__text">
                <AddressText disableTooltip>{hash}</AddressText>
              </div>
            )}
            <SimpleButton
              className="hash__copy_icon"
              onClick={() => {
                copyElementValue(document.getElementById('hash__value'))
                dispatch({
                  type: AppActions.ShowToastMessage,
                  payload: {
                    message: i18n.t('common.copied'),
                  },
                })
              }}
            >
              {!loading && <img src={CopyIcon} alt="copy" />}
            </SimpleButton>
            {counterpartAddr ? (
              <Tooltip
                placement="top"
                title={i18n.t(`address.${newAddr === hash ? 'visit-deprecated-address' : 'view-new-address'}`)}
              >
                <a
                  href={`${window.location.href.split('/address/')[0]}/address/${counterpartAddr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openInNew}
                >
                  <OpenInNew />
                </a>
              </Tooltip>
            ) : null}
            {isTx ? (
              <Tooltip placement="top" title={i18n.t(`transaction.export-transaction`)}>
                <button className={styles.exportTx} onClick={handleExportTxClick} type="button">
                  <DownloadIcon />
                </button>
              </Tooltip>
            ) : null}
          </div>

          {showDASInfoOnHeader && <DASInfo address={hash} />}
        </div>

        {specialAddress && (
          <Tooltip title={i18n.t('address.vesting_tooltip')} placement={isMobile() ? 'bottomRight' : 'bottom'}>
            <Link to={`/address/${specialAddress}`} className="hash__vesting">
              {i18n.t('address.vesting')}
            </Link>
          </Tooltip>
        )}
        <div id="hash__value" className="monospace">
          {hash}
        </div>
      </div>
      {children}
    </HashCardPanel>
  )
}
