import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Plus } from 'lucide-react'

import { PageHeader } from './page-header'

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'With primary action',
  args: {
    title: 'Miembros',
    subtitle: 'Gestion de membresia del concilio',
    searchPlaceholder: 'Buscar miembro...',
    action: {
      label: 'Nuevo Miembro',
      icon: Plus,
      variant: 'primary',
    },
  },
}

export const GhostAction: Story = {
  name: 'With ghost action',
  args: {
    title: 'Miembros',
    subtitle: 'Gestion de membresia del concilio',
    searchPlaceholder: 'Buscar miembro...',
    action: {
      label: 'Exportar',
      variant: 'ghost',
    },
  },
}

export const SearchOnly: Story = {
  name: 'Search only (no action)',
  args: {
    title: 'Servicios',
    subtitle: 'Agenda de servicios del concilio',
    searchPlaceholder: 'Buscar servicio...',
  },
}
