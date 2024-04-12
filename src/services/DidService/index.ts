import axios from 'axios'
import config from '../../config'

const { DID_INDEXER_URL: didIndexerUrls } = config

const didIndexerUrl = didIndexerUrls[0]

export const getReverseAddresses = async (account: string): Promise<ReverseAddress[] | null> => {
  if (!didIndexerUrl) return null

  return axios
    .post(`${didIndexerUrl}/v1/account/reverse/address`, {
      account,
    })
    .then(res => res.data?.data?.list ?? null)
    .catch(() => null)
}

interface ReverseAddress {
  key_info: Record<'chain_id' | 'coin_type' | 'key', string>
  type: string
}
