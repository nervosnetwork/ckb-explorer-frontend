const TransactionData = {
  type: 'transaction',
  data: {
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
  status: 200,
  message: 'success',
}

const Cell = {
  type: 'cell',
  cell_type: 'input',
  data_type: 'lock_script',
  data: {
    version: 0,
    reference: '0x97f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacd',
    signed_args: ['0x97f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacd'],
    args: ['0x99f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacf'],
  },
  status: 200,
  message: 'success',
}

export { TransactionData, Cell }
