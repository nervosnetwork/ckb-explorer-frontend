import { type FC, useState, useMemo } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import { ReactComponent as ListIcon } from './list.svg'
import { ReactComponent as GridIcon } from './grid.svg'
import { parseUDTAmount } from '../../utils/number'
import { formatNftDisplayId } from '../../utils/util'
import styles from './definedTokens.module.scss'
import { sliceNftName } from '../../utils/string'
import { NFTItem } from '../../services/ExplorerService'
import { UDTAccount } from '../../models/Address'
import {
  AddressCoTAComp,
  AddressMNFTComp,
  AddressSporeComp,
  AddressSudtComp,
  AddressXudtComp,
  AddressNRC721Comp,
} from './AddressAssetComp'
import Tooltip from '../../components/Tooltip'

const TokenTable: FC<{ udts: UDTAccount[]; cotaList: NFTItem[] }> = ({ udts, cotaList }) => {
  const { t } = useTranslation()
  const headers = getTableHeaders(t)

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header.key}>{header.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {udts.map((udt, index) => {
            let type = ''
            let key = udt.symbol + udt.udtType
            let href = ''
            let asset = ''
            let amount = ''
            switch (udt.udtType) {
              case 'xudt_compatible':
              case 'xudt':
                type = 'xUDT'
                key += udt.amount
                href = `/xudt/${udt.typeHash}`
                asset = udt.symbol
                amount = `${parseUDTAmount(udt.amount, udt.decimal)} ${asset}`
                break
              case 'sudt':
                type = 'sUDT'
                key += udt.amount
                href = `/sudt/${udt.typeHash}`
                asset = udt.symbol
                amount = `${parseUDTAmount(udt.amount, udt.decimal)} ${asset}`
                break
              case 'did_cell':
              case 'spore_cell':
                type = 'DOB'
                key += udt.amount
                href = `/nft-collections/${udt.collection?.typeHash}`
                asset = sliceNftName(udt.symbol) || ''
                // eslint-disable-next-line no-case-declarations
                const id = formatNftDisplayId(udt.amount, 'spore')
                amount = `id: ${id.slice(0, 8)}...${id.slice(-8)}`
                break
              case 'm_nft_token':
                type = 'm-NFT'
                key += udt.amount
                href = `/nft-collections/${udt.collection?.typeHash}`
                asset = sliceNftName(udt.symbol) || ''
                amount = `#${udt.amount}`
                break
              case 'nrc_721_token':
                type = 'NRC 721'
                key += udt.amount
                href = `/nft-collections/${udt.collection?.typeHash}`
                asset = !udt.symbol ? '?' : sliceNftName(`${udt.symbol} #${udt.collection.typeHash.slice(2, 5)}`) || ''
                amount = `id: ${udt.amount.slice(0, 5)}...${udt.amount.slice(-4)}`
                break
              default:
                break
            }

            return (
              <tr key={key}>
                <td>{index + 1}</td>
                <td>{type}</td>
                <td>{asset || '/'}</td>
                <td>{amount}</td>
                <td>
                  <a href={href}>{t('address.view-asset')}</a>
                </td>
              </tr>
            )
          })}
          {cotaList.map((cota, index) => {
            return (
              <tr key={cota.id}>
                <td>{udts.length + index + 1}</td>
                <td>CoTA</td>
                <td>{sliceNftName(cota.collection.name)}</td>
                <td>{`#${Number(cota.token_id)}`}</td>
                <td>
                  <a href={`/nft-collections/${cota.collection.id}`}>{t('address.view-asset')}</a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const DefinedTokens: FC<{ udts: UDTAccount[]; cotaList?: NFTItem[] }> = ({ udts, cotaList = [] }) => {
  const { t } = useTranslation()
  const [isDisplayedAsList, setIsDisplayedAsList] = useState(false)

  const count = useMemo(() => udts.length + cotaList.length, [udts, cotaList])

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>Count: {count.toLocaleString('en')}</div>
        <div className={styles.filters}>
          <Tooltip
            trigger={
              <button type="button" onClick={() => setIsDisplayedAsList(i => !i)}>
                {isDisplayedAsList ? <GridIcon /> : <ListIcon />}
              </button>
            }
            placement="top"
          >
            {isDisplayedAsList ? t('sort.card') : t('sort.list')}
          </Tooltip>
        </div>
      </div>

      <div className={styles.content}>
        {isDisplayedAsList ? (
          <TokenTable udts={udts} cotaList={cotaList} />
        ) : (
          <ul>
            {udts.map(udt => {
              switch (udt.udtType) {
                case 'xudt_compatible':
                case 'xudt':
                  return (
                    <AddressXudtComp
                      account={udt}
                      key={udt.symbol + udt.udtType + udt.amount}
                      isOriginal={udt.udtType === 'xudt'}
                    />
                  )

                case 'sudt':
                  return <AddressSudtComp account={udt} key={udt.symbol + udt.udtType + udt.amount} />

                case 'did_cell':
                case 'spore_cell':
                  return <AddressSporeComp account={udt} key={udt.symbol + udt.udtType + udt.amount} />

                case 'm_nft_token':
                  return <AddressMNFTComp account={udt} key={udt.symbol + udt.udtType + udt.amount} />

                case 'nrc_721_token':
                  return <AddressNRC721Comp account={udt} key={udt.symbol + udt.udtType + udt.amount} />

                default:
                  return null
              }
            })}
            {cotaList?.map(cota => (
              <AddressCoTAComp
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
          </ul>
        )}
      </div>
    </div>
  )
}
export default DefinedTokens

const getTableHeaders = (t: TFunction): TableHeader[] => {
  return [
    { title: '#', key: 'index' },
    { title: t('address.type'), key: 'type' },
    { title: t('address.asset'), key: 'asset' },
    { title: t('address.amount'), key: 'amount' },
    { title: '', key: 'action' },
  ]
}

interface TableHeader {
  title: string
  key: string
}
