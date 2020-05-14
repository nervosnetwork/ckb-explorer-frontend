import { toCamelcase } from '../utils/util'

export const latestBlocksMock = () => {
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

export const latestTxMock = () => {
  return toCamelcase<State.Transaction[]>([
    {
      transaction_hash: '0x896ff246313e0a9fc7b392af6665774460d6d8614783f40764b17864bde10643',
      block_number: '1687517',
      block_timestamp: '1588845263114',
      capacity_involved: '111303491978',
      live_cell_changes: '1',
    },
    {
      transaction_hash: '0x19ec38d35659da5a9e5d941ee269a134002fa43344bf83e65ea4b2cbbc40a2c2',
      block_number: '1687509',
      block_timestamp: '1588845185757',
      capacity_involved: '111303525492',
      live_cell_changes: '1',
    },
    {
      transaction_hash: '0x69df00a2b94ab0372a4ecd4ce8ac7dd44c15b406ed5154d5425f9bfb3119a8d0',
      block_number: '1687501',
      block_timestamp: '1588845110452',
      capacity_involved: '111303562450',
      live_cell_changes: '1',
    },
  ]) as State.Transaction[]
}

export const statisticMock = (): State.Statistics => {
  return toCamelcase<State.Statistics>({
    epoch_info: {
      epoch_number: '1026',
      epoch_length: '1800',
      index: '1402',
    },
    tip_block_number: '1687044',
    average_block_time: '8017.05',
    current_epoch_difficulty: '62246971368478813',
    hash_rate: '7722354397338.191716364963207719284020190144128439',
    estimated_epoch_time: '14509117.647058823529411764705882352941176470588234368272300616634345632',
    transactions_last_24hrs: '11302',
    transactions_count_per_minute: '7.783411604018934645536699908',
  }) as State.Statistics
}

export const TipBlockNumberMock = 1686163
