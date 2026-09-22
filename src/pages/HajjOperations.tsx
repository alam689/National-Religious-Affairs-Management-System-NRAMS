import { useState } from 'react'
import { Plane, Hotel, Bus, HeartPulse, Smartphone, Wifi, Battery, Bell, CreditCard, MapPin, Phone, CalendarDays, BookOpen, ChevronRight } from 'lucide-react'
import { useLang, fmtNum, fmtDate } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Progress, Tabs, type Column } from '../components/ui'
import { flights, pilgrims } from '../data/mock'

type Flight = typeof flights[number]

const hotels = [
  { id: 'MK-H-021', name: 'Al Kiswah Towers', city: 'Makkah', distance: '850 m', rooms: 420, occupied: 388, pilgrims: 1540, contract: 'IF-KSA-2026-11' },
  { id: 'MK-H-034', name: 'Dar Al Eiman Grand', city: 'Makkah', distance: '1.2 km', rooms: 310, occupied: 302, pilgrims: 1190, contract: 'IF-KSA-2026-14' },
  { id: 'MK-H-047', name: 'Elaf Ajyad', city: 'Makkah', distance: '600 m', rooms: 260, occupied: 140, pilgrims: 560, contract: 'IF-KSA-2026-19' },
  { id: 'MD-H-009', name: 'Madinah Movenpick', city: 'Madinah', distance: '300 m', rooms: 380, occupied: 121, pilgrims: 480, contract: 'IF-KSA-2026-22' },
  { id: 'MD-H-015', name: 'Al Eiman Taibah', city: 'Madinah', distance: '450 m', rooms: 290, occupied: 0, pilgrims: 0, contract: 'IF-KSA-2026-25' },
]
const transport = [
  { route: 'Jeddah Airport → Makkah hotels', vehicles: 42, trips: 118, status: 'Running' },
  { route: 'Makkah → Madinah (Haramain train)', vehicles: 6, trips: 14, status: 'Scheduled' },
  { route: 'Makkah → Mina (8 Dhul Hijjah)', vehicles: 210, trips: 0, status: 'Planned' },
  { route: 'Mina → Arafat → Muzdalifah', vehicles: 210, trips: 0, status: 'Planned' },
  { route: 'Madinah → Madinah Airport', vehicles: 18, trips: 3, status: 'Running' },
]

