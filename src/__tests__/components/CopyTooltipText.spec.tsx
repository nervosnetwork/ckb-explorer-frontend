import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import CopyTooltipText from '../../components/Text/CopyTooltipText'

describe('CopyTooltipText Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <CopyTooltipText content="content" />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('#copy__content__content')).toHaveLength(1)
  })
})
