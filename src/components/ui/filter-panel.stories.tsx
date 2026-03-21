import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FilterPanel } from './filter-panel'

const meta = {
  title: 'UI/FilterPanel',
  component: FilterPanel,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FilterPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default (click to open)',
  args: {},
}

export const InToolbar: Story = {
  name: 'In Toolbar Context',
  args: {},
  render: () => (
    <div
      className="flex items-center gap-3 rounded-2xl border border-[#E5E4E1] bg-white px-4 py-3 shadow-sm"
      style={{ width: 480 }}
    >
      <p className="flex-1 text-[14px] font-semibold text-[#1A1918]">Iglesias</p>
      <span className="text-[13px] text-[#9C9B99]">48 resultados</span>
      <FilterPanel />
    </div>
  ),
}