export default function HajjOperations() {
  const { t, L, lang } = useLang()
  const [tab, setTab] = useState<'flights' | 'housing' | 'transport' | 'medical'>('flights')
  const [appTab, setAppTab] = useState(0)
  const me = pilgrims.find((p) => p.flight && p.payment === 'Paid') ?? pilgrims[0]
  const myFlight = flights.find((f) => f.id === me.flight) ?? flights[8]

  const fCols: Column<Flight>[] = [
    { key: 'id', header: L('ফ্লাইট', 'Flight'), render: (r) => <span className="font-mono text-xs font-semibold text-slate-800">{r.id}</span> },
    { key: 'carrier', header: L('এয়ারলাইন', 'Carrier') },
    { key: 'route', header: L('রুট', 'Route'), render: (r) => <span className="font-mono text-xs">{r.route}</span> },
    { key: 'date', header: t('date'), render: (r) => `${fmtDate(r.date, lang)} · ${r.time}` },
    { key: 'boarded', header: L('বোর্ডেড / আসন', 'Boarded / seats'), render: (r) => <div className="w-32"><div className="flex justify-between text-[11px] mb-1 tabular-nums"><span>{fmtNum(r.boarded, lang)}</span><span className="text-slate-400">{fmtNum(r.seats, lang)}</span></div><Progress value={(r.boarded / r.seats) * 100} target={90} /></div> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৬ · হজ অপারেশনস', 'MODULE 06 · HAJJ OPERATIONS')} title={t('hajjOps')}
        subtitle={L('ফ্লাইট, আবাসন, পরিবহন, মেডিকেল ও সৌদি-পক্ষ সেবা সমন্বয় — সাথে হজযাত্রী মোবাইল অ্যাপ', 'Flights, accommodation, transport, medical and Saudi-side coordination — plus the Pilgrim mobile app')} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('মোট ফ্লাইট (প্রি-হজ)', 'Total flights (pre-Hajj)')} value={128} icon={Plane} hint={`${fmtNum(flights.filter((f) => f.status === 'Departed').length, lang)} ${L('নমুনায় গমন', 'departed in sample')}`} />
        <StatTile label={L('আবাসন চুক্তি (মক্কা/মদিনা)', 'Housing contracts (Makkah/Madinah)')} value={hotels.length} icon={Hotel} tone="violet" hint={`${fmtNum(hotels.reduce((a, h) => a + h.rooms, 0), lang)} ${L('কক্ষ', 'rooms')}`} />
        <StatTile label={L('পরিবহন বহর', 'Transport fleet')} value={486} icon={Bus} tone="sky" />
        <StatTile label={L('মেডিকেল টিম / সেবা গ্রহণ', 'Medical team / cases')} value={212} icon={HeartPulse} tone="red" hint={L('আজ ২১২ জন সেবা নিয়েছেন', '212 treated today')} />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div>
          <div className="mb-4"><Tabs value={tab} onChange={setTab} tabs={[{ key: 'flights', label: L('ফ্লাইট', 'Flights'), count: flights.length }, { key: 'housing', label: L('আবাসন', 'Accommodation'), count: hotels.length }, { key: 'transport', label: L('পরিবহন', 'Transport'), count: transport.length }, { key: 'medical', label: L('মেডিকেল', 'Medical') }]} /></div>
          {tab === 'flights' && <Card padded={false}><Table columns={fCols} rows={flights} /></Card>}
          {tab === 'housing' && (
            <div className="grid sm:grid-cols-2 gap-3">
              {hotels.map((h) => (
                <div key={h.id} className="card p-4 hover:shadow-pop hover:border-brand-300 transition">
                  <div className="flex items-start justify-between"><div><div className="font-semibold text-slate-800">{h.name}</div><div className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} /> {h.city} · {h.distance} {L('হারাম থেকে', 'from Haram')}</div></div><Badge tone={h.city === 'Makkah' ? 'brand' : 'violet'}>{h.city}</Badge></div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    {[[L('কক্ষ', 'Rooms'), h.rooms], [L('দখলকৃত', 'Occupied'), h.occupied], [L('হজযাত্রী', 'Pilgrims'), h.pilgrims]].map(([k, v]) => <div key={String(k)} className="rounded-lg bg-slate-50 p-2"><div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400 bn">{k}</div><div className="font-bold tabular-nums">{fmtNum(v as number, lang)}</div></div>)}
                  </div>
                  <Progress value={(h.occupied / h.rooms) * 100} target={101} className="mt-3" />
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">{h.contract}</div>
                </div>
              ))}
            </div>
          )}
          {tab === 'transport' && (
            <Card padded={false}><Table columns={[{ key: 'route', header: L('রুট', 'Route'), render: (r: typeof transport[0]) => <span className="font-medium">{r.route}</span> }, { key: 'vehicles', header: L('যানবাহন', 'Vehicles'), align: 'right', render: (r: typeof transport[0]) => fmtNum(r.vehicles, lang) }, { key: 'trips', header: L('আজকের ট্রিপ', 'Trips today'), align: 'right', render: (r: typeof transport[0]) => fmtNum(r.trips, lang) }, { key: 'status', header: t('status'), render: (r: typeof transport[0]) => <Badge tone={r.status === 'Running' ? 'emerald' : r.status === 'Scheduled' ? 'amber' : 'slate'}>{r.status}</Badge> }]} rows={transport.map((r, i) => ({ ...r, id: i }))} /></Card>
          )}
          {tab === 'medical' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Card><CardHeader title={L('মেডিকেল সেন্টার', 'Medical centres')} />
                {[['Makkah – Al Aziziyah Clinic', 38, 'Open'], ['Makkah – Misfalah Clinic', 21, 'Open'], ['Madinah – Central Clinic', 12, 'Open'], ['Mina Field Hospital', 0, 'Planned']].map(([n, c, s]) => <div key={String(n)} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm"><span>{n}</span><span className="flex items-center gap-2"><span className="tabular-nums text-slate-500 text-xs">{fmtNum(c as number, lang)} {L('আজ', 'today')}</span><Badge>{s}</Badge></span></div>)}
              </Card>
              <Card><CardHeader title={L('আজকের কেস (ধরন অনুযায়ী)', 'Cases today (by type)')} />
                {[[L('শ্বাসকষ্ট / ARI', 'Respiratory / ARI'), 74], [L('ডায়াবেটিস / উচ্চ রক্তচাপ', 'Diabetes / hypertension'), 58], [L('হিটস্ট্রোক / পানিশূন্যতা', 'Heat stroke / dehydration'), 41], [L('আঘাত', 'Injury'), 22], [L('হাসপাতালে রেফার', 'Hospital referrals'), 9], [L('মৃত্যু', 'Deaths'), 1]].map(([k, v], i) => <div key={String(k)}><div className="flex justify-between text-xs mb-1 mt-2"><span className="bn">{k}</span><span className="tabular-nums font-semibold">{fmtNum(v as number, lang)}</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${((v as number) / 74) * 100}%`, background: i === 5 ? '#ef4444' : '#2f62d9' }} /></div></div>)}
              </Card>
            </div>
          )}
        </div>

        {/* Pilgrim app mock */}
        <div>
          <div className="kicker mb-2 flex items-center gap-1.5"><Smartphone size={12} /> {L('হজযাত্রী মোবাইল অ্যাপ', 'Pilgrim mobile app')}</div>
          <div className="mx-auto w-[300px] rounded-[36px] bg-[#0a1530] p-2.5 shadow-pop">
            <div className="rounded-[28px] bg-cream overflow-hidden h-[600px] flex flex-col">
              <div className="bg-[#0a1530] text-white px-5 pt-3 pb-4">
                <div className="flex justify-between text-[10px] text-slate-300 mb-2"><span>14:20</span><span className="flex gap-1 items-center"><Wifi size={10} /><Battery size={10} /></span></div>
                <div className="flex items-center justify-between"><div><div className="text-xs text-brand-300 font-semibold">{L('আসসালামু আলাইকুম', 'Assalamu Alaikum')}</div><div className="font-bold bn">{me.name}</div><div className="text-[10px] text-slate-400 font-mono">{me.id}</div></div><Bell size={16} /></div>
              </div>
              <div className="flex gap-1 p-2 bg-white border-b border-slate-200 text-[10px] font-semibold">
                {[L('হোম', 'Home'), L('ফ্লাইট', 'Flight'), L('আবাসন', 'Hotel'), L('গাইড', 'Guide')].map((x, i) => <button key={x} onClick={() => setAppTab(i)} className={`flex-1 py-1.5 rounded-md bn ${appTab === i ? 'bg-brand-500 text-white' : 'text-slate-600'}`}>{x}</button>)}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
                {appTab === 0 && (<>
                  <div className="card p-3"><div className="flex items-center justify-between"><span className="text-xs text-slate-500 bn">{L('নিবন্ধন অবস্থা', 'Registration')}</span><Badge>{me.status}</Badge></div></div>
                  <div className="card p-3"><div className="flex items-center gap-2 mb-1"><CreditCard size={14} className="text-brand-600" /><span className="text-xs font-semibold bn">{L('পেমেন্ট', 'Payment')}</span></div><div className="flex justify-between text-xs tabular-nums"><span>৳{fmtNum(me.paid, lang)}</span><span className="text-slate-400">/ ৳{fmtNum(me.total, lang)}</span></div><Progress value={(me.paid / me.total) * 100} className="mt-1.5" /></div>
                  <div className="card p-3"><div className="text-xs font-semibold mb-2 bn">{L('গুরুত্বপূর্ণ নির্দেশনা', 'Important notices')}</div>{[L('মেডিকেল সার্টিফিকেট ৩০ এপ্রিলের মধ্যে জমা দিন', 'Submit medical certificate by 30 April'), L('প্রশিক্ষণ: ২ মে, জেলা মডেল মসজিদ', 'Training: 2 May, District Model Mosque'), L('আশকোনা ক্যাম্পে রিপোর্ট: ফ্লাইটের ৮ ঘণ্টা আগে', 'Report to Ashkona camp 8 hrs before flight')].map((n) => <div key={n} className="text-[11px] text-slate-600 py-1.5 border-t border-slate-100 first:border-0 bn">• {n}</div>)}</div>
                  <div className="grid grid-cols-2 gap-2"><button className="card p-3 text-left"><Phone size={14} className="text-red-500 mb-1" /><div className="text-[11px] font-semibold bn">{L('জরুরি হটলাইন', 'Emergency hotline')}</div><div className="text-[10px] text-slate-500">16136 · +966 12 555 0100</div></button><button className="card p-3 text-left"><MapPin size={14} className="text-brand-500 mb-1" /><div className="text-[11px] font-semibold bn">{L('আমার অবস্থান শেয়ার', 'Share my location')}</div><div className="text-[10px] text-slate-500 bn">{L('হারিয়ে গেলে', 'If lost')}</div></button></div>
                </>)}
                {appTab === 1 && (<div className="card p-4">
                  <div className="flex items-center gap-2 mb-3"><Plane size={16} className="text-brand-600" /><span className="font-bold font-mono">{myFlight.id}</span><Badge>{myFlight.status}</Badge></div>
                  <div className="flex items-center justify-between text-center"><div><div className="text-2xl font-bold">DAC</div><div className="text-[10px] text-slate-500">Dhaka</div></div><div className="flex-1 border-t border-dashed border-slate-300 mx-3 relative"><Plane size={12} className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-brand-500" /></div><div><div className="text-2xl font-bold">{myFlight.route.slice(-3)}</div><div className="text-[10px] text-slate-500">{myFlight.route.endsWith('JED') ? 'Jeddah' : 'Madinah'}</div></div></div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">{[[t('date'), fmtDate(myFlight.date, lang)], [L('সময়', 'Time'), myFlight.time], [L('এয়ারলাইন', 'Carrier'), myFlight.carrier], [L('রিপোর্টিং', 'Reporting'), L('আশকোনা, -৮ ঘ.', 'Ashkona, -8h')]].map(([k, v]) => <div key={String(k)} className="rounded-lg bg-slate-50 p-2"><div className="text-[10px] text-slate-400 bn">{k}</div><div className="font-semibold bn">{v}</div></div>)}</div>
                </div>)}
                {appTab === 2 && (<>
                  {hotels.slice(0, 1).concat(hotels.slice(3, 4)).map((h) => <div key={h.id} className="card p-3"><div className="flex items-center gap-2"><Hotel size={14} className="text-violet-600" /><span className="font-semibold text-sm">{h.name}</span></div><div className="text-[11px] text-slate-500 mt-1">{h.city} · {h.distance} {L('হারাম থেকে', 'from Haram')}</div><div className="text-[11px] mt-1 bn">{L('কক্ষ', 'Room')} {h.city === 'Makkah' ? '714' : '302'} · {L('বাস নং', 'Bus')} {h.city === 'Makkah' ? '42' : '17'}</div></div>)}
                  <div className="card p-3"><div className="flex items-center gap-2 mb-1"><Bus size={14} className="text-sky-600" /><span className="text-xs font-semibold bn">{L('পরিবহন', 'Transport')}</span></div><div className="text-[11px] text-slate-600 bn">{L('জেদ্দা বিমানবন্দর → হোটেল: বাস ৪২ · মোয়াল্লেম নং ১১২', 'Jeddah airport → hotel: Bus 42 · Muallim no. 112')}</div></div>
                </>)}
                {appTab === 3 && (<>
                  {[[CalendarDays, L('প্রশিক্ষণ সময়সূচি', 'Training schedule')], [BookOpen, L('হজের নিয়মাবলি (ধাপে ধাপে)', 'Hajj procedures (step by step)')], [BookOpen, L('দোয়া ও যিকির', 'Duas & dhikr')], [Smartphone, L('ভিডিও গাইড', 'Video guides')], [Phone, L('সচরাচর জিজ্ঞাসা (FAQ)', 'FAQ')]].map(([I, x], i) => { const Icon = I as typeof BookOpen; return <button key={i} className="card p-3 w-full flex items-center gap-3 text-left"><Icon size={15} className="text-brand-600" /><span className="text-xs font-medium flex-1 bn">{x as string}</span><ChevronRight size={13} className="text-slate-400" /></button> })}
                </>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
