import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AppSidebar, DEFAULT_NAV_SECTIONS } from './app-sidebar'

const meta = {
  title: 'UI/AppSidebar',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppSidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sections: DEFAULT_NAV_SECTIONS,
    activeHref: '/miembros',
    user: {
      name: 'Juan Perez',
      role: 'Admin Concilio',
      initials: 'JP',
    },
  },
}
