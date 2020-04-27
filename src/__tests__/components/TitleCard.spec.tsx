import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import TitleCard from '../../components/Card/TitleCard'

describe('TitleCard Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <TitleCard title="title" />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.title__card__content')).toHaveLength(1)
    expect(wrapper.find('.title__card__content').text()).toBe('title')
  })
})
