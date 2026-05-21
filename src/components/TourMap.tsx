import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef } from 'react'
import type { TourLocation } from '../types'

export default function TourMap({ locations }: { locations: TourLocation[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || locations.length === 0) return

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      scrollZoom: false,
    })

    const bounds = new mapboxgl.LngLatBounds()

    locations.forEach((loc) => {
      const el = document.createElement('div')
      el.className = 'marker'

      new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(loc.coordinates)
        .addTo(map)

      new mapboxgl.Popup({ offset: 30 })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)

      bounds.extend(loc.coordinates)
    })

    map.fitBounds(bounds, {
      padding: { top: 200, bottom: 150, left: 100, right: 100 },
    })

    return () => map.remove()
  }, [locations])

  return <div id="map" ref={containerRef} />
}
