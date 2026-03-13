'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Calendar, ChartBar, Eye, EyeOff, Users } from 'lucide-react'

const BRAND_FEATURES = [
  {
    icon: Users,
    title: 'Gestion de Miembros',
    description: 'Control completo de feligreses, transferencias y roles',
  },
  {
    icon: Calendar,
    title: 'Calendario Unificado',
    description: 'Eventos con prioridad jerarquica y resolucion de conflictos',
  },
  {
    icon: ChartBar,
    title: 'Reportes y Finanzas',
    description: 'Diezmos, ofrendas y reportes exportables en PDF y Excel',
  },
] as const

const MOCK_TENANTS = [
  { value: 'concilio-1', label: 'Concilio Nacional' },
  { value: 'concilio-2', label: 'Concilio Regional Norte' },
  { value: 'concilio-3', label: 'Concilio Regional Sur' },
] as const

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Brand Panel */}
      <div
        className={cn(
          'flex flex-col justify-between bg-[#3D8A5A]',
          'px-6 py-6 md:w-1/2 md:px-[60px] md:py-[60px]',
        )}
      >
        {/* Logo + Tagline */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <svg
                className="size-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white md:text-[32px]">Ekklesia</span>
          </div>
          <p className="text-base leading-relaxed text-white/80 md:text-lg">
            Gestion eclesiastica inteligente para tu concilio
          </p>
        </div>

        {/* Features - hidden on mobile */}
        <div className="hidden flex-col gap-6 md:flex">
          {BRAND_FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[.13]">
                <feature.icon className="size-5 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="text-xs text-white/[.67]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer - hidden on mobile */}
        <p className="hidden text-[11px] text-white/[.53] md:block">
          &copy; 2025 Ekklesia. Todos los derechos reservados.
        </p>
      </div>

      {/* Login Panel */}
      <div
        className={cn(
          'flex flex-1 items-center justify-center bg-white',
          'px-6 py-10 md:w-1/2 md:px-20 md:py-[60px]',
        )}
      >
        <div className="w-full max-w-[380px]">
          {/* Form Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-bold leading-tight text-[#1A1918]">Iniciar Sesion</h1>
            <p className="text-sm text-[#6D6C6A]">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <form
            className="mt-8 flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            {/* Fields Group */}
            <div className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col gap-[6px]">
                <Label htmlFor="email" className="text-[13px] font-medium text-[#1A1918]">
                  Correo electronico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  className="h-11 rounded-xl border-[#E5E4E1] bg-[#F5F4F1] px-[14px] text-sm"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[13px] font-medium text-[#1A1918]">
                    Contrasena
                  </Label>
                  <button
                    type="button"
                    className="text-xs font-medium text-[#3D8A5A] hover:underline"
                  >
                    Olvidaste tu contrasena?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-[#E5E4E1] bg-[#F5F4F1] px-[14px] pr-10 text-sm"
                  />
                  <button
                    type="button"
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#9C9B99] hover:text-[#1A1918]"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    {showPassword ? (
                      <Eye className="size-[18px]" />
                    ) : (
                      <EyeOff className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-[13px] font-normal text-[#6D6C6A]">
                  Recordar mis datos
                </Label>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#3D8A5A] text-[15px] font-semibold text-white hover:bg-[#347A4E]"
            >
              Iniciar Sesion
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-[#9C9B99]">o</span>
              <Separator className="flex-1" />
            </div>

            {/* Tenant Selector */}
            <div className="flex flex-col gap-[6px]">
              <Label htmlFor="tenant" className="text-[13px] font-medium text-[#1A1918]">
                Concilio / Organizacion
              </Label>
              <Select>
                <SelectTrigger className="h-11 w-full rounded-xl border-[#E5E4E1] bg-[#F5F4F1] px-[14px]">
                  <SelectValue placeholder="Selecciona tu concilio" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TENANTS.map((tenant) => (
                    <SelectItem key={tenant.value} value={tenant.value}>
                      {tenant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Help Text */}
            <div className="flex items-center justify-center gap-1">
              <span className="text-[13px] text-[#9C9B99]">No tienes cuenta?</span>
              <button
                type="button"
                className="text-[13px] font-medium text-[#3D8A5A] hover:underline"
              >
                Contacta al administrador
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
