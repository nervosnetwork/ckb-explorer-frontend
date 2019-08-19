
import {toCamelcase} from '../src/utils/util'

describe('Number methods tests', () => {
  it('pasre simple object to camelcase', async () => {
    interface Data {
      dataName: string,
      dataValue: string,
    }
    const data = {
      data_name: 'hello',
      data_value: 'world'
    }
    const result: Data | null = toCamelcase(data)
    expect(result).toStrictEqual({"dataName": "hello", "dataValue": "world"})
  })

  it('pasre complex object to camelcase', async () => {
    interface Data {
      dataName: string,
      dataValue: {
        aValue: string,
        bValue: string,
      }
    }
    const data = {
      data_name: 'hello',
      data_value: {
        a_value: 'a',
        b_value: 'b',
      }
    }
    const result: Data | null = toCamelcase(data)
    expect(result).toStrictEqual({"dataName": "hello", "dataValue": {"aValue": "a", "bValue": "b"}})
  })
})
