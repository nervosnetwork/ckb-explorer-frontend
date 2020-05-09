import { toCamelcase } from '../utils/util'

export const blocksMock = () => {
  return toCamelcase<State.Block[]>([
    {
      miner_hash: 'ckb1qyqqzmlaljcrd0mneh63sx4gzlyvhz0g35nsh6e30l',
      number: '1686123',
      timestamp: '1588834270583',
      reward: '111302205934',
      transactions_count: '1',
      live_cell_changes: '1',
    },
    {
      miner_hash: 'ckb1qyqdmeuqrsrnm7e5vnrmruzmsp4m9wacf6vsxasryq',
      number: '1686122',
      timestamp: '1588834268229',
      reward: '111302206061',
      transactions_count: '1',
      live_cell_changes: '1',
    },
    {
      miner_hash: 'ckb1qyqdmeuqrsrnm7e5vnrmruzmsp4m9wacf6vsxasryq',
      number: '1686121',
      timestamp: '1588834265890',
      reward: '111302206188',
      transactions_count: '1',
      live_cell_changes: '1',
    },
  ]) as State.Block[]
}

export const BlocksTotalMock = 3
