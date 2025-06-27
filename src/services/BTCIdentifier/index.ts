import config from '../../config'
import { IS_MAINNET } from '../../constants/common'

const { BTC_TEST_IDENTIFIER } = config

export const getBtcChainIdentify = async (txid: string) => {
  if (IS_MAINNET) {
    return 'mainnet'
  }

  try {
    const response = await fetch(`${BTC_TEST_IDENTIFIER}/api/signet?${new URLSearchParams({ txid })}`)
    const data = await response.json()
    return data.chain
  } catch {
    return 'testnet'
  }
}
