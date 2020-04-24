import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Content from '../../components/Content'

describe('Content Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Content children={<div className="content__child">content</div>} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.content__child')).toHaveLength(1)
    expect(wrapper.find('.content__child').text()).toBe('content')
  })
})
