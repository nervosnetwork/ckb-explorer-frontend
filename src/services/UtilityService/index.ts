const UTILITY_ENDPOINT = 'https://ckb-utilities.random-walk.co.jp'

export const fetchPrices = async (): Promise<{
  price: Record<string, Record<'pair' | 'price', string>>
}> => {
  const response = await fetch(`${UTILITY_ENDPOINT}/api/price`)
  const data = await response.json()
  return data
}
