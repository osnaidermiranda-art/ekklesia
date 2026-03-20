'use client'

import { ErrorPageTemplate } from './ErrorPageTemplate'

export function NotFoundPage() {
  return (
    <ErrorPageTemplate
      code="404"
      codeColor="#C8F0D8"
      title="Pagina no encontrada"
      description="Lo sentimos, la pagina que buscas no existe o fue movida. Verifica la URL o regresa al inicio."
      extraSlot={
        <p className="text-[13px] text-[#9C9B99]">
          Necesitas ayuda?{' '}
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
