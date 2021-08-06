import { lement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import * as timezoneMock from 'timezone-mock'
import { BrowserRouter } from 'react-router-dom'
import TransactionItem from '../../components/TransactionItem'
import { toCamelcase } from '../../utils/util'

const tx = {
  is_cellbase: false,
  witnesses: [
    '0x550000001000000055000000550000004100000074032cdce1e2a28f4a45c37578656fc6ed98762f0ae276a668e5df6351336da56cd16075998153bd08b0164e3d01c74bb0c8e998b28efe619b3db71dfe13e0b501',
    '0x5500000010000000550000005500000041000000bbb28d6722caff9fcd6f0b4d11ae78e858a411eb846620163d659d7e6fc1af195ea68c8e8f4b196f6ce5498b21d0132f17256d4593afbda64895e68b06280cae01',
    '0x',
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
  transaction_hash: '0x89699abf948440ce172a6ef118cbf6986aa7c80d24d57d9309ca11929cebe5c4',
  transaction_fee: '4818',
  block_number: '1542388',
  version: '0',
  block_timestamp: '1587648896878',
  display_inputs: [
    {
      id: '2045056',
      from_cellbase: false,
      capacity: '10023577190.0',
      address_hash: 'ckb1qyqdpmfusmag3m9qjz3fenwa3qym3nc8prsqxxggjg',
      generated_tx_hash: '0xbebc637dd1eee18e73590683478b6038b75427a6d3557d90e34b9a0b44c7c2cc',
      cell_index: '1',
      cell_type: 'normal',
    },
    {
      id: '2076355',
      from_cellbase: false,
      capacity: '190296799086.0',
      address_hash: 'ckb1qyq93m8fdcx2knfmjyyn4q69zyhy7ggg835sl03lwy',
      generated_tx_hash: '0x7d5b5854a6d9a8dfb33188463d51d8c2d03a6b160815667cf15101f7b180f44b',
      cell_index: '75',
      cell_type: 'normal',
    },
    {
      id: '2051475',
      from_cellbase: false,
      capacity: '200221141693.0',
      address_hash: 'ckb1qyq93m8fdcx2knfmjyyn4q69zyhy7ggg835sl03lwy',
      generated_tx_hash: '0x49053d8717a41115a0c797a42abb3a4880ea2cdfbb8458f773b651b02737959c',
      cell_index: '62',
      cell_type: 'normal',
    },
    {
      id: '2063865',
      from_cellbase: false,
      capacity: '203966621540.0',
      address_hash: 'ckb1qyq93m8fdcx2knfmjyyn4q69zyhy7ggg835sl03lwy',
      generated_tx_hash: '0x59d72c3e3a5412a5e90eb1466eb801cdfaa6ccfa180d84a594c88fd426945c11',
      cell_index: '79',
      cell_type: 'normal',
    },
  ],
  display_outputs: [
    {
      id: '2082161',
      capacity: '590000000000.0',
      address_hash: 'ckb1qyqwr7vnfh6pcw2az25kkz3f4eq5a7ggec3qjyrfah',
      status: 'live',
      consumed_tx_hash: '',
      cell_type: 'nervos_dao_deposit',
    },
    {
      id: '2082162',
      capacity: '14508134691.0',
      address_hash: 'ckb1qyq907p79d6kkz7kxgu0awea8esvafm0586sh3kk9v',
      status: 'live',
      consumed_tx_hash: '',
      cell_type: 'normal',
    },
  ],
  income: null,
}

describe('TransactionItem Component', () => {
  let component: ReactElement

  beforeAll(() => {
    timezoneMock.register('UTC')

    const transaction = toCamelcase(tx) as State.Transaction
    component = (
      <BrowserRouter>
        <TransactionItem transaction={transaction} />
      </BrowserRouter>
    )
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(TransactionItem)).toHaveLength(1)
  })
})
