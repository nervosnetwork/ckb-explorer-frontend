import { ccc } from '@ckb-ccc/core'

// btc time lock: https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/lockscript-design-prd-en.md#btc_time_lock
const BTCTimeLockCodec = ccc.mol.table({
  lockScript: ccc.Script,
  after: ccc.mol.Uint64,
  btcTxid: ccc.mol.Byte32,
})

export const parseBtcTimeLockArgs = (args: string) => {
  const { lockScript, after, btcTxid } = BTCTimeLockCodec.decode(args)

  const res = {
    script: lockScript,
    after: Number(after),
    txid: ccc.hexFrom(btcTxid).slice(2).match(/\w{2}/g)?.reverse().join(''),
  }

  return res
}
