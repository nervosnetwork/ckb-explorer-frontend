import { ckbDecimals } from '@ckb-lumos/bi'
import BigNumber from 'bignumber.js'

/**
 * 6/10 of 7th output in the genesis should be excluded because they are expected to be burnt.
 * ref: https://talk.nervos.org/t/how-to-get-the-average-occupied-bytes-per-live-cell-in-ckb/7138/2?u=keith
 * */
const EXCLUDE = BigNumber('504000000000000000')
const CKB_DECIMAL = BigNumber(10).pow(ckbDecimals)

export const getKnowledgeSize = async (nodeUrl: string) => {
  const header = await fetch(nodeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'get_tip_header',
      params: [],
    }),
  })
    .then(res => res.json())
    .then(res => res.result)
  const { dao } = header

  const [, , , u] = dao
    .slice(2)
    .match(/\w{16}/g)
    .map((i: string) => i.match(/\w{2}/g)?.reverse().join('') ?? '')
  const total = BigNumber(`0x${u}`).minus(EXCLUDE).div(CKB_DECIMAL).toNumber()
  return total
}
