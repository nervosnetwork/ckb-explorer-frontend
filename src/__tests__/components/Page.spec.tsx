import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import Page from '../../components/Page'
import { PagePanel } from '../../components/Page/styled'

describe('Page Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Page children={<div>children</div>} style={{ color: '#ffffff' }} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.children().text()).toBe('children')
    expect(wrapper.find(PagePanel)).toHaveLength(1)
  })
})
