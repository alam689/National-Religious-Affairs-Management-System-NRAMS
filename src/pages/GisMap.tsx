import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Layers, Landmark, Building2, Crosshair, ChevronDown, ChevronLeft } from 'lucide-react'
import { useLang, fmtNum } from '../i18n'
import { PageHeader, Card, CardHeader, Badge, KV } from '../components/ui'
import { institutions, divisions, waqfProperties, nationalInstitutionStats, type InstType, type Institution } from '../data/mock'
import geoUrl from '../data/bd-geo.json?url'

// Real administrative boundaries (BBS / OCHA via geoBoundaries), simplified for the web
type Geom = GeoJSON.Polygon | GeoJSON.MultiPolygon
type BdGeo = { country: Geom; divisions: { id: string; geometry: Geom }[]; districts: { en: string; div: string; geometry: Geom }[] }

const BD_BOUNDS: [[number, number], [number, number]] = [[20.6, 88.0], [26.63, 92.68]]
// Frame an area clear of the layers panel (top-left) when the map is wide enough to afford it
const fitOpts = (map: Leaflet.Map): Leaflet.FitBoundsOptions => ({ paddingTopLeft: [map.getSize().x >= 700 ? 232 : 12, 12], paddingBottomRight: [12, 12] })
const OSM_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

const typeMeta: Record<InstType, { emoji: string; color: string }> = {
  mosque: { emoji: '🕌', color: '#2f62d9' }, madrasa: { emoji: '📚', color: '#0ea5e9' }, temple: { emoji: '🛕', color: '#f59e0b' },
  church: { emoji: '⛪', color: '#8b5cf6' }, buddhist: { emoji: '☸️', color: '#10b981' }, other: { emoji: '🏛️', color: '#94a3b8' },
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
const anchored = (html: string) => Leaflet.divIcon({ className: 'gis-anchor', html, iconSize: [0, 0] })
const outerRings = (g: Geom) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).map((p) => p[0].map(([lon, lat]) => [lat, lon] as [number, number]))

// Static lookups
const allDistricts = divisions.flatMap((d) => d.districts.map((ds) => ({ d, ds })))
const instByDistrict = new Map<string, number>()
institutions.forEach((i) => instByDistrict.set(i.district.en, (instByDistrict.get(i.district.en) ?? 0) + 1))
const nationalTotal = Object.values(nationalInstitutionStats).reduce((a, b) => a + b, 0)
const totalWeight = allDistricts.reduce((a, { ds }) => a + ds.r * ds.r, 0)
const districtEstimate = (r: number) => Math.round((nationalTotal * r * r) / totalWeight)

