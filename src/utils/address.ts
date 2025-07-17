import { Address, ScriptLike, ClientPublicMainnet, ClientPublicTestnet } from '@ckb-ccc/core'
import { generateAddress } from '@ckb-lumos/helpers'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { IS_MAINNET } from '../constants/common'
import { LUMOS_MAINNET_CONFIG, LUMOS_TESTNET_CONFIG } from '../constants/scripts'

const lumosConfig = IS_MAINNET ? LUMOS_MAINNET_CONFIG : LUMOS_TESTNET_CONFIG

export const encodeNewAddress = (script: ScriptLike) => {
  return Address.fromScript(script, IS_MAINNET ? new ClientPublicMainnet() : new ClientPublicTestnet()).toString()
}

export const encodeDeprecatedAddress = (script: ScriptLike) => {
  if (script.hashType === 'data1') {
    return encodeNewAddress(script)
  }

  if (script.hashType === 'data2') {
    return encodeNewAddress(script)
  }

  return generateAddress(
    {
      codeHash: script.codeHash.toString(),
      hashType: script.hashType.toString() as 'type' | 'data' | 'data1' | 'data2',
      args: script.args.toString(),
    },
    { config: lumosConfig },
  )
}

export const compareAddress = (address1: string, address2: string) => {
  const script1 = addressToScript(address1)
  const script2 = addressToScript(address2)

  return script1.codeHash === script2.codeHash && script1.hashType === script2.hashType && script1.args === script2.args
}
