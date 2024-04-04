import BigNumber from 'bignumber.js'
import { type FC, useMemo } from 'react'
import type { UDTAccount, FT, NFT, OmigaInscription } from '../../models/Address/UDTAccount'
import {
  AddressOmigaInscriptionComp,
  AddressMNFTComp,
  AddressSporeComp,
  AddressSudtComp,
  AddressXudtComp,
  AddressNRC721Comp,
} from './AddressAssetComp'
import styles from './mergedAssetList.module.scss'

const isFT = (udt: UDTAccount): udt is FT => {
  return udt.udtType === 'sudt' || udt.udtType === 'xudt' || udt.udtType === 'omiga_inscription'
}

const isNFT = (udt: UDTAccount): udt is NFT => {
  return udt.udtType === 'm_nft_token' || udt.udtType === 'spore_cell'
}

const MergedAssetList: FC<{
  udts: UDTAccount[]
  inscriptions: UDTAccount[]
}> = ({ udts, inscriptions }) => {
  const { fts, nfts, omigas } = useMemo(() => {
    const ftMap = new Map<string, FT>()
    const nftMap = new Map<string, NFT>()
    const omigaMap = new Map<string, OmigaInscription>()

    udts.forEach(udt => {
      if (isFT(udt)) {
        const id = udt.typeHash
        const item = ftMap.get(id)
        if (!item) {
          ftMap.set(id, udt)
        } else {
          ftMap.set(id, {
            ...item,
            amount: BigNumber(item.amount).plus(udt.amount).toFormat({}),
          })
        }
      } else if (isNFT(udt)) {
        const id = udt.collection.typeHash
        if (!id) return
        const item = nftMap.get(id)
        if (!item) {
          nftMap.set(id, udt)
        } else {
          nftMap.set(id, {
            ...item,
            amount: BigNumber(item.amount).plus(udt.amount).toFormat({}),
          })
        }
      }
    })

    inscriptions.forEach(udt => {
      if (udt.udtType === 'omiga_inscription') {
        const id = udt.typeHash
        const item = omigaMap.get(id)
        if (!item) {
          omigaMap.set(id, udt)
        } else {
          omigaMap.set(id, {
            ...item,
            amount: BigNumber(item.amount).plus(udt.amount).toFormat({}),
          })
        }
      }
    })

    return {
      fts: Array.from(ftMap.values()),
      nfts: Array.from(nftMap.values()),
      omigas: Array.from(omigaMap.values()),
    }
  }, [])

  return (
    <div className={styles.container}>
      {fts.map(ft => {
        switch (ft.udtType) {
          case 'xudt':
            return <AddressXudtComp isRGBPP account={ft} key={ft.symbol + ft.udtType + ft.amount} />
          case 'sudt':
            return <AddressSudtComp isRGBPP account={ft} key={ft.symbol + ft.udtType + ft.amount} />
          default:
            return null
        }
      })}

      {nfts.map(nft => {
        switch (nft.udtType) {
          case 'spore_cell':
            return <AddressSporeComp isRGBPP account={nft} key={nft.symbol + nft.udtType + nft.amount} />
          case 'nrc_721_token':
            return <AddressNRC721Comp isRGBPP account={nft} key={nft.symbol + nft.udtType + nft.amount} />
          case 'm_nft_token':
            return <AddressMNFTComp isRGBPP account={nft} key={nft.symbol + nft.udtType + nft.amount} />
          default:
            return null
        }
      })}

      {omigas.map(omiga => {
        switch (omiga.udtType) {
          case 'omiga_inscription':
            return (
              <AddressOmigaInscriptionComp
                isRGBPP
                account={omiga}
                key={`${omiga.symbol + omiga.udtType + omiga.udtAmount}`}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}
export default MergedAssetList
