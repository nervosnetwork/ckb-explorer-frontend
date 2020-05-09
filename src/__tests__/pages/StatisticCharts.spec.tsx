import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import StatisticsChart from '../../pages/StatisticsChart'
import { BrowserRouter } from 'react-router-dom'

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<StatisticsChart />)

    expect(app).toBeDefined()
  })

  it('shallow renders with empty data', async () => {
    const wrapper = renderer
      .create(
        <BrowserRouter>
          <StatisticsChart />
        </BrowserRouter>,
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})
