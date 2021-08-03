import { ReactElement } from 'react'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import HashTag from '../../components/HashTag'

describe('HashTag Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <HashTag content="secp256k1" category="type" />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
    expect(wrapper).toHaveStyleRule('background-color', '#f0e0fb')
    expect(wrapper).toHaveStyleRule('width', '67.5px')
  })
})
