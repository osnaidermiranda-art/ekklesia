import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Calendar, Home, MessageCircle, Settings, Users } from 'lucide-react'

import { NavItem } from './nav-item'

const meta = {
  title: 'UI/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NavItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: Home,
    label: 'Inicio',
    active: false,
  },
}

export const Active: Story = {
  args: {
    icon: Home,
    label: 'Inicio',
    active: true,
  },
}

export const NavigationGroup: Story = {
  args: {
    icon: Home,
    label: 'Inicio',
  },
  render: () => (
    <div className="w-64 rounded-2xl bg-white p-4">
      <nav className="flex flex-col gap-1">
        <NavItem icon={Home} label="Inicio" active />
        <NavItem icon={Users} label="Miembros" />
        <NavItem icon={Calendar} label="Eventos" />
        <NavItem icon={MessageCircle} label="Mensajes" />
        <NavItem icon={Settings} label="Configuración" />
      </nav>
    </div>
  ),
}
