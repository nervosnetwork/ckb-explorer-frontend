import { Address, ClientPublicMainnet, ClientPublicTestnet } from '@ckb-ccc/core'
import { Err, MultiVersionAddress } from './types'
import { explorerService } from '../../../services/ExplorerService'

export type ParseResult = MultiVersionAddress | Err

export async function parseMultiVersionAddress(
  script: CKBComponents.Script,
  isMainnet?: boolean,
): Promise<ParseResult> {
  try {
    const { data: matchedScripts } = await explorerService.api.fetchScriptInfo(script.codeHash, script.hashType)
    const { name } = matchedScripts[0]
    const ckb2021 = Address.fromScript(script, isMainnet ? new ClientPublicMainnet() : new ClientPublicTestnet())

    if (script.hashType === 'data1' || script.hashType === 'data2') {
      return {
        name,
        script,
        ckb2021FullFormat: ckb2021.toString(),
      }
    }

    return {
      name,
      script,
      ckb2021FullFormat: ckb2021.toString(),
    }
  } catch {
    return { error: 'Invalid script' }
  }
}
