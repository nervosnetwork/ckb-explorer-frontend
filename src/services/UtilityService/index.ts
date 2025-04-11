const UTILITY_ENDPOINT = 'https://ckb-utilities.random-walk.co.jp'

export const fetchPrices = async (): Promise<{
  price: Record<string, Record<'pair' | 'price', string>>
}> => {
  const response = await fetch(`${UTILITY_ENDPOINT}/api/price`)
  const data = await response.json()
  return data
}

export interface IpInfo {
  countryCode: string
  city: string
  lat: number
  lon: number
  isp: string
}

export const fetchIpsInfo = async (
  ips: string[],
): Promise<{
  ips: Record<string, IpInfo>
}> => {
  const data = await fetch(`${UTILITY_ENDPOINT}/api/ips`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ ips }),
  }).then(res => res.json())
  return data
}

export const claimTestToken = async (address: string, token: string) => {
  if (!address || !token) {
    throw new Error('Address and token are required')
  }
  const data = await fetch(`${UTILITY_ENDPOINT}/api/faucet`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ address, token: token.toLowerCase() }),
  }).then(res => {
    if (res.status === 200) {
      return res.json()
    }
    throw new Error('Failed to claim test token')
  })
  return data
}

export const CKB_PRICE_ID = '0x0000000000000000000000000000000000000000000000000000000000000000'
