import { render, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Search from './index'
import { initI18n } from '../../utils/i18n'

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

test('show clear button when content is available', async () => {
  initI18n()
  const { getByRole, getAllByRole } = render(
    <QueryClientProvider client={new QueryClient()}>
      <Search />
    </QueryClientProvider>,
  )
  const getClearButton = () => getAllByRole('button')[2]

  const inputEl = getByRole('textbox') as HTMLInputElement
  expect(inputEl).toBeInstanceOf(HTMLInputElement)
  expect(getClearButton()).toBeFalsy()

  fireEvent.change(inputEl, { target: { value: 'test' } })
  expect(inputEl.value).toBe('test')
  expect(getClearButton()).toBeTruthy()

  fireEvent.change(inputEl, { target: { value: '' } })
  expect(getClearButton()).toBeFalsy()

  fireEvent.change(inputEl, { target: { value: 'test' } })
  const btn = getClearButton()
  expect(btn).toBeTruthy()
  btn.click()
  expect(inputEl.value).toBe('')
  expect(getClearButton()).toBeFalsy()
})
