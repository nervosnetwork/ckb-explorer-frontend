import axios from 'axios'
import config from '../../config'
import { IS_MAINNET } from '../../constants/common'

const { BTC_TEST_IDENTIFIER } = config

export const getBtcChainIdentify = async (txid: string) => {
  if (IS_MAINNET) {
    return 'mainnet'
  }

  const identify = await axios
    .get<{ chain: string }>(`${BTC_TEST_IDENTIFIER}/api/signet?${new URLSearchParams({ txid })}`)
    .catch(() => {
      return {
        data: {
          chain: 'testnet',
        },
      }
    })
  return identify.data.chain
}
