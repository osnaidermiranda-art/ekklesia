import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Bell, Cake, Layers, MessageSquare, Workflow } from 'lucide-react'

import { NavDropdown } from './nav-dropdown'

const meta = {
  title: 'UI/NavDropdown',
  component: NavDropdown,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NavDropdown>

export default meta

type Story = StoryObj<typeof meta>

const PAGES_ITEMS = [
  { icon: Bell, label: 'Notificaciones', href: '/notifications' },
  { icon: MessageSquare, label: 'Mensajería', href: '/messaging' },
  { icon: Cake, label: 'Cumpleaños', href: '/birthdays' },
  { icon: Workflow, label: 'Onboarding', href: '/onboarding' },
]

export const Default: Story = {
  args: {
    icon: Layers,
    label: 'Pages',
    items: PAGES_ITEMS,
    onNavigate: () => {},
  },
  render: (args) => (
    <div className="w-64 rounded-2xl bg-white p-4">
      <NavDropdown {...args} />
    </div>
  ),
}

export const WithActiveItem: Story = {
  args: {
    icon: Layers,
    label: 'Pages',
    items: PAGES_ITEMS,
    activeHref: '/notifications',
    onNavigate: () => {},
  },
  render: (args) => (
    <div className="w-64 rounded-2xl bg-white p-4">
      <NavDropdown {...args} />
    </div>
  ),
}

export const InSidebarContext: Story = {
  args: {
    icon: Layers,
    label: 'Pages',
    items: PAGES_ITEMS,
    activeHref: '/messaging',
    onNavigate: () => {},
  },
  render: () => (
    <div className="w-64 rounded-2xl bg-white p-4">
      <p className="pb-1 text-[11px] font-semibold uppercase tracking-[1px] text-[#9C9B99]">
        PAGES
      </p>
      <NavDropdown
        icon={Layers}
        label="Pages"
        items={PAGES_ITEMS}
        activeHref="/messaging"
        onNavigate={() => {}}
      />
    </div>
  ),
}
