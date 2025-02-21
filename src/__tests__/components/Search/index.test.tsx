import { render, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initI18n } from '../../../utils/i18n'
import Search from '../../../components/Search'

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
  const { getByRole, queryByTitle } = render(
    <QueryClientProvider client={new QueryClient()}>
      <Search />
    </QueryClientProvider>,
  )
  const getClearButton = () => queryByTitle('clear')

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
  fireEvent.click(btn!)
  expect(inputEl.value).toBe('')
  expect(getClearButton()).toBeFalsy()
})
