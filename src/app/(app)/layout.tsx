import { SidebarNav } from '@/components/ui/sidebar-nav'

const CURRENT_USER = { name: 'Juan Perez', role: 'Admin Concilio', initials: 'JP' }

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F4F1]">
      <SidebarNav user={CURRENT_USER} />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  )
}
