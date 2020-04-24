import React from 'react'
import { shallow } from 'enzyme'
import NotFoundPage from '../../pages/404'

describe('Active Page', () => {
  it('is defined', () => {
    const app = shallow(<NotFoundPage />)

    expect(app).toBeDefined()
  })
})
