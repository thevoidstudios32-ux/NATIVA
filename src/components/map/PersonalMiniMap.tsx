import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { latLngBounds } from 'leaflet'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/auth/AuthProvider'

interface Point { observation_id: string; latitude: number; longitude: number }

/** Prévia do mapa pessoal com as coordenadas reais (protegidas) do próprio usuário. */
export default function PersonalMiniMap() {
  const { user } = useAuth()
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('observation_locations')
      .select('observation_id,latitude,longitude')
      .eq('user_id', user.id)
      .limit(500)
      .then(({ data }) => setPoints((data ?? []) as Point[]))
  }, [user])

  return (
    <div className="relative size-full">
      <MapContainer center={[-14.5, -52]} zoom={3} scrollWheelZoom={false} className="map-muted size-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <CircleMarker
            key={p.observation_id}
            center={[p.latitude, p.longitude]}
            radius={6}
            pathOptions={{ color: '#FAF8F3', weight: 2, fillColor: '#263D32', fillOpacity: 1 }}
          />
        ))}
        <FitBounds points={points} />
      </MapContainer>
      {points.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] rounded-md border border-line bg-paper/95 px-4 py-3 text-sm text-ink-soft">
          Nenhuma observação com localização ainda. Ao registrar, você pode marcar o local — sempre opcional.
        </div>
      )}
    </div>
  )
}

function FitBounds({ points }: { points: Point[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    map.fitBounds(latLngBounds(points.map((p) => [p.latitude, p.longitude])), { padding: [30, 30], maxZoom: 12 })
  }, [points, map])
  return null
}
