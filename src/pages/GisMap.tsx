import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, Landmark, Building2, Crosshair } from 'lucide-react'
import { useLang, fmtNum } from '../i18n'
import { PageHeader, Card, CardHeader, Badge, KV } from '../components/ui'
import { institutions, divisions, bdOutline, waqfProperties, nationalInstitutionStats, type InstType, type Institution } from '../data/mock'

const W = 480, H = 620
const px = (lon: number) => ((lon - 87.9) / (92.8 - 87.9)) * W
const py = (lat: number) => ((26.75 - lat) / (26.75 - 20.6)) * H

const typeMeta: Record<InstType, { emoji: string; color: string }> = {
  mosque: { emoji: '🕌', color: '#2f62d9' }, madrasa: { emoji: '📚', color: '#0ea5e9' }, temple: { emoji: '🛕', color: '#f59e0b' },
  church: { emoji: '⛪', color: '#8b5cf6' }, buddhist: { emoji: '☸️', color: '#10b981' }, other: { emoji: '🏛️', color: '#94a3b8' },
}

export default function GisMap() {
  const { t, L, lang } = useLang()
  const nav = useNavigate()
  const [layers, setLayers] = useState<Record<string, boolean>>({ mosque: true, madrasa: true, temple: true, church: true, buddhist: true, other: true, waqf: false })
  const [divSel, setDivSel] = useState<string | null>(null)
  const [hover, setHover] = useState<Institution | null>(null)
  const [pin, setPin] = useState<Institution | null>(null)

  const outline = bdOutline.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(' ')
  const visible = useMemo(() => institutions.filter((i) => layers[i.type] && (!divSel || i.divisionId === divSel)), [layers, divSel])
  const divCounts = divisions.map((d) => ({ d, n: institutions.filter((i) => i.divisionId === d.id).length, nat: Math.round(Object.values(nationalInstitutionStats).reduce((a, b) => a + b, 0) * (0.06 + (d.districts.length / 40))) }))

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৫ · ধর্মীয় প্রতিষ্ঠান ম্যাপিং (GIS)', 'MODULE 05 · RELIGIOUS INSTITUTION MAPPING (GIS)')} title={t('gis')}
        subtitle={L('জাতীয় মানচিত্রে প্রতিষ্ঠান ও ওয়াক্‌ফ সম্পত্তি — বিভাগ / জেলা নির্বাচন করে count ও profile দেখুন', 'Institutions and waqf assets on a national map — select a division / district to see counts and profiles')} />

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <Card padded={false} className="relative overflow-hidden">
          <div className="absolute top-3 left-3 z-10 card p-2.5 space-y-1 w-52 shadow-pop">
            <div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 flex items-center gap-1 px-1"><Layers size={11} /> {L('লেয়ার', 'Layers')}</div>
            {(Object.keys(typeMeta) as InstType[]).map((k) => (
              <label key={k} className="flex items-center gap-2 px-1 py-0.5 text-xs cursor-pointer hover:bg-slate-50 rounded">
                <input type="checkbox" className="rounded" checked={layers[k]} onChange={() => setLayers((l) => ({ ...l, [k]: !l[k] }))} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: typeMeta[k].color }} />
                <span className="bn flex-1">{typeMeta[k].emoji} {t(k)}</span>
                <span className="tabular-nums text-slate-400">{fmtNum(institutions.filter((i) => i.type === k && (!divSel || i.divisionId === divSel)).length, lang)}</span>
              </label>
            ))}
            <label className="flex items-center gap-2 px-1 py-0.5 text-xs cursor-pointer hover:bg-slate-50 rounded border-t border-slate-100 pt-1.5">
              <input type="checkbox" className="rounded" checked={layers.waqf} onChange={() => setLayers((l) => ({ ...l, waqf: !l.waqf }))} />
              <Landmark size={11} className="text-violet-600" /><span className="bn flex-1">{L('ওয়াক্‌ফ সম্পত্তি', 'Waqf properties')}</span><span className="tabular-nums text-slate-400">{fmtNum(waqfProperties.length, lang)}</span>
            </label>
          </div>
          {divSel && <button onClick={() => setDivSel(null)} className="absolute top-3 right-3 z-10 btn-secondary !py-1 text-xs"><Crosshair size={12} /> {L('সারা দেশ', 'Whole country')}</button>}

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[640px] bg-[#f4f6f9]">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#e2e8f0" strokeWidth=".5" /></pattern>
              <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0a1730" floodOpacity=".15" /></filter>
            </defs>
            <rect width={W} height={H} fill="url(#grid)" />
            <polygon points={outline} fill="#ffffff" stroke="#adc7f7" strokeWidth="1.5" filter="url(#sh)" />
            {/* division bubbles */}
            {divCounts.map(({ d, n }) => {
              const sel = divSel === d.id
              return (
                <g key={d.id} className="cursor-pointer" onClick={() => setDivSel(sel ? null : d.id)}>
                  <circle cx={px(d.lon)} cy={py(d.lat)} r={sel ? 34 : 26} fill={sel ? 'rgba(47,98,217,.18)' : 'rgba(47,98,217,.07)'} stroke={sel ? '#2f62d9' : '#adc7f7'} strokeWidth={sel ? 2 : 1} strokeDasharray={sel ? '' : '3 2'} />
                  <text x={px(d.lon)} y={py(d.lat) - 30} textAnchor="middle" fontSize="10" fontWeight="700" fill={sel ? '#1d40a0' : '#475569'} className="bn">{L(d.bn, d.en)}</text>
                  {!divSel && <text x={px(d.lon)} y={py(d.lat) + 3} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d40a0">{fmtNum(n, lang)}</text>}
                </g>
              )
            })}
            {/* waqf */}
            {layers.waqf && waqfProperties.filter((w) => !divSel || w.divisionId === divSel).map((w) => (
              <rect key={w.id} x={px(w.lon) - 3} y={py(w.lat) - 3} width="6" height="6" fill="#8b5cf6" stroke="#fff" strokeWidth="1" transform={`rotate(45 ${px(w.lon)} ${py(w.lat)})`} className="cursor-pointer" onClick={() => nav('/waqf')} />
            ))}
            {/* institutions */}
            {visible.map((i) => (
              <circle key={i.id} cx={px(i.lon)} cy={py(i.lat)} r={pin?.id === i.id ? 7 : 4.5} fill={typeMeta[i.type].color} stroke="#fff" strokeWidth="1.5" className="cursor-pointer transition-all"
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => setPin(i)} />
            ))}
            {hover && (
              <g transform={`translate(${Math.min(px(hover.lon) + 10, W - 190)}, ${Math.max(py(hover.lat) - 40, 10)})`}>
                <rect width="180" height="42" rx="8" fill="#0a1530" opacity=".95" />
                <text x="10" y="17" fontSize="10" fontWeight="700" fill="#fff" className="bn">{L(hover.nameBn, hover.nameEn).slice(0, 30)}</text>
                <text x="10" y="32" fontSize="9" fill="#94a3b8">{hover.id} · {t(hover.type)}</text>
              </g>
            )}
          </svg>
          <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 bg-white/80 rounded px-2 py-1">{L('স্কিম্যাটিক মানচিত্র · প্রকৃত বাস্তবায়নে OpenStreetMap / BBS শেপফাইল', 'Schematic map · production build uses OpenStreetMap / BBS shapefiles')}</div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title={divSel ? L(divisions.find((d) => d.id === divSel)!.bn, divisions.find((d) => d.id === divSel)!.en) + ' ' + t('division') : L('সারা দেশ', 'National')} subtitle={L('নির্বাচিত এলাকার সারসংক্ষেপ', 'Summary of the selected area')} />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-slate-50 p-3"><div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 bn">{L('নমুনা প্রতিষ্ঠান', 'Sample institutions')}</div><div className="text-xl font-bold tabular-nums">{fmtNum(institutions.filter((i) => !divSel || i.divisionId === divSel).length, lang)}</div></div>
              <div className="rounded-lg bg-slate-50 p-3"><div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 bn">{L('জাতীয় প্রাক্কলন', 'National estimate')}</div><div className="text-xl font-bold tabular-nums">{fmtNum(divSel ? divCounts.find((x) => x.d.id === divSel)!.nat : Object.values(nationalInstitutionStats).reduce((a, b) => a + b, 0), lang)}</div></div>
            </div>
            <div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-400 mb-1 bn">{L('জেলা', 'Districts')}</div>
            <ul className="max-h-56 overflow-y-auto divide-y divide-slate-100">
              {(divSel ? divisions.filter((d) => d.id === divSel) : divisions).flatMap((d) => d.districts.map((ds) => ({ d, ds }))).map(({ d, ds }) => {
                const n = institutions.filter((i) => i.district.en === ds.en).length
                return <li key={ds.en} className="flex items-center justify-between py-1.5 text-sm cursor-pointer hover:text-brand-700" onClick={() => setDivSel(d.id)}><span className="bn">{L(ds.bn, ds.en)}</span><span className="tabular-nums text-slate-500 text-xs">{fmtNum(n, lang)}</span></li>
              })}
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
