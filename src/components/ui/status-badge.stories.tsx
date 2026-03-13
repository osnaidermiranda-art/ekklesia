import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { StatusBadge } from './status-badge'

const meta = {
  title: 'UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['active', 'pending', 'transferred', 'inactive', 'completed', 'cancelled'],
    },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: {
    variant: 'active',
    label: 'Activo',
  },
}

export const Pending: Story = {
  args: {
    variant: 'pending',
    label: 'Pendiente',
  },
}

export const Transferred: Story = {
  args: {
    variant: 'transferred',
    label: 'Transferido',
  },
}

export const Inactive: Story = {
  args: {
    variant: 'inactive',
    label: 'Inactivo',
  },
}

export const Completed: Story = {
  args: {
    variant: 'completed',
    label: 'Completado',
  },
}

export const Cancelled: Story = {
  args: {
    variant: 'cancelled',
    label: 'Cancelado',
  },
}

export const All: Story = {
  args: {
    variant: 'active',
    label: 'Activo',
  },
  render: () => (
    <div className="flex flex-row flex-wrap items-center gap-2">
      <StatusBadge variant="active" label="Activo" />
      <StatusBadge variant="pending" label="Pendiente" />
      <StatusBadge variant="transferred" label="Transferido" />
      <StatusBadge variant="inactive" label="Inactivo" />
      <StatusBadge variant="completed" label="Completado" />
      <StatusBadge variant="cancelled" label="Cancelado" />
    </div>
  ),
}
