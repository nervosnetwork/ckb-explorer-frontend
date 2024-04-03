import { useState, FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AddressAssetsTab,
  AddressAssetsTabPane,
  AddressAssetsTabPaneTitle,
  AddressUDTAssetsContent,
  AddressUDTAssetsPanel,
} from './styled'
import styles from './styles.module.scss'
import { Address, UDTAccount } from '../../models/Address'
import { Card } from '../../components/Card'
import Cells from './Cells'
import {
  AddressOmigaInscriptionComp,
  AddressMNFTComp,
  AddressSporeComp,
  AddressSudtComp,
  AddressXudtComp,
} from './AddressAssetComp'

enum AssetInfo {
  CELLs,
  RGBPP,
}

export const BTCAddressOverviewCard: FC<{ address: Address }> = ({ address }) => {
  const { t, i18n } = useTranslation()
  const { udtAccounts = [] } = address
  const [activeTab, setActiveTab] = useState<AssetInfo>(AssetInfo.RGBPP)

  const [udts, inscriptions] = udtAccounts.reduce(
    (acc, cur) => {
      switch (cur?.udtType) {
        case 'xudt':
        case 'sudt':
        case 'spore_cell':
        case 'm_nft_token':
        case 'cota':
        case 'nrc_721_token':
          acc[0].push(cur)
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
  const hasCells = +address.liveCellsCount > 0

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
                <AddressUDTAssetsContent>
                  <div className={styles.assetCardList}>
                    {udts.map(udt => {
                      switch (udt.udtType) {
                        case 'xudt':
                          return <AddressXudtComp isRGBPP account={udt} key={udt.symbol + udt.udtType + udt.amount} />
                        case 'sudt':
                          return <AddressSudtComp isRGBPP account={udt} key={udt.symbol + udt.udtType + udt.amount} />

                        case 'spore_cell':
                          return <AddressSporeComp isRGBPP account={udt} key={udt.symbol + udt.udtType + udt.amount} />

                        case 'm_nft_token':
                          return <AddressMNFTComp isRGBPP account={udt} key={udt.symbol + udt.udtType + udt.amount} />
                        default:
                          return null
                      }
                    })}

                    {inscriptions.map(inscription => {
                      switch (inscription.udtType) {
                        case 'omiga_inscription':
                          return (
                            <AddressOmigaInscriptionComp
                              isRGBPP
                              account={inscription}
                              key={`${inscription.symbol + inscription.udtType + inscription.udtAmount}`}
                            />
                          )

                        default:
                          return null
                      }
                    })}
                  </div>
                </AddressUDTAssetsContent>
              </AddressAssetsTabPane>
            ) : null}
          </AddressAssetsTab>
        </AddressUDTAssetsPanel>
      ) : null}
    </Card>
  )
}

// FIXME: plural in i18n not work, address.cell and address.cells
