import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BarChart, Calendar, Users, Wallet } from 'lucide-react'

import { StatCard } from './stat-card'

const meta = {
  title: 'UI/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof StatCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total Miembros',
    value: '2,847',
    trend: '+12.5%',
    period: 'vs mes anterior',
    icon: Users,
  },
}

export const NegativeTrend: Story = {
  args: {
    label: 'Asistencia',
    value: '1,204',
    trend: '-3.2%',
    period: 'vs mes anterior',
    icon: Calendar,
  },
}

export const Grid: Story = {
  args: {
    label: 'Total Miembros',
    value: '2,847',
    trend: '+12.5%',
    icon: Users,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        label="Total Miembros"
        value="2,847"
        trend="+12.5%"
        period="vs mes anterior"
        icon={Users}
      />
      <StatCard
        label="Eventos este mes"
        value="34"
        trend="+4"
        period="vs mes anterior"
        icon={Calendar}
        iconBgColor="#D4E8FF"
        iconColor="#2B6CB0"
      />
      <StatCard
        label="Ofrendas"
        value="$18,420"
        trend="+8.1%"
        period="vs mes anterior"
        icon={Wallet}
        iconBgColor="#FFF0D4"
        iconColor="#B07D2B"
      />
      <StatCard
        label="Crecimiento"
        value="6.3%"
        trend="-0.5%"
        period="vs mes anterior"
        icon={BarChart}
        iconBgColor="#F0D4FF"
        iconColor="#7B2CB0"
      />
    </div>
  ),
}
