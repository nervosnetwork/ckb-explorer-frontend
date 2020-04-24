import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Modal from '../../components/Modal'
import OutsideClickHandler from 'react-outside-click-handler'

describe('Modal Component', () => {
  let component: ReactElement
  let component1: ReactElement

  beforeAll(() => {
    component = <Modal children={<div className="modal__child">children</div>} isShow />
    component1 = <Modal children={<div className="modal__child">children</div>} isShow={false} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    let wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.modal__child')).toHaveLength(1)
    expect(wrapper.find(OutsideClickHandler)).toHaveLength(1)
    expect(wrapper.find('.modal__child').text()).toBe('children')

    wrapper = shallow(component1)
    expect(wrapper.find('.modal__child')).toHaveLength(0)
    expect(wrapper.find(OutsideClickHandler)).toHaveLength(0)
  })
})
