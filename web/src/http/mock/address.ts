import { AddressWrapper } from '../response/Address'
import { TransactionWrapper } from '../response/Transaction'
import { Response } from '../response/Response'

export const AddressData: Response<AddressWrapper> = {
  data: {
    id: 10,
    type: 'address',
    attributes: {
      address_hash: '0xnj7982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadekoi',
      balance: 1000,
      transactions_count: 100,
      cell_consumed: 50,
      lock_script: {
        args: ['pubk', 'pubk'],
        binary_hash: '0xnj7982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadekoi',
      },
    },
  },
}

export const TransactionsData: Response<TransactionWrapper[]> = {
  meta: {
    total: 200,
  },
  data: [
    {
      id: 10,
      type: 'address_transaction',
      attributes: {
        transaction_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
        block_number: '770',
        block_timestamp: 1553068833785,
        transaction_fee: 666,
        version: 0,
        display_inputs: [
          {
            input_id: 101,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            input_id: 102,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
        display_outputs: [
          {
            output_id: 103,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            output_id: 104,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
      },
    },
    {
      id: 11,
      type: 'address_transaction',
      attributes: {
        transaction_hash: '0xmk8721e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
        block_number: '770',
        block_timestamp: 1553068833785,
        transaction_fee: 666,
        version: 0,
        display_inputs: [
          {
            input_id: 101,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            input_id: 102,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
        display_outputs: [
          {
            output_id: 103,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            output_id: 104,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
      },
    },
    {
      id: 12,
      type: 'address_transaction',
      attributes: {
        transaction_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10623dc1cef292cbae324',
        block_number: '770',
        block_timestamp: 1553068833785,
        transaction_fee: 666,
        version: 0,
        display_inputs: [
          {
            input_id: 101,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            input_id: 102,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
        display_outputs: [
          {
            output_id: 103,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            output_id: 104,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
      },
    },
    {
      id: 13,
      type: 'address_transaction',
      attributes: {
        transaction_hash: '0x3abd21e6e51674bb961bb565f3cee9faa5da30e64be10623dc1cef292cbae324',
        block_number: '770',
        block_timestamp: 1553068833785,
        transaction_fee: 666,
        version: 0,
        display_inputs: [
          {
            input_id: 101,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            input_id: 102,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
        display_outputs: [
          {
            output_id: 103,
            address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
            capacity: 100,
          },
          {
            output_id: 104,
            address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
            capacity: 100,
          },
        ],
      },
    },
  ],
}
