import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

import { SearchInput } from './search-input'

const meta = {
  title: 'UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['muted', 'white'],
    },
  },
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Muted (default)',
  args: {
    placeholder: 'Buscar...',
    variant: 'muted',
  },
}

export const White: Story = {
  name: 'White variant',
  args: {
    placeholder: 'Buscar...',
    variant: 'white',
  },
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-[#F5F4F1] p-4">
        <Story />
      </div>
    ),
  ],
}

export const Controlled: Story = {
  name: 'Controlled (with value)',
  render: (args) => {
    const [value, setValue] = useState('Buscar miembro')
    return <SearchInput {...args} value={value} onChange={setValue} />
  },
  args: {
    placeholder: 'Buscar...',
    variant: 'muted',
  },
}
