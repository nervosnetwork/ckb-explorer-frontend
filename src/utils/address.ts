import { Address, ScriptLike, ClientPublicMainnet, ClientPublicTestnet } from '@ckb-ccc/core'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { IS_MAINNET } from '../constants/common'

export const encodeNewAddress = (script: ScriptLike) => {
  return Address.fromScript(script, IS_MAINNET ? new ClientPublicMainnet() : new ClientPublicTestnet()).toString()
}

export const compareAddress = (address1: string, address2: string) => {
  const script1 = addressToScript(address1)
  const script2 = addressToScript(address2)

  return script1.codeHash === script2.codeHash && script1.hashType === script2.hashType && script1.args === script2.args
}
