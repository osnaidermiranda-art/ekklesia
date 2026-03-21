import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Plus, Settings } from 'lucide-react'

import { Button } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Guardar cambios',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancelar',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Ver detalles',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Más opciones',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Eliminar',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Ver más',
  },
}

export const WithIcon: Story = {
  args: {},
  render: () => (
    <Button>
      <Plus className="size-4" />
      Agregar miembro
    </Button>
  ),
}

export const IconOnly: Story = {
  args: {},
  render: () => (
    <Button size="icon" aria-label="Configuración">
      <Settings className="size-4" />
    </Button>
  ),
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Predeterminado</Button>
      <Button variant="outline">Contorno</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="ghost">Fantasma</Button>
      <Button variant="destructive">Destructivo</Button>
      <Button variant="link">Enlace</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Guardar</Button>
      <Button size="sm">Guardar</Button>
      <Button size="default">Guardar</Button>
      <Button size="lg">Guardar</Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    children: 'No disponible',
    disabled: true,
  },
}
