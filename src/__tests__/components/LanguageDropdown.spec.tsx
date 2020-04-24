import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import Language, { languageText } from '../../components/Dropdown/Language'
import i18n from '../../utils/i18n'

describe('Language Dropdown Component', () => {
  let component: ReactElement

  beforeAll(() => {
    component = <Language setShow={() => {}} top={0} left={0} />
  })

  it('shallow renders', () => {
    const wrapper = renderer.create(component).toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('Component Render', () => {
    const wrapper = shallow(component)
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.language__selected')).toHaveLength(1)
    expect(wrapper.find('.language__normal')).toHaveLength(1)
  })

  it('languageText function', () => {
    expect(languageText('en')).toBe(i18n.t('navbar.language_en'))
    expect(languageText('zh', true)).toBe(i18n.t('navbar.language_en'))
  })
})
