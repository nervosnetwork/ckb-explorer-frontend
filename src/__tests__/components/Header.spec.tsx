import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Header from '../../components/Header'
import { BrowserRouter } from 'react-router-dom'

describe('Header Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = (
      <BrowserRouter>
        <Header />
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
    expect(wrapper.find(Header)).toHaveLength(1)
  })
})
