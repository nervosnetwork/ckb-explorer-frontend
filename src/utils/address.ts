import { Script } from '@ckb-lumos/base'
import { encodeToAddress, generateAddress } from '@ckb-lumos/helpers'

import { IS_MAINNET } from '../constants/common'
import { LUMOS_MAINNET_CONFIG, LUMOS_TESTNET_CONFIG } from '../constants/scripts'

const lumosConfig = IS_MAINNET ? LUMOS_MAINNET_CONFIG : LUMOS_TESTNET_CONFIG

export const encodeNewAddress = (script: Script) => {
  return encodeToAddress(script, { config: lumosConfig })
}

export const encodeDeprecatedAddress = (script: Script) => {
  return generateAddress(script, { config: lumosConfig })
}
