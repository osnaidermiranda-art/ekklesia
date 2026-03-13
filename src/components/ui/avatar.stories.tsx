import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Avatar } from './avatar'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['green', 'coral', 'blue', 'purple'],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// --- Size stories ---

export const SizeSm: Story = {
  name: 'Size / Small (32px)',
  args: {
    initials: 'JP',
    size: 'sm',
    color: 'green',
  },
}

export const SizeMd: Story = {
  name: 'Size / Medium (36px)',
  args: {
    initials: 'JP',
    size: 'md',
    color: 'green',
  },
}

export const SizeLg: Story = {
  name: 'Size / Large (56px)',
  args: {
    initials: 'JP',
    size: 'lg',
    color: 'green',
  },
}

export const SizeXl: Story = {
  name: 'Size / X-Large (80px)',
  args: {
    initials: 'JP',
    size: 'xl',
    color: 'green',
  },
}

// --- Color stories ---

export const ColorGreen: Story = {
  name: 'Color / Green',
  args: {
    initials: 'ML',
    size: 'lg',
    color: 'green',
  },
}

export const ColorCoral: Story = {
  name: 'Color / Coral',
  args: {
    initials: 'ML',
    size: 'lg',
    color: 'coral',
  },
}

export const ColorBlue: Story = {
  name: 'Color / Blue',
  args: {
    initials: 'ML',
    size: 'lg',
    color: 'blue',
  },
}

export const ColorPurple: Story = {
  name: 'Color / Purple',
  args: {
    initials: 'ML',
    size: 'lg',
    color: 'purple',
  },
}

// --- All combinations grid ---

const SIZES = ['sm', 'md', 'lg', 'xl'] as const
const COLORS = ['green', 'coral', 'blue', 'purple'] as const
const SAMPLE_INITIALS = ['JP', 'ML', 'CR', 'AB']

export const AllCombinations: Story = {
  name: 'All Combinations',
  args: {
    initials: 'JP',
    size: 'sm',
    color: 'green',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-row items-center gap-4">
          <span className="w-10 text-[11px] font-semibold text-[#6D6C6A] uppercase">{size}</span>
          {COLORS.map((color, i) => (
            <Avatar
              key={`${size}-${color}`}
              initials={SAMPLE_INITIALS[i]}
              size={size}
              color={color}
            />
          ))}
        </div>
      ))}
    </div>
  ),
}
