import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import CopyIcon from '../../../assets/copy.png'
import { explorerService } from '../../../services/ExplorerService'
import SmallLoading from '../../Loading/SmallLoading'
import { useIsMobile, useNewAddr, useDeprecatedAddr } from '../../../utils/hook'
import SimpleButton from '../../SimpleButton'
import { ReactComponent as OpenInNew } from '../../../assets/open_in_new.svg'
import { ReactComponent as DownloadIcon } from '../../../assets/download_tx.svg'
import { HashCardPanel, LoadingPanel } from './styled'
import styles from './styles.module.scss'
import AddressText from '../../AddressText'
import { useDASAccount } from '../../../contexts/providers/dasQuery'
import { useSetToast } from '../../Toast'

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
  showDASInfoOnHeader?: boolean | string
}) => {
  const isMobile = useIsMobile()
  const setToast = useSetToast()
  const { t } = useTranslation()

  const isTx = t('transaction.transaction') === title
  const newAddr = useNewAddr(hash)
  const deprecatedAddr = useDeprecatedAddr(hash)
  const counterpartAddr = newAddr === hash ? deprecatedAddr : newAddr

  const handleExportTxClick = async () => {
    const res = await explorerService.api.requesterV2(`transactions/${hash}/raw`).catch(error => {
      setToast({ message: error.message })
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
      <div className="hashCardContentPanel" id="hash_content">
        {iconUri && isMobile ? (
          <div>
            <img className="hashIcon" src={iconUri} alt="hash icon" />
            <div className="hashTitle">{title}</div>
          </div>
        ) : (
          <>
            {iconUri && <img className="hashIcon" src={iconUri} alt="hash icon" />}
            <div className="hashTitle">{title}</div>
          </>
        )}

        <div className={styles.hashCardHeaderRight}>
          <div className="hashCardHashContent">
            {loading ? (
              <LoadingPanel>
                <SmallLoading />
              </LoadingPanel>
            ) : (
              <div id="hash__text">
                <AddressText disableTooltip fontKey={isMobile}>
                  {hash}
                </AddressText>
              </div>
            )}
            <SimpleButton
              className="hashCopyIcon"
              onClick={() => {
                navigator.clipboard.writeText(hash)
                setToast({ message: t('common.copied') })
              }}
            >
              {!loading && <img src={CopyIcon} alt="copy" />}
            </SimpleButton>
            {counterpartAddr ? (
              <Tooltip
                placement="top"
                title={t(`address.${newAddr === hash ? 'visit-deprecated-address' : 'view-new-address'}`)}
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
              <Tooltip placement="top" title={t(`transaction.export-transaction`)}>
                <button className={styles.exportTx} onClick={handleExportTxClick} type="button">
                  <DownloadIcon />
                </button>
              </Tooltip>
            ) : null}
          </div>

          {(showDASInfoOnHeader || showDASInfoOnHeader === '') && (
            <DASInfo address={typeof showDASInfoOnHeader === 'string' ? showDASInfoOnHeader : hash} />
          )}
        </div>

        {specialAddress && (
          <Tooltip title={t('address.vesting_tooltip')} placement={isMobile ? 'bottomRight' : 'bottom'}>
            <Link to={`/address/${specialAddress}`} className="hashVesting">
              {t('address.vesting')}
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
