import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Loading from '../../components/Loading'
import { LoadingPanel } from '../../components/Loading/styled'

describe('Loading Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Loading show />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(LoadingPanel).children().length).toBe(1)
  })
})
