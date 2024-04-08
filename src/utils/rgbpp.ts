import { BTCTimeLock } from '@rgbpp-sdk/ckb'

export const parseBtcTimeLockArgs = (args: string) => {
  // btc time lock: https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/locscript-design-prd-cn.md#btc_time_lock

  const { lockScript, after, btcTxid } = BTCTimeLock.unpack(args)

  const res = {
    script: lockScript,
    after,
    txid: btcTxid.slice(2).match(/\w{2}/g)?.reverse().join(''),
  }

  return res
}
