import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import NotFoundPage from '../../pages/404'

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<NotFoundPage />)

    expect(app).toBeDefined()
  })

  it('shallow renders with empty data', async () => {
    const wrapper = renderer.create(<NotFoundPage />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})
