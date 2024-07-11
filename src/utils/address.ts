import { Script } from '@ckb-lumos/base'
import { encodeToAddress, generateAddress } from '@ckb-lumos/helpers'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { IS_MAINNET } from '../constants/common'
import { LUMOS_MAINNET_CONFIG, LUMOS_TESTNET_CONFIG } from '../constants/scripts'

const lumosConfig = IS_MAINNET ? LUMOS_MAINNET_CONFIG : LUMOS_TESTNET_CONFIG

export const encodeNewAddress = (script: Script) => {
  return encodeToAddress(script, { config: lumosConfig })
}

export const encodeDeprecatedAddress = (script: Script) => {
  return generateAddress(script, { config: lumosConfig })
}

export const compareAddress = (address1: string, address2: string) => {
  const script1 = addressToScript(address1)
  const script2 = addressToScript(address2)

  return script1.codeHash === script2.codeHash && script1.hashType === script2.hashType && script1.args === script2.args
}
