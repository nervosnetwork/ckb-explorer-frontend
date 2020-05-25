import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import ItemCard, { ItemDetail } from '../../components/Card/ItemCard'
import renderer from 'react-test-renderer'

describe('ItemCard Component', () => {
  let component: ReactElement

  beforeAll(() => {
    const items = [
      {
        title: 'title1',
        content: 'content1',
      },
      {
        title: 'title2',
        content: <div>content2</div>,
      },
      {
        title: 'title3',
        content: 'content3',
      },
      {
        title: 'title4',
        content: <div>content4</div>,
      },
    ]
    component = <ItemCard items={items} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(ItemDetail)).toHaveLength(4)
  })
})
