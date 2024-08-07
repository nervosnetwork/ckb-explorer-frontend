/* eslint-disable react-hooks/rules-of-hooks */
import { ForwardedRef, forwardRef, useMemo } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation, useParams } from 'react-router-dom'
import * as H from 'history'
import { useQuery } from '@tanstack/react-query'
import { SupportedLng, addI18nPrefix, removeI18nPrefix } from '../../utils/i18n'
import { IS_MAINNET } from '../../constants/common'
import { getBtcChainIdentify } from '../../services/BTCIdentifier'
import config from '../../config'

export type LinkProps<S> =
  | (Omit<RouterLinkProps<S>, 'to'> & {
      lng: SupportedLng
      to?: string | ((location: H.Location) => string)
    })
  | {
      lng?: SupportedLng
      to: string | ((location: H.Location) => string)
    }

export const Link = forwardRef<HTMLAnchorElement, LinkProps<unknown>>((({ lng, to: propsTo, ...props }, ref) => {
  if (typeof propsTo === 'string' && propsTo.startsWith('http')) {
    return <RouterLink ref={ref} {...props} to={{ pathname: propsTo }} target="_blank" />
  }
  const { locale } = useParams<{ locale?: string }>()
  const { pathname } = useLocation()

  const to = propsTo ?? removeI18nPrefix(pathname)
  const toWithPrefix = useMemo<RouterLinkProps['to']>(() => {
    if (typeof to === 'string') return addI18nPrefix(to, lng ?? locale)

    return (location: H.Location) => addI18nPrefix(to(location), lng ?? locale)
  }, [lng, locale, to])

  return <RouterLink ref={ref} {...props} to={toWithPrefix} />
  // The `as` here is to allow the generic type to be correctly inferred.
}) as <S>(props: LinkProps<S>, ref: ForwardedRef<HTMLAnchorElement>) => JSX.Element)

export type BTCExplorerLinkProps<S> =
  | (Omit<RouterLinkProps<S>, 'to'> & {
      id?: string
      address?: string
      path: string
      lng: SupportedLng
      anchor?: string
    })
  | {
      id?: string
      address?: string
      path: string
      lng?: SupportedLng
      anchor?: string
    }

export const BTCExplorerLink = forwardRef<HTMLAnchorElement, BTCExplorerLinkProps<unknown>>(((
  { id, address, lng, path, anchor, ...props },
  ref,
) => {
  const { locale } = useParams<{ locale?: string }>()
  let { data: identity } = useQuery({
    queryKey: ['btc-testnet-identity', id, address],
    queryFn: () => getBtcChainIdentify(id!),
    enabled: !IS_MAINNET && !!id,
  })
  identity = identity ?? 'testnet'

  return (
    <Link
      lng={lng ?? (locale as 'en' | 'zh')}
      ref={ref}
      {...props}
      to={`${config.BITCOIN_EXPLORER}${IS_MAINNET ? '' : `/${identity}`}${path}/${address ?? id}${
        anchor ? `#${anchor}` : ''
      }`}
    />
  )
}) as <S>(props: BTCExplorerLinkProps<S>, ref: ForwardedRef<HTMLAnchorElement>) => JSX.Element)
