import { useTranslation } from 'react-i18next'
import { ReactEventHandler, useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import styles from './styles.module.scss'
import { AddressUDTItemPanel } from './styled'
import { CoTA, OmigaInscription, MNFT, NRC721, SUDT, Spore } from '../../models/Address'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { parseUDTAmount } from '../../utils/number'
import { getImgFromSporeCell } from '../../utils/spore'
import { formatNftDisplayId, handleNftImgError, patchMibaoImg } from '../../utils/util'
import { sliceNftName } from '../../utils/string'

export const AddressAssetComp = ({
  href,
  isUnverified,
  udtLabel,
  icon,
  name,
  property,
  isRGBPP,
}: {
  isRGBPP: boolean
  property: string
  name?: string
  href?: string
  isUnverified?: boolean
  udtLabel: string
  icon?: {
    url: string
    errorHandler: ReactEventHandler<HTMLImageElement>
  }
}) => {
  const { t } = useTranslation()
  return (
    <AddressUDTItemPanel href={href} isLink={!!href}>
      <div className={`addressUdtLabel ${isRGBPP ? styles.rgbpp : styles.normal}`}>
        {isUnverified ? `${t('udt.unverified')}: ` : null}
        <span>{udtLabel}</span>
      </div>
      <div className="addressUdtDetail">
        {icon && <img className="addressUdtItemIcon" src={icon.url} alt="udt icon" onError={icon.errorHandler} />}
        <div className="addressUdtItemInfo">
          <span>{name}</span>
          <span>{property}</span>
        </div>
      </div>
    </AddressUDTItemPanel>
  )
}

export const AddressSudtComp = ({ account, isRGBPP }: { account: SUDT; isRGBPP?: boolean }) => {
  const { symbol, decimal, amount, typeHash, udtIconFile, uan } = account
  const [icon, setIcon] = useState(udtIconFile || SUDTTokenIcon)

  useEffect(() => {})
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/sudt/${typeHash}`}
      property={parseUDTAmount(amount, decimal)}
      name={uan || symbol}
      udtLabel="sudt"
      icon={{ url: patchMibaoImg(icon), errorHandler: () => setIcon(SUDTTokenIcon) }}
    />
  )
}

export const AddressSporeComp = ({ account, isRGBPP }: { account: Spore; isRGBPP?: boolean }) => {
  const { symbol, amount, udtIconFile, collection } = account
  const img = getImgFromSporeCell(udtIconFile)
  const id = formatNftDisplayId(amount, 'spore')
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/nft-collections/${collection?.typeHash}`}
      property={`id: ${id.slice(0, 8)}...${id.slice(-8)}`}
      name={sliceNftName(symbol)}
      udtLabel="DOB"
      icon={{ url: img, errorHandler: handleNftImgError }}
    />
  )
}

export const AddressMNFTComp = ({
  account,
  isRGBPP,
  udtLabel,
}: {
  account: MNFT
  isRGBPP?: boolean
  udtLabel?: string
}) => {
  const { symbol, amount, udtIconFile, collection } = account
  const [icon, setIcon] = useState(udtIconFile)

  useEffect(() => {
    axios
      .get(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
      .then((res: AxiosResponse) => {
        if (typeof res.data?.image === 'string') {
          setIcon(res.data.image)
        } else {
          throw new Error('Image not found in metadata')
        }
      })
      .catch((err: Error) => {
        console.error(err.message)
      })
  }, [udtIconFile])

  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/nft-collections/${collection?.typeHash}`}
      property={`#${amount}`}
      name={sliceNftName(symbol)}
      udtLabel={udtLabel ?? 'm nft'}
      icon={{
        url: `${patchMibaoImg(icon)}?${new URLSearchParams({
          size: 'small',
          tid: amount,
        })}`,
        errorHandler: handleNftImgError,
      }}
    />
  )
}

export const AddressNRC721Comp = ({
  account,
  isRGBPP,
  udtLabel,
}: {
  account: NRC721
  isRGBPP?: boolean
  udtLabel?: string
}) => {
  const { symbol, amount, udtIconFile, collection } = account
  const [icon, setIcon] = useState(udtIconFile)

  useEffect(() => {
    axios
      .get(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
      .then((res: AxiosResponse) => {
        if (typeof res.data?.image === 'string') {
          setIcon(res.data.image)
        } else {
          throw new Error('Image not found in metadata')
        }
      })
      .catch((err: Error) => {
        console.error(err.message)
      })
  }, [udtIconFile])

  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/nft-collections/${collection?.typeHash}`}
      property={!symbol ? '?' : `#${amount}`}
      name={!symbol ? '?' : sliceNftName(symbol)}
      isUnverified={!symbol}
      udtLabel={udtLabel ?? 'nrc 721'}
      icon={{
        url: `${patchMibaoImg(icon)}?${new URLSearchParams({
          size: 'small',
          tid: amount,
        })}`,
        errorHandler: handleNftImgError,
      }}
    />
  )
}

export const AddressCoTAComp = ({
  account,
  isRGBPP,
  udtLabel,
}: {
  account: CoTA
  isRGBPP?: boolean
  udtLabel?: string
}) => {
  const { symbol, udtIconFile, cota } = account
  const [icon, setIcon] = useState(udtIconFile)

  useEffect(() => {
    axios
      .get(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
      .then((res: AxiosResponse) => {
        if (typeof res.data?.image === 'string') {
          setIcon(res.data.image)
        } else {
          throw new Error('Image not found in metadata')
        }
      })
      .catch((err: Error) => {
        console.error(err.message)
      })
  }, [udtIconFile])

  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/nft-collections/${cota?.cotaId}`}
      property={`#${cota?.tokenId}`}
      name={sliceNftName(symbol)}
      udtLabel={udtLabel ?? 'CoTA'}
      icon={{
        url: `${patchMibaoImg(icon)}?${new URLSearchParams({
          size: 'small',
          tid: cota?.cotaId?.toString(),
        })}`,
        errorHandler: handleNftImgError,
      }}
    />
  )
}

export const AddressOmigaInscriptionComp = ({
  account,
  isRGBPP,
  udtLabel,
}: {
  account: OmigaInscription
  isRGBPP?: boolean
  udtLabel?: string
}) => {
  const { decimal, expectedSupply, mintStatus, amount, symbol, typeHash, udtAmount } = account
  const { t } = useTranslation()
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/inscription/${typeHash}`}
      name={parseUDTAmount(amount, decimal)}
      property={`${t(`udt.mint_status_${mintStatus}`)}(${parseUDTAmount(udtAmount, decimal)}/${parseUDTAmount(
        expectedSupply,
        decimal,
      )})`}
      udtLabel={udtLabel ?? symbol}
    />
  )
}
