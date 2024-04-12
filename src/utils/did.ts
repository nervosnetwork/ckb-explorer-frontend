import type { Script } from '@ckb-lumos/base'
import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { IS_MAINNET } from '../constants/common'

export const ethToCKb = (ethAddr: string) => {
  const key = ethAddr.replace(/^0x/, '')
  const args = `0x05${key}05${key}`
  const scriptBase: Omit<Script, 'args'> = {
    codeHash: '0x9376c3b5811942960a846691e16e477cf43d7c7fa654067c9948dfcd09a32137', // TODO: this script is not registered,
    hashType: 'type',
  }
  return scriptToAddress({ ...scriptBase, args }, IS_MAINNET)
}
