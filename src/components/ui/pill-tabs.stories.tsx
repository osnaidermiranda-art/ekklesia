import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

import { PillTabs } from './pill-tabs'
import type { PillTab } from './pill-tabs'

const meta = {
  title: 'UI/PillTabs',
  component: PillTabs,
  tags: ['autodocs'],
} satisfies Meta<typeof PillTabs>

export default meta
type Story = StoryObj<typeof meta>

const DEFAULT_TABS: PillTab[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'plantillas', label: 'Plantillas' },
  { value: 'programados', label: 'Programados' },
  { value: 'reemplazos', label: 'Reemplazos', count: 3 },
]

export const Default: Story = {
  name: 'Default',
  render: (args) => {
    const [value, setValue] = useState('todos')
    return <PillTabs {...args} tabs={DEFAULT_TABS} value={value} onChange={setValue} />
  },
  args: {
    tabs: DEFAULT_TABS,
    value: 'todos',
    onChange: () => {},
  },
}
