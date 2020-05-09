import { toCamelcase } from '../utils/util'

export const blockMock = () => {
  return toCamelcase<State.Block>({
    block_hash: '0x5e27b4fc4bc047059d5d5bf1faf3f7ce0482b6f23ef3cb776eccf347f86b9aff',
    block_index_in_epoch: '1675',
    cell_consumed: '22400000000',
    difficulty: '70556797891373751',
    epoch: '1032',
    length: '1800',
    miner_hash: 'ckb1qyqdmeuqrsrnm7e5vnrmruzmsp4m9wacf6vsxasryq',
    miner_reward: '111299994879',
    nonce: '60904167641264194554030616674560',
    number: '1697796',
    proposals_count: '1',
    received_tx_fee: '42632',
    received_tx_fee_status: 'calculated',
    reward: '111299952247',
    reward_status: 'issued',
    start_number: '1696121',
    timestamp: '1588928485013',
    total_cell_capacity: '10650309218672',
    total_transaction_fee: '4386',
    transactions_count: '2',
    transactions_root: '0x0bcd16965552ca30724fab0b7e2eca3ac75b0a5c099218fe6aff2c953d1e0a9a',
    uncle_block_hashes: null,
    uncles_count: '0',
    version: '0',
  }) as State.Block
}

export const blockTxsMock = () => {
  return toCamelcase<State.Transaction[]>([
    {
      is_cellbase: true,
      witnesses: [
        '0x5d0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000dde7801c073dfb3464c7b1f05b806bb2bbb84e990400000000000000',
      ],
      cell_deps: [],
      header_deps: null,
      transaction_hash: '0x7b5936a91733dd0e8821326b040916753ab3c0e494d80d93679c3eb1f191190f',
      transaction_fee: '0',
      block_number: '1697796',
      version: '0',
      block_timestamp: '1588928485013',
      display_inputs: [
        {
          id: '',
          from_cellbase: true,
          capacity: '',
          address_hash: '',
          target_block_number: '1697785',
          generated_tx_hash: '0x7b5936a91733dd0e8821326b040916753ab3c0e494d80d93679c3eb1f191190f',
        },
      ],
      display_outputs: [
        {
          id: '2265870',
          capacity: '111299953590.0',
          address_hash: 'ckb1qyqy5vmywpty6p72wpvm0xqys8pdtxqf6cmsr8p2l0',
          target_block_number: '1697785',
          base_reward: '106544901065',
          commit_reward: '0',
          proposal_reward: '0',
          secondary_reward: '4755052525',
          status: 'live',
          consumed_tx_hash: '',
        },
      ],
      income: null,
    },
    {
      is_cellbase: false,
      witnesses: [
        '0x5500000010000000550000005500000041000000c422a55ae7734fe13714c943b4ca094717c10bbd0eda1ae62f6483de4a00087e39bfdd195ef9b1899acb63c699d353040578f030bde8a8a766a943cede176e0a00',
        '0x550000001000000055000000550000004100000081afd7e214082a5ac53f7a6a26eb20d231e84131ee906f93d56227f6bdb844650212bda5e85f8c75e2f05a50f65e37d8f080767d438bcc58de244bf94b60bd7301',
      ],
      cell_deps: [
        {
          dep_type: 'dep_group',
          out_point: { index: 0, tx_hash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c' },
        },
        {
          dep_type: 'code',
          out_point: { index: 2, tx_hash: '0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c' },
        },
      ],
      header_deps: ['0x40785929067291599e47ca8ecf6f6d95011a009ecffd6beca22382b66f3c0065'],
      transaction_hash: '0x593f1273701ba2691cbc42e1ae60cd0835647277c50511ad7c92b2166d452ca5',
      transaction_fee: '4386',
      block_number: '1697796',
      version: '0',
      block_timestamp: '1588928485013',
      display_inputs: [
        {
          id: '1446739',
          from_cellbase: false,
          capacity: '10532900000000.0',
          address_hash: 'ckb1qyqwg5r6p22c69lfpzrtn4nk4y22x5j6cnas7shnlc',
          generated_tx_hash: '0xd90a4de4a0b7969d3ee8d98931dc9884dd53b48b28adf173fa6191a2d717ff9f',
          cell_index: '0',
          cell_type: 'nervos_dao_deposit',
          compensation_started_block_number: '1697761',
          compensation_ended_block_number: '1697796',
          compensation_started_timestamp: '1588928175004',
          compensation_ended_timestamp: '1588928485013',
          interest: '3',
        },
        {
          id: '2265831',
          from_cellbase: false,
          capacity: '6109269468.0',
          address_hash: 'ckb1qyqyxad5xgnj7ln5qalm9svcqulk0k363d9sxkxhxd',
          generated_tx_hash: '0x53d5ebc5458f9c3ddaa3b6c57082abd21ba0dfeecfff168cf9315a85a625fa4c',
          cell_index: '1',
          cell_type: 'normal',
        },
      ],
      display_outputs: [
        {
          id: '2265871',
          capacity: '10532900000000.0',
          address_hash: 'ckb1qyqwg5r6p22c69lfpzrtn4nk4y22x5j6cnas7shnlc',
          status: 'live',
          consumed_tx_hash: '',
          cell_type: 'nervos_dao_withdrawing',
        },
        {
          id: '2265872',
          capacity: '6109265082.0',
          address_hash: 'ckb1qyqtxkquw3x049v45935ffduch483ryxplxsr3rt7j',
          status: 'live',
          consumed_tx_hash: '',
          cell_type: 'normal',
        },
      ],
      income: null,
    },
  ]) as State.Transaction[]
}

export const BlockTxsTotalMock = 2
