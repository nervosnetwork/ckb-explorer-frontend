/* eslint-disable react-hooks/rules-of-hooks */
import { ForwardedRef, forwardRef, useMemo } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps, useParams } from 'react-router-dom'
import * as H from 'history'
import { SupportedLng } from '../../utils/i18n'

export interface LinkProps<S> extends RouterLinkProps<S> {
  lng?: SupportedLng
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps<unknown>>((({ lng, to, ...props }, ref) => {
  const { locale } = useParams<{ locale?: string }>()

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
