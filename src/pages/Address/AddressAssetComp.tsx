import { useTranslation } from 'react-i18next'
import { ReactEventHandler, useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { CoTA, OmigaInscription, MNFT, NRC721, SUDT, XUDT, Spore } from '../../models/Address'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { parseUDTAmount } from '../../utils/number'
import { getImgFromSporeCell } from '../../utils/spore'
import { formatNftDisplayId, handleNftImgError, patchMibaoImg } from '../../utils/util'
import { sliceNftName } from '../../utils/string'
import styles from './addressAssetComp.module.scss'

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
    <a href={href} className={styles.container}>
      <h5 className={styles.head} data-is-rgbpp={isRGBPP}>
        {isUnverified ? `${t('udt.unverified')}: ` : null}
        <span>{udtLabel}</span>
      </h5>
      <div className={styles.content}>
        {icon && <img src={icon.url} alt={`${udtLabel} icon`} data-asset-type={udtLabel} onError={icon.errorHandler} />}
        <div className={styles.fields}>
          <div className={styles.assetName}>{name}</div>
          <div className={styles.attribute} title={property}>
            {property}
          </div>
        </div>
      </div>
    </a>
  )
}

export const AddressXudtComp = ({ account, isRGBPP }: { account: XUDT; isRGBPP?: boolean }) => {
  const { symbol, decimal, amount, typeHash, udtIconFile, uan } = account
  const [icon, setIcon] = useState(udtIconFile || SUDTTokenIcon)

  useEffect(() => {})
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/xudt/${typeHash}`}
      property={parseUDTAmount(amount, decimal)}
      name={uan || symbol}
      udtLabel="xUDT"
      icon={{ url: patchMibaoImg(icon), errorHandler: () => setIcon(SUDTTokenIcon) }}
    />
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
      udtLabel="sUDT"
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

export const AddressMNFTComp = ({ account, isRGBPP }: { account: MNFT; isRGBPP?: boolean }) => {
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
      udtLabel="m-NFT"
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

export const AddressNRC721Comp = ({ account, isRGBPP }: { account: NRC721; isRGBPP?: boolean }) => {
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
      udtLabel="NRC 721"
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

export const AddressCoTAComp = ({ account, isRGBPP }: { account: CoTA; isRGBPP?: boolean }) => {
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
      udtLabel="CoTA"
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

export const AddressOmigaInscriptionComp = ({ account, isRGBPP }: { account: OmigaInscription; isRGBPP?: boolean }) => {
  const { decimal, expectedSupply, mintStatus, amount, typeHash, udtAmount } = account
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
      udtLabel="Omiga"
    />
  )
}
