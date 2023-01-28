import { toCamelcase } from '../utils/util'

export const blockMock = () => {
  return toCamelcase<{
    block: State.Block
    transactions: State.Transaction[]
    total: number
    status: State.FetchStatus
  }>({
    block: {
      block_hash: '0xd48737284040b2c6d221a16ba65b1497593ffb7b9cd250a1d0f40aecc5c8d4c0',
      block_index_in_epoch: '209',
      cell_consumed: '6100000000',
      difficulty: '72969622108522274',
      epoch: '1038',
      length: '1800',
      miner_hash: 'ckb1qyqgsqsd549m333prhzyvdvedluuuas9u2ssxkmf53',
      miner_reward: '106544901066',
      nonce: '218174220386130088675393873778844041472',
      number: '1706701',
      proposals_count: '0',
      received_tx_fee: '0',
      received_tx_fee_status: 'pending',
      reward: '106544901066',
      reward_status: 'pending',
      start_number: '1706492',
      timestamp: '1589002865754',
      total_cell_capacity: '111298326112',
      total_transaction_fee: '0',
      transactions_count: '1',
      transactions_root: '0xefa2d4a0c3c673ddcbf165a217bb8eb5c01765faaf51702a58b45184816a79a6',
      uncle_block_hashes: null,
      uncles_count: '0',
      version: '0',
    },
    transactions: {
      data: [
        {
          is_cellbase: true,
          witnesses: [
            '0x5d0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000dde7801c073dfb3464c7b1f05b806bb2bbb84e990400000000000000',
          ],
          cell_deps: [],
          header_deps: null,
          transaction_hash: '0xa8651bdc77bb196443ffd89ec8802ad6725bd36ba43a159cf15951e2102b2a65',
          transaction_fee: '0',
          block_number: '1706099',
          version: '0',
          block_timestamp: '1588997260542',
          display_inputs: [
            {
              id: '',
              from_cellbase: true,
              capacity: '',
              address_hash: '',
              target_block_number: '1706088',
              generated_tx_hash: '0xa8651bdc77bb196443ffd89ec8802ad6725bd36ba43a159cf15951e2102b2a65',
            },
          ],
          display_outputs: [
            {
              id: '2275538',
              capacity: '139900315691.0',
              address_hash: 'ckb1qyqquqf8c6002yzr72qvz3kxfa7zfnrsm4sqflv9zd',
              target_block_number: '1706088',
              base_reward: '133925154970',
              commit_reward: '0',
              proposal_reward: '0',
              secondary_reward: '5975160721',
              status: 'live',
              consumed_tx_hash: '',
            },
          ],
        },
        {
          is_cellbase: false,
          witnesses: [
            '0x55000000100000005500000055000000410000008d0c7c8a9a433018911f24c47a0a561c9778dc0c9766767158f33c02561165640c80e6978657e312823704f028866e65a339bdc062e63cf75ecb30d3b8f4e8db01',
            '0x',
          ],
          cell_deps: [
            {
              dep_type: 'dep_group',
              out_point: {
                index: 0,
                tx_hash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
              },
            },
            {
              dep_type: 'code',
              out_point: {
                index: 2,
                tx_hash: '0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c',
              },
            },
          ],
          header_deps: null,
          transaction_hash: '0x79238be9c68d888b976cdc86e40a0ca03f223d7487033cc0755283b79376ec66',
          transaction_fee: '3684',
          block_number: '1706099',
          version: '0',
          block_timestamp: '1588997260542',
          display_inputs: [
            {
              id: '2115183',
              from_cellbase: false,
              capacity: '930300000000.0',
              address_hash: 'ckb1qyqz67uumxel602l5t6zqf7qhqt6untg9z9qukhlha',
              generated_tx_hash: '0x5f0cec7e77478158a60242f02768c94db075de90b93735dd413241e3ac9dfd21',
              cell_index: '0',
              cell_type: 'normal',
            },
            {
              id: '2114922',
              from_cellbase: false,
              capacity: '9971320520000.0',
              address_hash: 'ckb1qyqz67uumxel602l5t6zqf7qhqt6untg9z9qukhlha',
              generated_tx_hash: '0x44c67dc4b5648120841c6cb73d8b13c2b2d7474df500b87a2241c550b06179ea',
              cell_index: '0',
              cell_type: 'normal',
            },
          ],
          display_outputs: [
            {
              id: '2275539',
              capacity: '10800000000000.0',
              address_hash: 'ckb1qyqzwn57q5p2a0mxv6s02zvs28ny3rjxh38qc2j3zn',
              status: 'live',
              consumed_tx_hash: '',
              cell_type: 'nervos_dao_deposit',
            },
            {
              id: '2275540',
              capacity: '101620516316.0',
              address_hash: 'ckb1qyqyg3ah0spf7ggsanjduvexl9psfp0fdypsa7jfwf',
              status: 'live',
              consumed_tx_hash: '',
              cell_type: 'normal',
            },
          ],
        },
      ],
    },
    total: 2,
    status: 'OK',
  })
}

export default blockMock
