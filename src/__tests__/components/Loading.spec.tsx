import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Loading from '../../components/Loading'
import SmallLoading from '../../components/Loading/SmallLoading'
import { LoadingPanel } from '../../components/Loading/styled'
import { SmallLoadingPanel } from '../../components/Loading/SmallLoading/styled'

describe('Loading Component', () => {
  let loading: ReactElement
  let smallLoading: ReactElement

  beforeAll(() => {
    loading = <Loading show />
    smallLoading = <SmallLoading />
  })

  it('shallow renders', () => {
    let wrapper = renderer.create(loading).toJSON()
    expect(wrapper).toMatchSnapshot()

    wrapper = renderer.create(smallLoading).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    let wrapper = shallow(loading)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(LoadingPanel).children().length).toBe(1)

    wrapper = shallow(smallLoading)
    expect(wrapper).toBeDefined()
    expect(wrapper.find(SmallLoadingPanel).children().length).toBe(1)
  })
})
