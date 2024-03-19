import { useState, FC, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { explorerService } from '../../services/ExplorerService'
import { localeNumberString } from '../../utils/number'
import { shannonToCkb } from '../../utils/util'
import {
  AddressAssetsTab,
  AddressAssetsTabPane,
  AddressAssetsTabPaneTitle,
  AddressLockScriptController,
  AddressLockScriptPanel,
  AddressUDTAssetsContent,
  AddressUDTAssetsList,
  AddressUDTAssetsPanel,
} from './styled'
import Capacity from '../../components/Capacity'
import CKBTokenIcon from './ckb_token_icon.png'
import styles from './styles.module.scss'
import Script from '../../components/Script'
import AddressText from '../../components/AddressText'
import { parseSimpleDateNoSecond } from '../../utils/date'
import { isMainnet } from '../../utils/chain'
import ArrowUpIcon from '../../assets/arrow_up.png'
import ArrowUpBlueIcon from '../../assets/arrow_up_blue.png'
import ArrowDownIcon from '../../assets/arrow_down.png'
import ArrowDownBlueIcon from '../../assets/arrow_down_blue.png'
import { Address, UDTAccount } from '../../models/Address'
import { Card, CardCellInfo, CardCellsLayout } from '../../components/Card'
import Cells from './Cells'
import {
  AddressCoTAComp,
  AddressOmigaInscriptionComp,
  AddressMNFTComp,
  AddressSporeComp,
  AddressSudtComp,
} from './AddressAssetComp'

enum AssetInfo {
  UDT = 1,
  INSCRIPTION,
  CELLs,
  RGBPP,
}

const lockScriptIcon = (show: boolean) => {
  if (show) {
    return isMainnet() ? ArrowUpIcon : ArrowUpBlueIcon
  }
  return isMainnet() ? ArrowDownIcon : ArrowDownBlueIcon
}

const AddressLockScript: FC<{ address: Address }> = ({ address }) => {
  const [showLock, setShowLock] = useState<boolean>(false)
  const { t } = useTranslation()

  const { liveCellsCount, minedBlocksCount, type, addressHash, lockInfo } = address
  const overviewItems: CardCellInfo<'left' | 'right'>[] = [
    {
      title: t('address.live_cells'),
      tooltip: t('glossary.live_cells'),
      content: localeNumberString(liveCellsCount),
    },
    {
      title: t('address.block_mined'),
      tooltip: t('glossary.block_mined'),
      content: localeNumberString(minedBlocksCount),
    },
  ]

  if (type === 'LockHash') {
    if (!addressHash) {
      overviewItems.push({
        title: t('address.address'),
        content: t('address.unable_decode_address'),
      })
    } else {
      overviewItems.push({
        title: t('address.address'),
        contentWrapperClass: styles.addressWidthModify,
        content: <AddressText>{addressHash}</AddressText>,
      })
    }
  }
  if (lockInfo && lockInfo.epochNumber !== '0' && lockInfo.estimatedUnlockTime !== '0') {
    const estimate = Number(lockInfo.estimatedUnlockTime) > new Date().getTime() ? t('address.estimated') : ''
    overviewItems.push({
      title: t('address.lock_until'),
      content: `${lockInfo.epochNumber} ${t('address.epoch')} (${estimate} ${parseSimpleDateNoSecond(
        lockInfo.estimatedUnlockTime,
      )})`,
    })
  }

  return (
    <AddressLockScriptPanel className={styles.addressLockScriptPanel}>
      <CardCellsLayout type="left-right" cells={overviewItems} borderTop />
      <AddressLockScriptController onClick={() => setShowLock(!showLock)}>
        <div>{t('address.lock_script')}</div>
        <img alt="lock script" src={lockScriptIcon(showLock)} />
      </AddressLockScriptController>
      {showLock && address.lockScript && <Script script={address.lockScript} />}
    </AddressLockScriptPanel>
  )
}

export const BTCAddressOverviewCard: FC<{ address: Address }> = ({ address }) => {
  const { t, i18n } = useTranslation()
  const { udtAccounts = [] } = address
  const [activeTab, setActiveTab] = useState<AssetInfo>(AssetInfo.UDT)

  const [udts, inscriptions] = udtAccounts.reduce(
    (acc, cur) => {
      switch (cur.udtType) {
        case 'sudt':
        case 'spore_cell':
        case 'm_nft_token':
        case 'cota':
        case 'nrc_721_token':
          acc[0].push(cur)
          break
        case 'omiga_inscription':
          acc[1].push(cur)
          break
        default:
          break
      }
      return acc
    },
    [[] as UDTAccount[], [] as UDTAccount[]],
  )

  const { data: initList } = useQuery(
    ['cota-list', address.addressHash],
    () => explorerService.api.fetchNFTItemByOwner(address.addressHash, 'cota'),
    {
      enabled: !!address?.addressHash,
    },
  )

  const { data: cotaList } = useQuery(['cota-list', initList?.pagination.series], () =>
    Promise.all(
      (initList?.pagination.series ?? []).map(p =>
        explorerService.api.fetchNFTItemByOwner(address.addressHash, 'cota', p),
      ),
    ).then(resList => resList.flatMap(res => res.data)),
  )

  const overviewItems: CardCellInfo<'left' | 'right'>[] = [
    {
      slot: 'left',
      cell: {
        icon: <img src={CKBTokenIcon} alt="item icon" width="100%" />,
        title: t('common.ckb_unit'),
        content: <Capacity capacity={shannonToCkb(address.balance)} />,
      },
    },
    {
      title: t('address.occupied'),
      tooltip: t('glossary.occupied'),
      content: <Capacity capacity={shannonToCkb(address.balanceOccupied)} />,
    },
    {
      title: t('address.dao_deposit'),
      tooltip: t('glossary.nervos_dao_deposit'),
      content: <Capacity capacity={shannonToCkb(address.daoDeposit)} />,
    },
    {
      title: t('address.compensation'),
      content: <Capacity capacity={shannonToCkb(address.daoCompensation)} />,
      tooltip: t('glossary.nervos_dao_compensation'),
    },
  ]

  const hasAssets = udts.length > 0 || (cotaList?.length && cotaList.length > 0)
  const hasInscriptions = inscriptions.length > 0
  const hasCells = +address.liveCellsCount > 0

  useEffect(() => {
    if (hasAssets) {
      return
    }
    if (hasInscriptions) {
      setActiveTab(AssetInfo.INSCRIPTION)
      return
    }
    if (hasCells) {
      setActiveTab(AssetInfo.CELLs)
    }
  }, [hasAssets, hasInscriptions, hasCells, setActiveTab])

  return (
    <Card className={styles.addressOverviewCard}>
      <div className={styles.cardTitle}>{t('address.overview')}</div>

      <CardCellsLayout type="leftSingle-right" cells={overviewItems} borderTop />

      {hasAssets || hasInscriptions || hasCells ? (
        <AddressUDTAssetsPanel className={styles.addressUDTAssetsPanel}>
          <AddressAssetsTab animated={false} key={i18n.language} activeKey={activeTab.toString()}>
            {(udts.length > 0 || cotaList?.length) && (
              <AddressAssetsTabPane
                tab={
                  <AddressAssetsTabPaneTitle onClick={() => setActiveTab(AssetInfo.UDT)}>
                    {t('address.user_defined_token')}
                  </AddressAssetsTabPaneTitle>
                }
                key={AssetInfo.UDT}
              >
                <AddressUDTAssetsContent>
                  <AddressUDTAssetsList>
                    {udts.map(udt => {
                      switch (udt.udtType) {
                        case 'sudt':
                          return (
                            <AddressSudtComp
                              isRGBPP={false}
                              account={udt}
                              key={udt.symbol + udt.udtType + udt.amount}
                            />
                          )

                        case 'spore_cell':
                          return (
                            <AddressSporeComp
                              isRGBPP={false}
                              account={udt}
                              key={udt.symbol + udt.udtType + udt.amount}
                            />
                          )

                        case 'm_nft_token':
                          return (
                            <AddressMNFTComp
                              isRGBPP={false}
                              account={udt}
                              key={udt.symbol + udt.udtType + udt.amount}
                            />
                          )
                        default:
                          return null
                      }
                    })}
                    {cotaList?.map(cota => (
                      <AddressCoTAComp
                        isRGBPP={false}
                        account={{
                          udtType: 'cota',
                          symbol: cota.collection.name,
                          udtIconFile: cota.collection.icon_url ?? '',
                          cota: {
                            cotaId: cota.collection.id,
                            tokenId: Number(cota.token_id),
                          },
                        }}
                        key={cota.collection.id + cota.token_id}
                      />
                    )) ?? null}
                  </AddressUDTAssetsList>
                </AddressUDTAssetsContent>
              </AddressAssetsTabPane>
            )}
            {hasInscriptions ? (
              <AddressAssetsTabPane
                tab={
                  <AddressAssetsTabPaneTitle onClick={() => setActiveTab(AssetInfo.INSCRIPTION)}>
                    {t('address.inscription')}
                  </AddressAssetsTabPaneTitle>
                }
                key={AssetInfo.INSCRIPTION}
              >
                <AddressUDTAssetsContent>
                  <AddressUDTAssetsList>
                    {inscriptions.map(inscription => {
                      switch (inscription.udtType) {
                        case 'omiga_inscription':
                          return (
                            <AddressOmigaInscriptionComp
                              isRGBPP={false}
                              account={inscription}
                              key={`${inscription.symbol + inscription.udtType + inscription.udtAmount}`}
                            />
                          )

                        default:
                          return null
                      }
                    })}
                  </AddressUDTAssetsList>
                </AddressUDTAssetsContent>
              </AddressAssetsTabPane>
            ) : null}
            {(hasInscriptions || hasAssets) && (
              <AddressAssetsTabPane
                tab={
                  <AddressAssetsTabPaneTitle onClick={() => setActiveTab(AssetInfo.RGBPP)}>
                    {t('address.rgb_plus_plus')}
                  </AddressAssetsTabPaneTitle>
                }
                key={AssetInfo.RGBPP}
              >
                <AddressUDTAssetsContent>
                  <AddressUDTAssetsList>
                    {udts.map(udt => {
                      switch (udt.udtType) {
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
                    {cotaList?.map(cota => (
                      <AddressCoTAComp
                        isRGBPP
                        account={{
                          udtType: 'cota',
                          symbol: cota.collection.name,
                          udtIconFile: cota.collection.icon_url ?? '',
                          cota: {
                            cotaId: cota.collection.id,
                            tokenId: Number(cota.token_id),
                          },
                        }}
                        key={cota.collection.id + cota.token_id}
                      />
                    )) ?? null}
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
                  </AddressUDTAssetsList>
                </AddressUDTAssetsContent>
              </AddressAssetsTabPane>
            )}

            {hasCells ? (
              <AddressAssetsTabPane
                tab={
                  <AddressAssetsTabPaneTitle onClick={() => setActiveTab(AssetInfo.CELLs)}>
                    {t(`address.${+address.liveCellsCount > 1 ? 'cells' : 'cell'}`)}
                  </AddressAssetsTabPaneTitle>
                }
                key={AssetInfo.CELLs}
              >
                <AddressUDTAssetsList>
                  <Cells address={address.addressHash} count={+address.liveCellsCount} />
                </AddressUDTAssetsList>
              </AddressAssetsTabPane>
            ) : null}
          </AddressAssetsTab>
        </AddressUDTAssetsPanel>
      ) : null}

      <AddressLockScript address={address} />
    </Card>
  )
}

// FIXME: plural in i18n not work, address.cell and address.cells
