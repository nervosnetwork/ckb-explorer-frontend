import { toBigEndian } from '@nervosnetwork/ckb-sdk-utils'

export const parseBtcTimeLockArgs = (args: string) => {
  // btc time lock: https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/locscript-design-prd-cn.md#btc_time_lock
  const LOCK_SCRIPT_LEN = 178
  const AFTER_LEN = 8
  const TXID_LEN = 64
  const LOCK_SCRIPT_END = 2 + LOCK_SCRIPT_LEN
  const AFTER_END = LOCK_SCRIPT_END + AFTER_LEN
  const TXID_END = AFTER_END + TXID_LEN

  const script = args.slice(2, LOCK_SCRIPT_END)
  const after = args.slice(LOCK_SCRIPT_END, AFTER_END)
  const btcTx = args.slice(AFTER_END, TXID_END)

  const res = {
    script,
    after: Number(toBigEndian(`0x${after}`)),
    txid: toBigEndian(`0x${btcTx}`).slice(2),
  }

  return res
}
