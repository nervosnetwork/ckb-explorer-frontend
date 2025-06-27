import config from '../../config'

const { DID_INDEXER_URL: didIndexerUrls } = config

const didIndexerUrl = didIndexerUrls[0]

export const getReverseAddresses = async (account: string): Promise<ReverseAddress[] | null> => {
  if (!didIndexerUrl) return null

  try {
    const response = await fetch(`${didIndexerUrl}/v1/account/reverse/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account,
      }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data?.data?.list ?? null
  } catch {
    return null
  }
}

interface ReverseAddress {
  key_info: Record<'chain_id' | 'coin_type' | 'key', string>
  type: string
}
