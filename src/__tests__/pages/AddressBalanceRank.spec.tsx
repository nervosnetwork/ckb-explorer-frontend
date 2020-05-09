import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import AddressBalanceRank from '../../pages/StatisticsChart/activities/AddressBalanceRank'

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<AddressBalanceRank />)

    expect(app).toBeDefined()
  })

  it('shallow renders with empty data', async () => {
    const wrapper = renderer.create(<AddressBalanceRank />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})
