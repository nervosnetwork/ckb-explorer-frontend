import BigNumber from 'bignumber.js'

const EXCLUDE = BigNumber('504000000000000000')

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
  const total = BigNumber(`0x${u}`).minus(EXCLUDE).toFormat()
  return total
}
