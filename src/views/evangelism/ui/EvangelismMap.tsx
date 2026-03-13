'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PointStatus = 'active' | 'pending' | 'inactive' | 'closed'

interface PreachingPoint {
  id: string
  name: string
  address: string
  status: PointStatus
  workers: number
  conversions: number
  frequency: string
  zone: string
  lat: number
  lng: number
}

interface EvangelismMapProps {
  points: PreachingPoint[]
  selectedId: string | null
  hoveredId: string | null
  onSelectPoint: (id: string) => void
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STATUS_DOT: Record<PointStatus, string> = {
  active: '#3D8A5A',
  pending: '#D4A64A',
  inactive: '#9C9B99',
  closed: '#D08068',
}

// ---------------------------------------------------------------------------
// Inject pulse keyframes once
// ---------------------------------------------------------------------------

function useMarkerStyles() {
  useEffect(() => {
    if (document.getElementById('ekklesia-marker-styles')) return
    const style = document.createElement('style')
    style.id = 'ekklesia-marker-styles'
    style.textContent = `
      @keyframes markerPulse {
        0%   { transform: scale(1);   opacity: 0.6; }
        70%  { transform: scale(2.2); opacity: 0;   }
        100% { transform: scale(2.2); opacity: 0;   }
      }
      .marker-pulse {
        animation: markerPulse 1.4s ease-out infinite;
        transform-origin: 20px 20px;
      }
    `
    document.head.appendChild(style)
  }, [])
}

// ---------------------------------------------------------------------------
// Custom marker icon — round with church symbol
// ---------------------------------------------------------------------------

function createMarkerIcon(color: string, pulsing: boolean) {
  const pulseRing = pulsing
    ? `<circle class="marker-pulse" cx="20" cy="20" r="14" fill="${color}" />`
    : ''

  const church = `
    <line x1="20" y1="8"  x2="20" y2="15" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="16.5" y1="11" x2="23.5" y2="11" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
    <polyline points="13.5,19 20,14.5 26.5,19" fill="none" stroke="white" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="15" y="19" width="10" height="9" fill="white" opacity="0.2" rx="0.5"/>
    <rect x="15" y="19" width="10" height="9" fill="none" stroke="white" stroke-width="1.4" rx="0.5"/>
    <rect x="18.2" y="23" width="3.6" height="5" rx="1.8" fill="white" opacity="0.95"/>
  `

  return L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      ${pulseRing}
      <circle cx="20" cy="21" r="14" fill="rgba(26,25,24,0.14)"/>
      <circle cx="20" cy="20" r="14" fill="${color}"/>
      ${church}
    </svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    tooltipAnchor: [18, 0],
  })
}

// ---------------------------------------------------------------------------
// Helper: fly to selected point
// ---------------------------------------------------------------------------

function FlyToSelected({
  points,
  selectedId,
}: {
  points: PreachingPoint[]
  selectedId: string | null
}) {
  const map = useMap()

  useEffect(() => {
    const point = points.find((p) => p.id === selectedId)
    if (point) {
      map.flyTo([point.lat, point.lng], 15, { duration: 0.8 })
    }
  }, [selectedId, points, map])

  return null
}

// ---------------------------------------------------------------------------
// Map component
// ---------------------------------------------------------------------------

export function EvangelismMap({
  points,
  selectedId,
  hoveredId,
  onSelectPoint,
}: EvangelismMapProps) {
  useMarkerStyles()

  const center: [number, number] = [14.0723, -87.1921]

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full rounded-xl"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToSelected points={points} selectedId={selectedId} />

      {points.map((point) => {
        const pulsing = point.id === selectedId || point.id === hoveredId
        return (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createMarkerIcon(STATUS_DOT[point.status], pulsing)}
            eventHandlers={{ click: () => onSelectPoint(point.id) }}
          >
            <Tooltip
              direction="right"
              offset={[12, 0]}
              opacity={1}
              className="!rounded-xl !border !border-[#E5E4E1] !bg-white !px-3 !py-2 !shadow-[0_2px_12px_rgba(26,25,24,0.10)] !text-[12px] !font-medium !text-[#1A1918]"
            >
              {point.name}
            </Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
