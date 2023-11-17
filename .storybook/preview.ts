import 'antd/dist/antd.css'
// This should be after all third-party library styles so that it can override them.
import '../src/index.css'
import '../src/utils/i18n'
import type { Preview } from '@storybook/react'
import { MINIMAL_VIEWPORTS, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: { ...MINIMAL_VIEWPORTS, ...INITIAL_VIEWPORTS },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
