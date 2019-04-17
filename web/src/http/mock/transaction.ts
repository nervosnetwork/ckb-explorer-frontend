import { TransactionWrapper } from '../response/Transaction'
import { ScriptWrapper } from '../response/Script'
import { DataWrapper } from '../response/Data'
import { Response } from '../response/Response'

export const TransactionData: Response<TransactionWrapper> = {
  data: {
    id: 12,
    type: 'transaction',
    attributes: {
      transaction_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
      block_number: '770',
      block_timestamp: 1553068833785,
      transaction_fee: 666,
      version: 0,
      display_inputs: [
        {
          id: 101,
          address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
          capacity: 100,
        },
        {
          id: 102,
          address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
          capacity: 100,
        },
      ],
      display_outputs: [
        {
          id: 103,
          address_hash: '0x3abd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae324',
          capacity: 100,
        },
        {
          id: 104,
          address_hash: '0xddbd21e6e51674bb961bb4c5f3cee9faa5da30e64be10628dc1cef292cbae323',
          capacity: 100,
        },
      ],
    },
  },
}

export const LockScriptData: Response<ScriptWrapper> = {
  data: {
    id: 12,
    type: 'lock_script',
    attributes: {
      binary_hash: '0x97f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacd',
      args: ['0x99f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacf'],
    },
  },
}

export const TypeScriptData: Response<ScriptWrapper> = {
  data: {
    id: 12,
    type: 'type_script',
    attributes: {
      binary_hash: '0x97f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacd',
      args: ['0x99f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacf'],
    },
  },
}

export const CellData: Response<DataWrapper> = {
  data: {
    id: 12,
    type: 'data',
    attributes: {
      data: '0x97f982dd3149da69e05e8867ccebd84eebdddaf947cc2618a1dca7683eadeacd',
    },
  },
}
