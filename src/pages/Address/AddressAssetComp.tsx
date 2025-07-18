import { useTranslation } from 'react-i18next'
import { ReactEventHandler, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CoTA, OmigaInscription, MNFT, NRC721, SUDT, XUDT, Spore } from '../../models/Address'
import FtFallbackIcon from '../../assets/ft_fallback_icon.png'
import { parseUDTAmount } from '../../utils/number'
import { getSporeImg } from '../../utils/spore'
import { formatNftDisplayId, handleNftImgError, patchMibaoImg } from '../../utils/util'
import { sliceNftName } from '../../utils/string'
import styles from './addressAssetComp.module.scss'
import EllipsisMiddle from '../../components/EllipsisMiddle'
import Inscription from './Inscription'
import { DEFAULT_SPORE_IMAGE } from '../../constants/common'

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
  const [icon, setIcon] = useState(udtIconFile || FtFallbackIcon)

  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/xudt/${typeHash}`}
      property={parseUDTAmount(amount, decimal)}
      name={symbol}
      udtLabel={isOriginal ? 'xUDT' : 'xUDT-compatible'}
      icon={{ url: patchMibaoImg(icon), errorHandler: () => setIcon(FtFallbackIcon) }}
    />
  )
}

export const AddressSudtComp = ({ account, isRGBPP }: { account: SUDT; isRGBPP?: boolean }) => {
  const { symbol, decimal, amount, typeHash, udtIconFile } = account
  const [icon, setIcon] = useState(udtIconFile || FtFallbackIcon)

  useEffect(() => {
    fetch(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.image === 'string') {
          setIcon(data.image)
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
      href={`/sudt/${typeHash}`}
      property={parseUDTAmount(amount, decimal)}
      name={symbol}
      udtLabel="sUDT"
      icon={{ url: patchMibaoImg(icon), errorHandler: () => setIcon(FtFallbackIcon) }}
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
  const { symbol, amount, udtIconFile, collection, udtTypeScript } = account

  const dobRenderParams =
    udtIconFile && udtTypeScript.args
      ? {
          data: udtIconFile,
          id: udtTypeScript.args,
        }
      : null
  const { data: img } = useQuery({
    queryKey: ['dob_render_img', dobRenderParams],
    queryFn: () => (dobRenderParams ? getSporeImg(dobRenderParams) : DEFAULT_SPORE_IMAGE),
    enabled: !!dobRenderParams,
  })

  const id = formatNftDisplayId(amount, 'spore')
  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/dob-info/${collection?.typeHash}/${udtTypeScript.args}`}
      property={
        isMerged ? `${t('rgbpp.amount')}: ${(+amount).toLocaleString('en')}` : `id: ${id.slice(0, 8)}...${id.slice(-8)}`
      }
      name={sliceNftName(symbol)}
      udtLabel="DOB"
      icon={{ url: img ?? '', errorHandler: handleNftImgError }}
    />
  )
}

export const AddressMNFTComp = ({ account, isRGBPP }: { account: MNFT; isRGBPP?: boolean }) => {
  const { symbol, amount, udtIconFile, collection } = account
  const [icon, setIcon] = useState(udtIconFile)

  useEffect(() => {
    fetch(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.image === 'string') {
          setIcon(data.image)
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
      href={`/nft-info/${collection?.typeHash}/${amount}`}
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
    fetch(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.image === 'string') {
          setIcon(data.image)
        } else {
          throw new Error('Image not found in metadata')
        }
      })
      .catch((err: Error) => {
        console.error(err.message)
      })
  }, [udtIconFile])

  const id = BigInt(`0x${amount}`).toString()

  return (
    <AddressAssetComp
      isRGBPP={isRGBPP ?? false}
      href={`/nft-info/${collection?.typeHash}/${id}`}
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
    fetch(/https?:\/\//.test(udtIconFile) ? udtIconFile : `https://${udtIconFile}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.image === 'string') {
          setIcon(data.image)
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

export const AddressOmigaInscriptionComp = ({ account }: { account: OmigaInscription }) => {
  const { decimal, mintStatus, amount, typeHash, symbol, udtAmount } = account
  const { t } = useTranslation()
  return (
    <Inscription
      href={`/inscription/${typeHash}`}
      content={{
        Symbol: symbol,
        Amount: amount,
        Decimal: decimal,
        Supply: udtAmount,
      }}
      udtLabel="Omiga"
      mintingStatus={t(`udt.mint_status_${mintStatus}`)}
    />
  )
}
