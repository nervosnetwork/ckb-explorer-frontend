import { useSearchParams, useUpdateSearchParams } from '../../../hooks'

export function useIsDeprecatedAddressesDisplayed() {
  const { addr_format } = useSearchParams('addr_format')
  const updateSearchParams = useUpdateSearchParams<'addr_format'>()

  const isDeprecatedAddressesDisplayed = addr_format === 'deprecated'
  const addrFormatToggleURL = updateSearchParams(
    params => ({
      ...params,
      addr_format: isDeprecatedAddressesDisplayed ? null : 'deprecated',
    }),
    false,
    false,
  )

  return [isDeprecatedAddressesDisplayed, addrFormatToggleURL] as const
}
