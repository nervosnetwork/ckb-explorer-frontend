import type { Meta, StoryObj } from '@storybook/react'

import AddressText from '.'
import styles from './index.stories.module.scss'
import { useForkedState } from '../../utils/hook'

const meta = {
  component: AddressText,
  argTypes: {
    children: {
      // In React 17, `FC<P>` is wrapped in `PropsWithChildren<P>`, causing the type of `children` to be unrecognizable by Storybook.
      description: 'This item will be used as text when text is empty.',
      type: 'string',
    },
  },
} satisfies Meta<typeof AddressText>

export default meta
type Story = StoryObj<typeof meta>

const addressHash = 'ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqflz4emgssc6nqj4yv3nfv2sca7g9dzhscgmg28x'

export const Primary: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
  args: {
    children: addressHash,
  },
}

export const UseTextWidthForPlaceholderWidth: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  args: {
    children: addressHash,
    useTextWidthForPlaceholderWidth: true,
    className: styles.border,
  },
  render: function Render(args) {
    const [useTextWidthForPlaceholderWidth, setUseTextWidthForPlaceholderWidth] = useForkedState(
      args.useTextWidthForPlaceholderWidth,
    )

    return (
      <div>
        <AddressText {...args} useTextWidthForPlaceholderWidth={useTextWidthForPlaceholderWidth} />
        <button
          type="button"
          onClick={() => setUseTextWidthForPlaceholderWidth(value => !value)}
          style={{ marginTop: 16 }}
        >
          toggle useTextWidthForPlaceholderWidth
        </button>
      </div>
    )
  },
}
