import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import type { Fiber } from '../../../services/ExplorerService/fetcher'
import { parseNumericAbbr } from '../../../utils/chart'
import { localeNumberString, parseUDTAmount } from '../../../utils/number'
import { shannonToCkb } from '../../../utils/util'

export const getFundingThreshold = (n: Fiber.Graph.Node) => {
  const ckb = shannonToCkb(n.autoAcceptMinCkbFundingAmount)
  const amount = parseNumericAbbr(ckb)

  const tokens: { title: string; display: string; id: string; icon?: string }[] = [
    {
      title: `${localeNumberString(ckb)} CKB`,
      display: `${amount} CKB`,
      id: 'ckb',
      icon: '/images/tokens/ckb_token.svg',
    },
  ]

  n.udtCfgInfos.forEach(udt => {
    if (udt && udt.autoAcceptAmount && typeof udt.decimal === 'number' && udt.symbol) {
      try {
        const udtAmount = parseUDTAmount(udt.autoAcceptAmount, udt.decimal)
        const id = scriptToHash({
          codeHash: udt.codeHash,
          hashType: udt.hashType,
          args: udt.args,
        })
        tokens.push({
          title: `${localeNumberString(udtAmount)} ${udt.symbol}`,
          display: `${parseNumericAbbr(udtAmount)} ${udt.symbol}`,
          icon: udt.iconFile,
          id,
        })
      } catch (e) {
        console.error(e)
      }
    }
  })

  return tokens
}
