import BigNumber from 'bignumber.js'
import { Fiber } from '../services/ExplorerService/fetcher'
import { shannonToCkb } from './util'

export const formalizeChannelAsset = (ch: Fiber.Graph.Channel) => {
  const isUdtFunding = !!ch.openTransactionInfo.udtInfo

  let fundingValue = null
  let fundingAmount = null
  let fundingSymbol = null
  let totalLiquidity = null

  if (ch.openTransactionInfo.udtInfo) {
    // is udt funding
    const value = BigNumber(ch.openTransactionInfo.udtInfo.amount)
    fundingValue = value.toFormat({ groupSeparator: '' })
    const a = value.dividedBy(BigNumber(10).pow(ch.openTransactionInfo.udtInfo.decimal ?? 0))
    fundingAmount = a.toFormat({ groupSeparator: '' })
    if (ch.openTransactionInfo.udtInfo.symbol) {
      fundingSymbol = ch.openTransactionInfo.udtInfo.symbol
    }
    totalLiquidity = fundingAmount
  } else {
    // is ckb funding
    fundingValue = shannonToCkb(ch.openTransactionInfo.capacity)
    fundingAmount = fundingValue
    fundingSymbol = 'CKB'
    totalLiquidity = shannonToCkb(ch.capacity)
  }

  const close: Record<'addr' | 'value' | 'amount' | 'symbol', string>[] = []

  if (ch.closedTransactionInfo.closeAccounts) {
    ch.closedTransactionInfo.closeAccounts.forEach(a => {
      if (a.udtInfo) {
        const value = BigNumber(a.udtInfo.amount)
        const v = value.toFormat({ groupSeparator: '' })
        const am = value.dividedBy(BigNumber(10).pow(a.udtInfo.decimal ?? 0))
        const amount = am.toFormat({ groupSeparator: '' })
        let symbol = ''
        if (a.udtInfo.symbol) {
          symbol = a.udtInfo.symbol
        }
        close.push({
          addr: a.address,
          value: v,
          amount,
          symbol,
        })
      } else {
        const v = shannonToCkb(a.capacity)
        const am = v
        close.push({
          addr: a.address,
          value: v,
          amount: am,
          symbol: 'CKB',
        })
      }
    })
  }

  return {
    funding: {
      isUdtFunding,
      amount: fundingAmount,
      symbol: fundingSymbol,
      value: fundingValue,
    },
    close: close.length ? close : null,
    totalLiquidity,
  }
}
