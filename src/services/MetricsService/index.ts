import config from '../../config'
import { IS_MAINNET } from '../../constants/common'
import { MainnetContractHashTags, TestnetContractHashTags } from '../../constants/scripts'

const scripts = IS_MAINNET ? MainnetContractHashTags : TestnetContractHashTags

const { METRICS_API_URL } = config

export const getHolderAllocation = async (
  script: Record<'code_hash' | 'hash_type' | 'args', string>,
): Promise<Record<string, number>> => {
  if ('fetch' in window) {
    const res = await fetch(`${METRICS_API_URL!}/api/holder_allocation?${new URLSearchParams(script)}`).then(res =>
      res.json(),
    )
    const allocation: Record<string, number> = {}
    Object.keys(res).forEach(codeHash => {
      const s = scripts.find(s => s.codeHashes.includes(codeHash))
      const label = s?.tag ?? `${codeHash.slice(0, 8)}...${codeHash.slice(-8)}`
      const count = res[codeHash]
      allocation[label] = (allocation[label] ?? 0) + count
    })
    return allocation
  }
  return {}
}
