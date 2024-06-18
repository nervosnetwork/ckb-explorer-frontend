import { useTranslation } from 'react-i18next'
import { ReactEventHandler, useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import BigNumber from 'bignumber.js'
import { CoTA, OmigaInscription, MNFT, NRC721, SUDT, XUDT, Spore } from '../../models/Address'
import SUDTTokenIcon from '../../assets/sudt_token.png'
import { parseUDTAmount } from '../../utils/number'
import { getImgFromSporeCell } from '../../utils/spore'
import { formatNftDisplayId, handleNftImgError, hexToBase64, patchMibaoImg } from '../../utils/util'
import { getDobs } from '../../services/DobsService'
import { sliceNftName } from '../../utils/string'
import styles from './addressAssetComp.module.scss'
import EllipsisMiddle from '../../components/EllipsisMiddle'

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
    bgColor?: string
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
        {icon && (
          <img
            src={icon.url}
            alt={`${udtLabel} icon`}
            data-asset-type={udtLabel}
            onError={icon.errorHandler}
            style={{ background: icon.bgColor ?? 'unset' }}
          />
        )}
        <div className={styles.fields}>
          <div className={styles.assetName}>{name}</div>
          <EllipsisMiddle className={styles.attribute} text={property} />
        </div>
      </div>
    </a>
  )
}

export const AddressXudtComp = ({
  account,
  isRGBPP,
  isOriginal = true,
}: {
  account: XUDT
  isRGBPP?: boolean
  isOriginal?: boolean
}) => {
  const { symbol, decimal, amount, typeHash, udtIconFile } = account
  const [icon, setIcon] = useState(udtIconFile || SUDTTokenIcon)

  useEffect(() => {})
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/xudt/${typeHash}`}
      property={parseUDTAmount(amount, decimal)}
      name={symbol}
      udtLabel={isOriginal ? 'xUDT' : 'xUDT-compatible'}
      icon={{ url: patchMibaoImg(icon), errorHandler: () => setIcon(SUDTTokenIcon) }}
    />
  )
}

export const AddressSudtComp = ({ account, isRGBPP }: { account: SUDT; isRGBPP?: boolean }) => {
  const { symbol, decimal, amount, typeHash, udtIconFile } = account
  const [icon, setIcon] = useState(udtIconFile || SUDTTokenIcon)

  useEffect(() => {})
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/sudt/${typeHash}`}
      property={parseUDTAmount(amount, decimal)}
      name={symbol}
      udtLabel="sUDT"
      icon={{ url: patchMibaoImg(icon), errorHandler: () => setIcon(SUDTTokenIcon) }}
    />
  )
}

export const AddressSporeComp = ({
  account,
  isRGBPP,
  isMerged = false,
}: {
  account: Spore
  isRGBPP?: boolean
  isMerged?: boolean
}) => {
  const { t } = useTranslation()
  const { symbol, amount, udtIconFile, collection } = account
  const [img, setImg] = useState<{ img: string; bgColor?: string }>({
    img: getImgFromSporeCell(udtIconFile),
  })
  const id = formatNftDisplayId(amount, 'spore')
  useEffect(() => {
    const id = `0x${BigNumber(amount).toString(16)}`
    getDobs([id]).then(dobs => {
      if (dobs?.[0]) {
        const dob = dobs[0]
        const img = dob.asset?.startsWith('0x')
          ? `data:${dob.media_type};base64,${hexToBase64(dob.asset.slice(2))}`
          : dob.asset
        if (img) {
          setImg({
            img,
            bgColor: dob['prev.bgcolor'],
          })
        }
      }
    })
  }, [amount, setImg])
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/nft-collections/${collection?.typeHash}`}
      property={
        isMerged ? `${t('rgbpp.amount')}: ${(+amount).toLocaleString('en')}` : `id: ${id.slice(0, 8)}...${id.slice(-8)}`
      }
      name={sliceNftName(symbol)}
      udtLabel="DOB"
      icon={{ url: img.img ?? '', bgColor: img.bgColor, errorHandler: handleNftImgError }}
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
      property={`id: ${amount}`}
      name={!symbol ? '?' : sliceNftName(`${symbol} #${collection.typeHash.slice(2, 5)}`)}
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
