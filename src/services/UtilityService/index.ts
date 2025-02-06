const UTILITY_ENDPOINT = 'https://ckb-utilities.random-walk.co.jp'

export const fetchPrices = async (): Promise<{
  price: Record<string, Record<'pair' | 'price', string>>
}> => {
  const response = await fetch(`${UTILITY_ENDPOINT}/api/price`)
  const data = await response.json()
  return data
}

export const fetchIpsInfo = async (
  ips: string[],
): Promise<{
  ips: Record<
    string,
    {
      countryCode: string
      city: string
      lat: number
      lon: number
      ips: string
    }
  >
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
