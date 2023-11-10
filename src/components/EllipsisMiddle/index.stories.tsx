import type { Meta, StoryObj } from '@storybook/react'

import EllipsisMiddle from '.'
import { useForkedState } from '../../utils/hook'

const meta = {
  component: EllipsisMiddle,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  argTypes: {
    children: {
      // In React 17, `FC<P>` is wrapped in `PropsWithChildren<P>`, causing the type of `children` to be unrecognizable by Storybook.
      description: 'This item will be used as text when text is empty.',
      type: 'string',
    },
  },
} satisfies Meta<typeof EllipsisMiddle>

export default meta
type Story = StoryObj<typeof meta>

function getSentence(count: number) {
  return new Array(count)
    .fill(null)
    .map((_, idx) => `This is a sentence ${idx}.`)
    .join(' ')
}

export const ShortSentence: Story = {
  args: {
    children: getSentence(1),
  },
}

export const LongSentence: Story = {
  args: {
    children: getSentence(10),
  },
}

export const MinStartLen: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    minStartLen: 40,
    children: getSentence(10),
  },
}

export const UseTextWidthForPlaceholderWidth: Story = {
  args: {
    children: getSentence(1),
    useTextWidthForPlaceholderWidth: true,
    style: { border: '1px solid #000', boxSizing: 'content-box' },
  },
  render: function Render(args) {
    const [useTextWidthForPlaceholderWidth, setUseTextWidthForPlaceholderWidth] = useForkedState(
      args.useTextWidthForPlaceholderWidth,
    )

    return (
      <div>
        <EllipsisMiddle {...args} useTextWidthForPlaceholderWidth={useTextWidthForPlaceholderWidth} />
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
