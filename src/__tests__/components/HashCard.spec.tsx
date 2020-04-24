import React from 'react'
import { shallow } from 'enzyme'
import HashCard from '../../components/Card/HashCard'
import { Link } from 'react-router-dom'
import renderer from 'react-test-renderer'
import SmallLoading from '../../components/Loading/SmallLoading'

describe('HashCard Component', () => {
  it('shallow renders', () => {
    const wrapper = renderer.create(<HashCard title="hash title" hash="0xa18fdb8a" />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(<HashCard title="hash title" hash="0xa18fdb8a" loading />).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(<HashCard title="hash title" hash="0xa18fdb8a" />)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.hash__title')).toHaveLength(1)
    expect(wrapper.find('.hash__title').text()).toBe('hash title')
    expect(wrapper.find('#hash__text')).toHaveLength(1)
    expect(wrapper.find('.hash__copy_icon')).toHaveLength(1)
  })

  it('Component Render with loading', () => {
    const wrapper = shallow(<HashCard title="hash title" hash="0xa18fdb8a" loading />)
    expect(wrapper.find('#hash__text')).toHaveLength(0)
    expect(wrapper.find(SmallLoading)).toHaveLength(1)
  })

  it('Component Render with specialAddress', () => {
    const wrapper = shallow(<HashCard title="hash title" hash="0xa18fdb8ac5" specialAddress="0xa18fdb8" />)

    expect(wrapper.find(Link)).toHaveLength(1)
    expect(wrapper.find(Link).props().to).toBe('/address/0xa18fdb8')
  })
})
