import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import * as AppContext from '../../contexts/providers'
import AddressBalanceRank from '../../pages/StatisticsChart/activities/AddressBalanceRank'
import initState from '../../contexts/states'
import AddressBalanceRankMock from '../../__mocks__/charts'

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<AddressBalanceRank />)

    expect(app).toBeDefined()
  })

  it('shallow renders with empty data', async () => {
    const wrapper = renderer.create(<AddressBalanceRank />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('shallow renders', async () => {
    const contextAppState: State.AppState = {
      ...initState,
      statisticAddressBalanceRanks: AddressBalanceRankMock,
    }
    jest.spyOn(AppContext, 'useAppState').mockImplementation(() => contextAppState)
    const wrapper = shallow(<AddressBalanceRank />)
    await Promise.resolve()
    expect(wrapper).toMatchSnapshot()
  })
})
