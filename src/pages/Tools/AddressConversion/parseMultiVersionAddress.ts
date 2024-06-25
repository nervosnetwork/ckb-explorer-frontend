import { Script } from '@ckb-lumos/base'
import { helpers, type Config } from '@ckb-lumos/config-manager'
import { encodeToAddress } from '@ckb-lumos/helpers'
import { Err, MultiVersionAddress } from './types'

export type ParseResult = MultiVersionAddress | Err

export function parseMultiVersionAddress(script: Script, config: Config): ParseResult {
  try {
    const name = helpers.nameOfScript(script, config.SCRIPTS) as string | undefined
    const ckb2021 = encodeToAddress(script, { config })

    if (script.hashType === 'data1' || script.hashType === 'data2') {
      return {
        name,
        script,
        ckb2021FullFormat: ckb2021,
      }
    }

    return {
      script,
      name,
      ckb2021FullFormat: encodeToAddress(script, { config }),
    }
  } catch {
    return { error: 'Invalid script' }
  }
}
