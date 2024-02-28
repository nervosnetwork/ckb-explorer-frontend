/* eslint-disable react-hooks/rules-of-hooks */
import { ForwardedRef, forwardRef, useMemo } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation, useParams } from 'react-router-dom'
import * as H from 'history'
import { SupportedLng, SupportedLngs } from '../../utils/i18n'

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

function addI18nPrefix(url: string, lng?: string) {
  if (lng == null || !url.startsWith('/')) return url

  return `/${lng}${url}`
}

function removeI18nPrefix(url: string) {
  const prefix = SupportedLngs.find(lng => url.startsWith(`/${lng}`))
  if (prefix == null) return url

  return url.slice(prefix.length + 1)
}