export default function GisMap() {
  const { t, L, lang } = useLang()
  const nav = useNavigate()
  const [layers, setLayers] = useState<Record<string, boolean>>({ mosque: true, madrasa: true, temple: true, church: true, buddhist: true, other: true, waqf: false })
  const [basemap, setBasemap] = useState<'osm' | 'none'>('osm')
  const [panelOpen, setPanelOpen] = useState(() => window.innerWidth >= 640)
  const [divSel, setDivSel] = useState<string | null>(null)
  const [distSel, setDistSel] = useState<string | null>(null)
  const [pin, setPin] = useState<Institution | null>(null)
  const [geo, setGeo] = useState<BdGeo | null>(null)
  const [geoError, setGeoError] = useState(false)

  const elRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const firstView = useRef(true)
  const viewRef = useRef<Leaflet.LatLngBounds>(Leaflet.latLngBounds(BD_BOUNDS))

  const selDiv = divisions.find((d) => d.id === divSel) ?? null
  const selDist = selDiv?.districts.find((ds) => ds.en === distSel) ?? null
  const inScope = (divisionId: string, districtEn: string) => (!divSel || divisionId === divSel) && (!distSel || districtEn === distSel)
  const selectArea = (div: string | null, dist: string | null = null) => { setDivSel(div); setDistSel(dist) }

  const scoped = useMemo(() => institutions.filter((i) => inScope(i.divisionId, i.district.en)), [divSel, distSel])
  const visible = useMemo(() => scoped.filter((i) => layers[i.type]), [scoped, layers])
  const visibleWaqf = useMemo(() => (layers.waqf ? waqfProperties.filter((w) => inScope(w.divisionId, w.district.en)) : []), [layers.waqf, divSel, distSel])
  const estimate = selDist ? districtEstimate(selDist.r) : selDiv ? selDiv.districts.reduce((a, ds) => a + districtEstimate(ds.r), 0) : nationalTotal

  // Map lifecycle
  useEffect(() => {
    const map = Leaflet.map(elRef.current!, { zoomControl: false, attributionControl: false, minZoom: 6, maxZoom: 16, zoomSnap: 0.25, zoomDelta: 0.5, maxBounds: Leaflet.latLngBounds(BD_BOUNDS).pad(0.6), maxBoundsViscosity: 0.8 })
    Leaflet.control.zoom({ position: 'bottomright' }).addTo(map)
    Leaflet.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map)
    Leaflet.control.attribution({ prefix: false, position: 'bottomright' }).addAttribution('Boundaries: BBS / OCHA via <a href="https://www.geoboundaries.org" target="_blank" rel="noreferrer">geoBoundaries</a>').addTo(map)
    const panes: [string, number][] = [['mask', 250], ['districts', 410], ['divisions', 420], ['waqf', 610], ['inst', 620]]
    panes.forEach(([name, z]) => { map.createPane(name).style.zIndex = String(z) })
    map.fitBounds(BD_BOUNDS, fitOpts(map))
    mapRef.current = map
    firstView.current = true
    // Keep the selected area framed when the card changes size (sidebar toggle, rotation, window resize)
    const ro = new ResizeObserver(() => { map.invalidateSize(); map.fitBounds(viewRef.current, { ...fitOpts(map), animate: false }) })
    ro.observe(elRef.current!)
    return () => { ro.disconnect(); map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    let live = true
    fetch(geoUrl).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() }).then((g: BdGeo) => { if (live) setGeo(g) }).catch(() => { if (live) setGeoError(true) })
    return () => { live = false }
  }, [])

  // Basemap tiles
  useEffect(() => {
    const map = mapRef.current
    if (!map || basemap !== 'osm') return
    const tiles = Leaflet.tileLayer(OSM_TILES, { maxZoom: 19, className: 'gis-tiles', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors' }).addTo(map)
    return () => { tiles.remove() }
  }, [basemap])

  // Boundaries, mask and area labels
  useEffect(() => {
    const map = mapRef.current
    if (!map || !geo) return
    const g = Leaflet.layerGroup().addTo(map)
    const osm = basemap === 'osm'

    // Fade everything outside Bangladesh (street map) or paint the country on a plain canvas (boundaries only)
    if (osm) Leaflet.polygon([[[-85, -179], [-85, 179], [85, 179], [85, -179]], ...outerRings(geo.country)], { pane: 'mask', stroke: false, fillColor: '#f4f6f9', fillOpacity: 0.62, interactive: false }).addTo(g)
    else Leaflet.geoJSON(geo.country, { pane: 'mask', interactive: false, style: { stroke: false, fillColor: '#ffffff', fillOpacity: 1 } }).addTo(g)

    geo.districts.forEach((gd) => {
      const meta = allDistricts.find((x) => x.ds.en === gd.en)
      if (!meta) return
      const inDiv = !divSel || gd.div === divSel
      const isSel = distSel === gd.en
      const base: Leaflet.PathOptions = {
        color: isSel ? '#1d40a0' : '#64748b', weight: isSel ? 2.2 : 0.7, opacity: inDiv ? 0.9 : 0.4,
        fillColor: '#2f62d9', fillOpacity: isSel ? 0.18 : divSel && inDiv ? 0.07 : 0.01,
      }
      const layer = Leaflet.geoJSON(gd.geometry, { pane: 'districts', style: base })
      const n = instByDistrict.get(gd.en) ?? 0
      layer.bindTooltip(`${esc(L(meta.ds.bn, meta.ds.en))} ${esc(t('district'))}<small>${esc(L(meta.d.bn, meta.d.en))} ${esc(t('division'))} · ${fmtNum(n, lang)} ${esc(L('টি নমুনা প্রতিষ্ঠান', n === 1 ? 'sample institution' : 'sample institutions'))}</small>`, { sticky: true, direction: 'top', offset: [0, -8], className: 'gis-tip' })
      layer.on('mouseover', () => layer.setStyle({ color: '#2f62d9', weight: 2, opacity: 1, fillOpacity: isSel ? 0.22 : 0.14 }))
      layer.on('mouseout', () => layer.setStyle(base))
      layer.on('click', () => (divSel === gd.div ? selectArea(gd.div, isSel ? null : gd.en) : selectArea(gd.div)))
      layer.addTo(g)
    })

    geo.divisions.forEach((gv) => {
      const sel = divSel === gv.id
      Leaflet.geoJSON(gv.geometry, { pane: 'divisions', interactive: false, style: { color: sel ? '#1d40a0' : '#2f62d9', weight: sel ? 2.8 : 1.4, opacity: !divSel || sel ? 0.95 : 0.45, fill: false } }).addTo(g)
    })

    if (!divSel) {
      divisions.forEach((d) => {
        const n = institutions.filter((i) => i.divisionId === d.id).length
        Leaflet.marker([d.lat, d.lon], { icon: anchored(`<div class="gis-div-label"><span>${esc(L(d.bn, d.en))}</span><b>${fmtNum(n, lang)}</b></div>`), keyboard: false })
          .on('click', () => selectArea(d.id)).addTo(g)
      })
    } else {
      selDiv?.districts.forEach((ds) => {
        Leaflet.marker([ds.lat, ds.lon], { icon: anchored(`<div class="gis-dist-label${ds.en === distSel ? ' is-sel' : ''}">${esc(L(ds.bn, ds.en))}</div>`), interactive: false, keyboard: false }).addTo(g)
      })
    }
    return () => { g.remove() }
  }, [geo, basemap, divSel, distSel, lang])

  // Institution + waqf markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const g = Leaflet.layerGroup().addTo(map)
    visibleWaqf.forEach((w) => {
      Leaflet.marker([w.lat, w.lon], { pane: 'waqf', icon: anchored('<div class="gis-waqf"></div>'), keyboard: false })
        .bindTooltip(`${esc(L(w.nameBn, w.nameEn))}<small>${w.id} · ${esc(L('ওয়াক্‌ফ সম্পত্তি', 'Waqf property'))}</small>`, { direction: 'top', offset: [0, -8], className: 'gis-tip' })
        .on('click', () => nav('/waqf')).addTo(g)
    })
    visible.forEach((i) => {
      const pinned = pin?.id === i.id
      if (pinned) Leaflet.circleMarker([i.lat, i.lon], { pane: 'inst', radius: 14, color: typeMeta[i.type].color, weight: 2, opacity: 0.55, fillColor: typeMeta[i.type].color, fillOpacity: 0.15, interactive: false }).addTo(g)
      Leaflet.circleMarker([i.lat, i.lon], { pane: 'inst', radius: pinned ? 8 : 5.5, color: '#ffffff', weight: 1.5, fillColor: typeMeta[i.type].color, fillOpacity: 1 })
        .bindTooltip(`${esc(L(i.nameBn, i.nameEn))}<small>${i.id} · ${esc(t(i.type))}</small>`, { direction: 'top', offset: [0, -8], className: 'gis-tip' })
        .on('click', () => setPin(i)).addTo(g)
    })
    return () => { g.remove() }
  }, [visible, visibleWaqf, pin, lang])

  // Zoom to the selected area
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const geom = geo && (distSel ? geo.districts.find((x) => x.en === distSel)?.geometry : divSel ? geo.divisions.find((x) => x.id === divSel)?.geometry : null)
    const bounds = geom ? Leaflet.geoJSON(geom).getBounds() : Leaflet.latLngBounds(BD_BOUNDS)
    viewRef.current = bounds
    map.fitBounds(bounds, { ...fitOpts(map), animate: !firstView.current })
    firstView.current = false
  }, [geo, divSel, distSel])

  const areaTitle = selDist ? `${L(selDist.bn, selDist.en)} ${t('district')}` : selDiv ? `${L(selDiv.bn, selDiv.en)} ${t('division')}` : L('সারা দেশ', 'National')

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৫ · ধর্মীয় প্রতিষ্ঠান ম্যাপিং (GIS)', 'MODULE 05 · RELIGIOUS INSTITUTION MAPPING (GIS)')} title={t('gis')}
        subtitle={L('জাতীয় মানচিত্রে প্রতিষ্ঠান ও ওয়াক্‌ফ সম্পত্তি — বিভাগ / জেলা নির্বাচন করে count ও profile দেখুন', 'Institutions and waqf assets on a national map — select a division / district to see counts and profiles')} />

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <Card padded={false} className="relative overflow-hidden">
          <div className="absolute top-3 left-3 z-10 card p-2.5 w-52 shadow-pop">
            <button type="button" onClick={() => setPanelOpen((o) => !o)} className="w-full text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 flex items-center gap-1 px-1">
              <Layers size={11} /> <span className="flex-1 text-left">{L('লেয়ার', 'Layers')}</span><ChevronDown size={13} className={`transition-transform ${panelOpen ? 'rotate-180' : ''}`} />
            </button>
            {panelOpen && (
              <div className="space-y-1 mt-1.5">
                {(Object.keys(typeMeta) as InstType[]).map((k) => (
                  <label key={k} className="flex items-center gap-2 px-1 py-0.5 text-xs cursor-pointer hover:bg-slate-50 rounded">
                    <input type="checkbox" className="rounded" checked={layers[k]} onChange={() => setLayers((l) => ({ ...l, [k]: !l[k] }))} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: typeMeta[k].color }} />
                    <span className="bn flex-1">{typeMeta[k].emoji} {t(k)}</span>
                    <span className="tabular-nums text-slate-400">{fmtNum(scoped.filter((i) => i.type === k).length, lang)}</span>
                  </label>
                ))}
                <label className="flex items-center gap-2 px-1 py-0.5 text-xs cursor-pointer hover:bg-slate-50 rounded border-t border-slate-100 pt-1.5">
                  <input type="checkbox" className="rounded" checked={layers.waqf} onChange={() => setLayers((l) => ({ ...l, waqf: !l.waqf }))} />
                  <Landmark size={11} className="text-violet-600" /><span className="bn flex-1">{L('ওয়াক্‌ফ সম্পত্তি', 'Waqf properties')}</span>
                  <span className="tabular-nums text-slate-400">{fmtNum(waqfProperties.filter((w) => inScope(w.divisionId, w.district.en)).length, lang)}</span>
                </label>
                <div className="border-t border-slate-100 pt-2 px-1">
                  <div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 mb-1 bn">{L('বেসম্যাপ', 'Basemap')}</div>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
                    {([['osm', L('সড়ক মানচিত্র', 'Street map')], ['none', L('শুধু সীমানা', 'Boundaries')]] as const).map(([k, label]) => (
                      <button key={k} type="button" onClick={() => setBasemap(k)} className={`bn rounded-md py-1 transition ${basemap === k ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {divSel && (
            <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
              <button onClick={() => selectArea(null)} className="btn-secondary !py-1 text-xs shadow-pop"><Crosshair size={12} /> {L('সারা দেশ', 'Whole country')}</button>
              {selDist && selDiv && <button onClick={() => selectArea(selDiv.id)} className="btn-secondary !py-1 text-xs shadow-pop bn"><ChevronLeft size={12} /> {L(selDiv.bn, selDiv.en)} {t('division')}</button>}
            </div>
          )}

          <div ref={elRef} className="gis-map w-full h-[520px] sm:h-[640px]" role="application" aria-label={L('বাংলাদেশের মানচিত্র', 'Map of Bangladesh')} />

          {geoError && <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 bn">{L('সীমানা ডেটা লোড করা যায়নি', 'Boundary data could not be loaded')}</div>}
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title={areaTitle} subtitle={L('নির্বাচিত এলাকার সারসংক্ষেপ', 'Summary of the selected area')} />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-slate-50 p-3"><div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 bn">{L('নমুনা প্রতিষ্ঠান', 'Sample institutions')}</div><div className="text-xl font-bold tabular-nums">{fmtNum(scoped.length, lang)}</div></div>
              <div className="rounded-lg bg-slate-50 p-3"><div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 bn">{divSel ? L('প্রাক্কলিত মোট', 'Estimated total') : L('জাতীয় প্রাক্কলন', 'National estimate')}</div><div className="text-xl font-bold tabular-nums">{fmtNum(estimate, lang)}</div></div>
            </div>
            <div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 mb-1 bn flex justify-between"><span>{L('জেলা', 'Districts')}</span><span className="tabular-nums">{fmtNum((selDiv ? selDiv.districts : allDistricts).length, lang)}</span></div>
            <ul className="max-h-56 overflow-y-auto divide-y divide-slate-100 -mx-1">
              {allDistricts.filter(({ d }) => !divSel || d.id === divSel).map(({ d, ds }) => (
                <li key={ds.en} className={`flex items-center justify-between py-1.5 px-1 text-sm cursor-pointer rounded hover:text-brand-700 ${distSel === ds.en ? 'bg-brand-50 text-brand-700 font-semibold' : ''}`} onClick={() => selectArea(d.id, distSel === ds.en ? null : ds.en)}>
                  <span className="bn">{L(ds.bn, ds.en)}</span><span className="tabular-nums text-slate-500 text-xs">{fmtNum(instByDistrict.get(ds.en) ?? 0, lang)}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title={L('নির্বাচিত প্রতিষ্ঠান', 'Selected institution')} />
            {pin ? (<div>
              <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{typeMeta[pin.type].emoji}</span><div><div className="font-semibold text-sm bn">{L(pin.nameBn, pin.nameEn)}</div><div className="mono-id">{pin.id}</div></div></div>
              <KV k={t('type')} v={t(pin.type)} /><KV k={t('district')} v={L(pin.district.bn, pin.district.en)} /><KV k={t('capacity')} v={fmtNum(pin.capacity, lang)} /><KV k="GPS" v={`${pin.lat.toFixed(4)}, ${pin.lon.toFixed(4)}`} mono /><KV k={t('status')} v={<Badge>{pin.status}</Badge>} />
              <button className="btn-primary w-full mt-3 text-xs" onClick={() => nav(`/institutions/${pin.id}`)}><Building2 size={13} /> {L('প্রোফাইল খুলুন', 'Open profile')}</button>
            </div>) : <div className="text-sm text-slate-400 text-center py-6 bn">{L('মানচিত্রে একটি বিন্দুতে ক্লিক করুন', 'Click a marker on the map')}</div>}
          </Card>
        </div>
      </div>
    </div>
  )
}
