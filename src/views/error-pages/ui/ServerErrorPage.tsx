'use client'

import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { ErrorPageTemplate } from './ErrorPageTemplate'

export function ServerErrorPage() {
  const router = useRouter()

  return (
    <ErrorPageTemplate
      code="500"
      codeColor="#FDDCDC"
      title="Error del Servidor"
      description="Ha ocurrido un error inesperado en el servidor. Nuestro equipo ha sido notificado y esta trabajando para resolverlo."
      primaryLabel="Intentar de Nuevo"
      primaryIcon={RefreshCw}
      onPrimary={() => router.refresh()}
      secondaryLabel="Ir al Inicio"
      onSecondary={() => router.push('/dashboard')}
      extraSlot={
        <p className="text-[13px] text-[#9C9B99]">
          Si el problema persiste,{' '}
          <button
            type="button"
            className="font-semibold text-[#3D8A5A] transition-opacity hover:opacity-70"
          >
            Contactar Soporte
          </button>
        </p>
      }
    />
  )
}
