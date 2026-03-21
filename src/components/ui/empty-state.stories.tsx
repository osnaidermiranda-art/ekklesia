import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Building,
  Calendar,
  FileText,
  MapPin,
  MessageSquare,
  Plus,
  Upload,
  Users,
} from 'lucide-react'

import { EmptyState } from './empty-state'

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

// --- Context stories ---

export const Members: Story = {
  name: 'Context / Members',
  args: {
    icon: Users,
    title: 'No hay miembros registrados',
    description:
      'Comienza agregando miembros a tu iglesia. Puedes registrarlos manualmente o importar una lista desde un archivo CSV.',
    actions: [
      { label: 'Agregar Miembro', icon: Plus, onClick: () => {}, variant: 'primary' },
      { label: 'Importar CSV', icon: Upload, onClick: () => {}, variant: 'secondary' },
    ],
  },
}

export const Churches: Story = {
  name: 'Context / Churches',
  args: {
    icon: Building,
    title: 'No hay iglesias registradas',
    description:
      'Agrega las iglesias que forman parte de este concilio para comenzar a administrarlas.',
    actions: [{ label: 'Agregar Iglesia', icon: Plus, onClick: () => {}, variant: 'primary' }],
  },
}

export const CalendarStory: Story = {
  name: 'Context / Calendar',
  args: {
    icon: Calendar,
    title: 'No hay eventos programados',
    description: 'Crea el primer evento del calendario para coordinar actividades del concilio.',
    actions: [{ label: 'Crear Evento', icon: Plus, onClick: () => {}, variant: 'primary' }],
  },
}

export const Reports: Story = {
  name: 'Context / Reports',
  args: {
    icon: FileText,
    title: 'No hay reportes disponibles',
    description: 'Genera tu primer reporte para visualizar estadísticas y métricas del concilio.',
    actions: [{ label: 'Generar Reporte', icon: Plus, onClick: () => {}, variant: 'primary' }],
  },
}

export const Messages: Story = {
  name: 'Context / Messages',
  args: {
    icon: MessageSquare,
    title: 'No hay mensajes',
    description: 'Inicia una conversación con miembros o grupos del concilio.',
    actions: [{ label: 'Nuevo Mensaje', icon: Plus, onClick: () => {}, variant: 'primary' }],
  },
}

export const Evangelism: Story = {
  name: 'Context / Evangelism',
  args: {
    icon: MapPin,
    title: 'No hay registros de evangelismo',
    description:
      'Registra las visitas y actividades de evangelismo para hacer seguimiento del alcance.',
    actions: [{ label: 'Registrar Visita', icon: Plus, onClick: () => {}, variant: 'primary' }],
  },
}

// --- Size stories ---

export const SizeSm: Story = {
  name: 'Size / Small',
  args: {
    icon: Users,
    title: 'No hay miembros',
    description: 'Agrega miembros para comenzar.',
    size: 'sm',
    actions: [{ label: 'Agregar', onClick: () => {}, variant: 'primary' }],
  },
}

export const SizeMd: Story = {
  name: 'Size / Medium (default)',
  args: {
    icon: Users,
    title: 'No hay miembros',
    description: 'Agrega miembros para comenzar.',
    size: 'md',
    actions: [{ label: 'Agregar', onClick: () => {}, variant: 'primary' }],
  },
}

export const SizeLg: Story = {
  name: 'Size / Large',
  args: {
    icon: Users,
    title: 'No hay miembros',
    description: 'Agrega miembros para comenzar.',
    size: 'lg',
    actions: [{ label: 'Agregar', onClick: () => {}, variant: 'primary' }],
  },
}

// --- Variant stories ---

export const NoActions: Story = {
  name: 'Variant / No Actions',
  args: {
    icon: FileText,
    title: 'Sin resultados',
    description: 'No se encontraron elementos que coincidan con tu búsqueda.',
  },
}

export const SingleAction: Story = {
  name: 'Variant / Single Action',
  args: {
    icon: Users,
    title: 'No hay miembros',
    description: 'Comienza agregando el primer miembro.',
    actions: [{ label: 'Agregar Miembro', icon: Plus, onClick: () => {}, variant: 'primary' }],
  },
}

export const TwoActions: Story = {
  name: 'Variant / Two Actions',
  args: {
    icon: Users,
    title: 'No hay miembros registrados',
    description:
      'Comienza agregando miembros a tu iglesia. Puedes registrarlos manualmente o importar una lista desde un archivo CSV.',
    actions: [
      { label: 'Agregar Miembro', icon: Plus, onClick: () => {}, variant: 'primary' },
      { label: 'Importar CSV', icon: Upload, onClick: () => {}, variant: 'secondary' },
    ],
  },
}

// --- All contexts grid ---

export const AllContexts: Story = {
  args: {
    icon: Users,
    title: 'Placeholder',
  },
  render: () => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div className="rounded-2xl border border-[#E5E4E1] bg-white">
        <EmptyState
          icon={Users}
          title="No hay miembros registrados"
          description="Comienza agregando miembros a tu iglesia."
          actions={[
            { label: 'Agregar Miembro', icon: Plus, onClick: () => {}, variant: 'primary' },
            { label: 'Importar CSV', icon: Upload, onClick: () => {}, variant: 'secondary' },
          ]}
          size="sm"
        />
      </div>
      <div className="rounded-2xl border border-[#E5E4E1] bg-white">
        <EmptyState
          icon={Building}
          title="No hay iglesias registradas"
          description="Agrega las iglesias que forman parte de este concilio."
          actions={[
            { label: 'Agregar Iglesia', icon: Plus, onClick: () => {}, variant: 'primary' },
          ]}
          size="sm"
        />
      </div>
      <div className="rounded-2xl border border-[#E5E4E1] bg-white">
        <EmptyState
          icon={Calendar}
          title="No hay eventos programados"
          description="Crea el primer evento del calendario."
          actions={[{ label: 'Crear Evento', icon: Plus, onClick: () => {}, variant: 'primary' }]}
          size="sm"
        />
      </div>
      <div className="rounded-2xl border border-[#E5E4E1] bg-white">
        <EmptyState
          icon={FileText}
          title="No hay reportes disponibles"
          description="Genera tu primer reporte para visualizar estadísticas."
          actions={[
            { label: 'Generar Reporte', icon: Plus, onClick: () => {}, variant: 'primary' },
          ]}
          size="sm"
        />
      </div>
      <div className="rounded-2xl border border-[#E5E4E1] bg-white">
        <EmptyState
          icon={MessageSquare}
          title="No hay mensajes"
          description="Inicia una conversación con miembros o grupos del concilio."
          actions={[{ label: 'Nuevo Mensaje', icon: Plus, onClick: () => {}, variant: 'primary' }]}
          size="sm"
        />
      </div>
      <div className="rounded-2xl border border-[#E5E4E1] bg-white">
        <EmptyState
          icon={MapPin}
          title="No hay registros de evangelismo"
          description="Registra las visitas y actividades de evangelismo."
          actions={[
            { label: 'Registrar Visita', icon: Plus, onClick: () => {}, variant: 'primary' },
          ]}
          size="sm"
        />
      </div>
    </div>
  ),
}
