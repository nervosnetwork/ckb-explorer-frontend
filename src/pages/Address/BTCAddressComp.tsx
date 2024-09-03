import { useState, FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { AddressAssetsTab, AddressAssetsTabPane, AddressAssetsTabPaneTitle, AddressUDTAssetsPanel } from './styled'
import styles from './styles.module.scss'
import { Address, UDTAccount } from '../../models/Address'
import { Card } from '../../components/Card'
import Cells from './Cells'
import RgbppAssets from './RgbppAssets'
import { explorerService } from '../../services/ExplorerService'
// import RgbppAssets from './RgbppAssets'

enum AssetInfo {
  CELLs,
  RGBPP,
  Invalid,
}

export const BTCAddressOverviewCard: FC<{ address: Address }> = ({ address }) => {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<AssetInfo>(AssetInfo.RGBPP)

  const { data } = useQuery(['bitcoin addresses', address], () =>
    explorerService.api.fetchBitcoinAddresses(address.bitcoinAddressHash || ''),
  )
  const { boundLiveCellsCount, unboundLiveCellsCount } = data || { boundLiveCellsCount: 0, unboundLiveCellsCount: 0 }

  const { data: udtAccounts } = useQuery(
    ['bitcoin address udt accounts', address],
    async () => {
      const data = await explorerService.api.fetchUDTAccountsByBtcAddress(address.bitcoinAddressHash || '')
      return data.udtAccounts
    },
    {
      initialData: [],
    },
  )

  const [udts, inscriptions] = udtAccounts.reduce(
    (acc, cur) => {
      switch (cur?.udtType) {
        case 'sudt':
        case 'did_cell':
        case 'spore_cell':
        case 'm_nft_token':
        case 'cota':
        case 'nrc_721_token':
          acc[0].push(cur)
          break
        case 'xudt_compatible':
        case 'xudt':
          if (cur.amount !== '0') {
            acc[0].push(cur)
          }
          break
        case 'omiga_inscription':
          if (cur.amount !== '0') {
            // FIXME: remove this condition after backend fix
            acc[1].push(cur)
          }
          break
        default:
          break
      }
      return acc
    },
    [[] as UDTAccount[], [] as UDTAccount[]],
  )

  const hasAssets = udts.length || inscriptions.length
  const hasCells = boundLiveCellsCount > 0
  const hasInvalid = unboundLiveCellsCount > 0

  useEffect(() => {
    if (hasAssets) {
      return
    }
    if (hasCells) {
      setActiveTab(AssetInfo.CELLs)
    }
  }, [hasAssets, hasCells, setActiveTab])

  if (!address.bitcoinAddressHash) {
    return null
  }

  return (
    <Card className={styles.addressOverviewCard}>
      <div className={styles.cardTitle}>{t('address.overview')}</div>

      {hasAssets || hasCells ? (
        <AddressUDTAssetsPanel className={styles.addressUDTAssetsPanel}>
          <AddressAssetsTab animated={false} key={i18n.language} activeKey={activeTab.toString()}>
            {hasCells ? (
              <AddressAssetsTabPane
                tab={
                  <AddressAssetsTabPaneTitle onClick={() => setActiveTab(AssetInfo.CELLs)}>
                    {t('address.live_cell_tab')}
                  </AddressAssetsTabPaneTitle>
                }
                key={AssetInfo.CELLs}
              >
                <div className={styles.assetCardList}>
                  <Cells address={address.bitcoinAddressHash} count={+address.liveCellsCount} />
                </div>
              </AddressAssetsTabPane>
            ) : null}
            {hasAssets ? (
              <AddressAssetsTabPane
                tab={
                  <AddressAssetsTabPaneTitle onClick={() => setActiveTab(AssetInfo.RGBPP)}>
                    {t('address.rgb_plus_plus')}
                  </AddressAssetsTabPaneTitle>
                }
                key={AssetInfo.RGBPP}
              >
                <div className={styles.assetCardList}>
                  <RgbppAssets
                    address={address.bitcoinAddressHash}
                    count={+address.liveCellsCount}
                    udts={udts}
                    inscriptions={inscriptions}
                  />
                </div>
              </AddressAssetsTabPane>
            ) : null}
            {hasInvalid ? (
              <AddressAssetsTabPane
                tab={
                  <AddressAssetsTabPaneTitle onClick={() => setActiveTab(AssetInfo.Invalid)}>
                    {t('address.invalid')}
                  </AddressAssetsTabPaneTitle>
                }
                key={AssetInfo.Invalid}
              >
                <div className={styles.assetCardList}>
                  <RgbppAssets
                    address={address.bitcoinAddressHash}
                    count={+address.liveCellsCount}
                    udts={udts}
                    isUnBounded
                    // TODO invalid asset will be added in the future
                    inscriptions={[]}
                  />
                </div>
              </AddressAssetsTabPane>
            ) : null}
          </AddressAssetsTab>
        </AddressUDTAssetsPanel>
      ) : null}
    </Card>
  )
}

// FIXME: plural in i18n not work, address.cell and address.cells
