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
  { value: 'all', label: 'Todos' },
  { value: 'templates', label: 'Plantillas' },
  { value: 'scheduled', label: 'Programados' },
  { value: 'replacements', label: 'Reemplazos', count: 3 },
]

export const Default: Story = {
  name: 'Default',
  render: (args) => {
    const [value, setValue] = useState('all')
    return <PillTabs {...args} tabs={DEFAULT_TABS} value={value} onChange={setValue} />
  },
  args: {
    tabs: DEFAULT_TABS,
    value: 'all',
    onChange: () => {},
  },
}
