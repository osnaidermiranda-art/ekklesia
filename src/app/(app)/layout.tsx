import { AppShell } from '@/components/ui/app-shell'

const CURRENT_USER = { name: 'Juan Perez', role: 'Admin Concilio', initials: 'JP' }

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell user={CURRENT_USER}>{children}</AppShell>
}
