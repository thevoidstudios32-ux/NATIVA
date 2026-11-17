import { MapContainer, TileLayer } from 'react-leaflet'

/**
 * Prévia visual do mapa (OpenStreetMap). Não exibe marcadores fictícios:
 * os pontos públicos reais serão carregados do Supabase quando houver registros.
 */
export function PreviewMap() {
  return (
    <MapContainer
      center={[-14.5, -52]}
      zoom={4}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      keyboard={false}
      attributionControl
      className="map-muted size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}
