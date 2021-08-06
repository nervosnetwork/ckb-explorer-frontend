import { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import OverviewCard, { OverviewItem } from '../../components/Card/OverviewCard'

describe('OverviewCard Component', () => {
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
    component = <OverviewCard items={items} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.overview_content__left_items')).toHaveLength(1)
    expect(wrapper.find('.overview_content__right_items')).toHaveLength(1)
    expect(wrapper.find(OverviewItem)).toHaveLength(4)
  })
})
