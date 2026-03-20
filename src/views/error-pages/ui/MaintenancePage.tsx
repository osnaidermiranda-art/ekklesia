'use client'

import { Wrench } from 'lucide-react'

import { ErrorPageTemplate } from './ErrorPageTemplate'

export function MaintenancePage() {
  return (
    <ErrorPageTemplate
      title="En Mantenimiento"
      description="Estamos realizando mejoras para brindarte una mejor experiencia. El sistema estara disponible nuevamente en breve."
      showBackButton={false}
      primaryLabel="Recargar Pagina"
      primaryIcon={Wrench}
      topSlot={
        <div className="flex size-20 items-center justify-center rounded-2xl bg-[#FDE8D8]">
          <Wrench size={36} className="text-[#D89575]" />
        </div>
      }
      extraSlot={
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-[#F5F4F1] px-4 py-2">
            <span className="text-[13px] text-[#6D6C6A]">Tiempo estimado:</span>
            <span className="text-[13px] font-semibold text-[#1A1918]">2 horas</span>
          </div>
          <p className="text-[13px] text-[#9C9B99]">
            Necesitas ayuda urgente?{' '}
            <button
              type="button"
              className="font-semibold text-[#3D8A5A] transition-opacity hover:opacity-70"
            >
              Contactar Soporte
            </button>
          </p>
        </div>
      }
    />
  )
}
