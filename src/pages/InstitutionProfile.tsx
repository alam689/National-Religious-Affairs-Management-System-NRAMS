import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Users, Landmark, Building2, Zap, Droplets, FileText, Camera, Printer, QrCode, Pencil } from 'lucide-react'
import { useLang, fmtNum, fmtDate, fmtMoney } from '../i18n'
import { Card, CardHeader, KV, Badge, Tabs, Table, Avatar, EmptyState, type Column } from '../components/ui'
import { institutions, grants, inspections, personnel, type Grant, type Inspection } from '../data/mock'

type Tab = 'overview' | 'committee' | 'infra' | 'grants' | 'inspections' | 'complaints' | 'docs'

export default function InstitutionProfile() {
  const { id } = useParams()
  const nav = useNavigate()
  const { t, L, lang } = useLang()
  const inst = institutions.find((i) => i.id === id) ?? institutions[0]
  const [tab, setTab] = useState<Tab>('overview')
  const myGrants = grants.filter((g) => g.institution.id === inst.id)
  const myInsp = inspections.filter((i) => i.institution.id === inst.id)
  const staff = personnel.filter((p) => p.institution.id === inst.id)
  const committee = [
    { role: L('সভাপতি', 'President'), name: inst.committeeHead, mobile: inst.mobile },
    { role: L('সাধারণ সম্পাদক', 'General Secretary'), name: inst.incharge, mobile: '01711' + inst.mobile.slice(5) },
    { role: L('কোষাধ্যক্ষ', 'Treasurer'), name: 'মোঃ আব্দুল হাই', mobile: '01812' + inst.mobile.slice(5) },
    { role: L('সদস্য', 'Member'), name: 'মোঃ সোহরাব হোসেন', mobile: '01912' + inst.mobile.slice(5) },
    { role: L('সদস্য', 'Member'), name: 'মোঃ নাজমুল হুদা', mobile: '01512' + inst.mobile.slice(5) },
  ]

  const gCols: Column<Grant>[] = [
    { key: 'id', header: 'Grant ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'purpose', header: L('উদ্দেশ্য', 'Purpose'), render: (r) => <span className="bn">{L(r.purposeBn, r.purposeEn)}</span> },
    { key: 'fy', header: L('অর্থবছর', 'FY'), render: (r) => r.fiscalYear },
    { key: 'req', header: L('আবেদিত', 'Requested'), align: 'right', render: (r) => fmtMoney(r.requested, lang) },
    { key: 'apr', header: t('approved'), align: 'right', render: (r) => r.approved ? fmtMoney(r.approved, lang) : '—' },
    { key: 'st', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  const iCols: Column<Inspection>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'date', header: t('date'), render: (r) => fmtDate(r.date, lang) },
    { key: 'officer', header: L('কর্মকর্তা', 'Officer'), render: (r) => <span className="bn">{r.officer}</span> },
    { key: 'score', header: L('স্কোর', 'Score'), align: 'right', render: (r) => r.score ? `${fmtNum(r.score, lang)}/100` : '—' },
    { key: 'issues', header: L('সমস্যা', 'Issues'), render: (r) => r.issues.length ? r.issues.map((x) => <Badge key={x} tone="amber" className="mr-1 mb-1 bn">{x}</Badge>) : <span className="text-emerald-600 text-xs font-semibold">{L('কোনো সমস্যা নেই', 'None')}</span> },
    { key: 'st', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]

  return (
    <div>
      <button onClick={() => nav('/institutions')} className="btn-ghost -ml-2 mb-3 text-sm no-print"><ArrowLeft size={15} /> {L('রেজিস্ট্রিতে ফিরুন', 'Back to registry')}</button>

      {/* Hero */}
      <div className="card p-0 overflow-hidden mb-5 animate-fadeUp">
        <div className="h-28 relative" style={{ background: 'radial-gradient(700px 300px at 10% 0%, rgba(38,84,196,.55), transparent 60%), linear-gradient(120deg, #0b1633, #14306b)' }}>
          <div className="absolute inset-0 opacity-[.08]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="px-6 pb-5 -mt-10 flex flex-wrap items-end gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-card grid place-items-center text-4xl">{{ mosque: '🕌', madrasa: '📚', temple: '🛕', church: '⛪', buddhist: '☸️', other: '🏛️' }[inst.type]}</div>
          <div className="flex-1 min-w-[240px] pt-10 sm:pt-0">
            <div className="kicker">{L('মডিউল ০২ · ডিজিটাল প্রোফাইল', 'MODULE 02 · DIGITAL PROFILE')}</div>
            <h1 className="text-2xl font-bold text-slate-900 bn">{L(inst.nameBn, inst.nameEn)}</h1>
            <div className="text-sm text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="mono-id text-sm">{inst.id}</span>
              <span className="bn flex items-center gap-1"><MapPin size={13} /> {inst.union}, {inst.upazila}, {L(inst.district.bn, inst.district.en)}</span>
              <span className="flex items-center gap-1 tabular-nums"><Phone size={13} /> {inst.mobile}</span>
              <Badge>{inst.status}</Badge>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <button className="btn-secondary"><QrCode size={15} /> QR</button>
            <button className="btn-secondary" onClick={() => window.print()}><Printer size={15} /> {t('print')}</button>
            <button className="btn-primary"><Pencil size={15} /> {L('তথ্য হালনাগাদ', 'Update')}</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 border-t border-slate-100 divide-x divide-slate-100">
          {[
            [t('established'), fmtNum(inst.established, lang).replace(/[,،]/g, '')], [t('capacity'), fmtNum(inst.capacity, lang)], [L('জমি (শতাংশ)', 'Land (decimal)'), fmtNum(inst.landDecimal, lang)],
            [L('মোট অনুদান', 'Grants received'), fmtNum(inst.grantsReceived, lang)], [L('শেষ পরিদর্শন', 'Last inspection'), inst.lastInspection ? fmtDate(inst.lastInspection, lang) : '—'],
          ].map(([k, v]) => <div key={k} className="px-5 py-3"><div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 bn">{k}</div><div className="font-bold tabular-nums text-slate-900">{v}</div></div>)}
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { key: 'overview', label: L('সারসংক্ষেপ', 'Overview') }, { key: 'committee', label: L('কমিটি ও জনবল', 'Committee & Staff'), count: committee.length + staff.length },
        { key: 'infra', label: L('অবকাঠামো ও সম্পত্তি', 'Infrastructure & Land') }, { key: 'grants', label: L('অনুদান ইতিহাস', 'Grant history'), count: myGrants.length },
        { key: 'inspections', label: L('পরিদর্শন', 'Inspections'), count: myInsp.length }, { key: 'complaints', label: L('অভিযোগ', 'Complaints'), count: 0 }, { key: 'docs', label: L('নথিপত্র', 'Documents'), count: 6 },
      ]} />

      <div className="mt-5">
        {tab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-4">
            <Card><CardHeader title={L('প্রতিষ্ঠান তথ্য', 'Institution information')} />
              <KV k="Institution ID" v={inst.id} mono /><KV k={t('type')} v={t(inst.type)} /><KV k={t('division')} v={L(...(({ bn, en }) => [bn, en] as [string, string])(inst.district))} />
              <KV k={t('upazila')} v={inst.upazila} /><KV k={t('union')} v={inst.union} /><KV k={L('নিবন্ধন তারিখ', 'Registered on')} v={fmtDate(inst.registeredOn, lang)} /><KV k="GPS" v={`${inst.lat.toFixed(5)}, ${inst.lon.toFixed(5)}`} mono />
            </Card>
            <Card><CardHeader title={L('দায়িত্বপ্রাপ্ত ব্যক্তি', 'Key persons')} />
              <div className="space-y-3">
                {[[inst.committeeHead, L('কমিটি সভাপতি', 'Committee president')], [inst.incharge, L('দায়িত্বপ্রাপ্ত ব্যক্তি', 'Person in charge')], ...staff.slice(0, 2).map((s) => [s.name, s.role] as [string, string])].map(([n, r], i) => (
                  <div key={i} className="flex items-center gap-3"><Avatar name={n} size={36} /><div><div className="text-sm font-medium text-slate-800 bn">{n}</div><div className="text-xs text-slate-500 bn">{r}</div></div></div>
                ))}
              </div>
            </Card>
            <Card><CardHeader title={L('অবস্থান', 'Location')} subtitle={L('GPS ট্যাগ', 'GPS tag')} />
              <div className="rounded-lg bg-slate-50 border border-slate-200 h-44 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 rounded-full bg-brand-400 animate-pulseRing" />
                  <div className="w-4 h-4 rounded-full bg-brand-500 ring-4 ring-white shadow" />
                </div>
                <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-white/90 rounded px-1.5 py-0.5 text-slate-600">{inst.lat.toFixed(5)}, {inst.lon.toFixed(5)}</div>
              </div>
              <button className="btn-secondary w-full mt-3 text-xs" onClick={() => nav('/gis')}>{L('GIS ম্যাপে দেখুন', 'Open in GIS map')}</button>
            </Card>
          </div>
        )}
        {tab === 'committee' && (
          <div className="grid lg:grid-cols-2 gap-4">
            <Card padded={false}><div className="p-5 pb-2"><CardHeader title={L('পরিচালনা কমিটি', 'Managing committee')} subtitle={L('মেয়াদ: ২০২৫ – ২০২৭', 'Term: 2025 – 2027')} /></div>
              <Table columns={[{ key: 'role', header: L('পদবি', 'Role'), render: (r: typeof committee[0]) => <span className="bn">{r.role}</span> }, { key: 'name', header: t('name'), render: (r: typeof committee[0]) => <span className="bn font-medium">{r.name}</span> }, { key: 'mobile', header: t('mobile'), render: (r: typeof committee[0]) => <span className="tabular-nums">{r.mobile}</span> }]} rows={committee.map((c, i) => ({ ...c, id: i }))} />
            </Card>
            <Card padded={false}><div className="p-5 pb-2"><CardHeader title={L('ধর্মীয় জনবল ও কর্মচারী', 'Religious personnel & staff')} /></div>
              {staff.length ? <Table columns={[{ key: 'id', header: 'ID', render: (r) => <span className="mono-id">{r.id}</span> }, { key: 'name', header: t('name'), render: (r) => <span className="bn">{r.name}</span> }, { key: 'role', header: L('পদ', 'Role') }, { key: 'q', header: L('যোগ্যতা', 'Qualification'), render: (r) => <span className="bn">{r.qualification}</span> }, { key: 'st', header: t('status'), render: (r) => <Badge>{r.status}</Badge> }]} rows={staff} /> : <EmptyState text={L('এই প্রতিষ্ঠানের জনবল তথ্য এখনো যুক্ত হয়নি', 'No personnel linked yet')} />}
            </Card>
          </div>
        )}
        {tab === 'infra' && (
          <div className="grid lg:grid-cols-3 gap-4">
            <Card><CardHeader title={L('জমির তথ্য', 'Land information')} />
              <KV k={L('পরিমাণ', 'Area')} v={`${fmtNum(inst.landDecimal, lang)} ${L('শতাংশ', 'decimal')}`} /><KV k={L('দাগ নং', 'Dag no.')} v="1247" mono /><KV k={L('খতিয়ান', 'Khatian')} v="RS-882" mono /><KV k={L('মালিকানা', 'Ownership')} v={L('ওয়াক্‌ফ / দানকৃত', 'Waqf / donated')} /><KV k={L('বিরোধ', 'Dispute')} v={<Badge tone="emerald">{L('নেই', 'None')}</Badge>} />
            </Card>
            <Card><CardHeader title={L('ভবনের তথ্য', 'Building information')} />
              <KV k={L('ধরন', 'Type')} v={inst.building} /><KV k={L('তলা', 'Floors')} v={fmtNum(2, lang)} /><KV k={L('নির্মাণ বছর', 'Built')} v={fmtNum(inst.established + 5, lang).replace(/[,،]/g, '')} /><KV k={L('অজুখানা / শৌচাগার', 'Ablution / toilet')} v={L('আছে', 'Yes')} /><KV k={L('অগ্নি নিরাপত্তা', 'Fire safety')} v={<Badge tone="amber">{L('আংশিক', 'Partial')}</Badge>} />
            </Card>
            <Card><CardHeader title={L('ইউটিলিটি', 'Utilities')} />
              {[[Zap, L('বিদ্যুৎ', 'Electricity'), L('সংযুক্ত · মিটার ৪৪১২০০৩', 'Connected · meter 4412003')], [Droplets, L('পানি', 'Water'), L('গভীর নলকূপ', 'Deep tube well')], [Building2, L('গ্যাস', 'Gas'), L('নেই', 'None')], [Landmark, L('সৌর বিদ্যুৎ', 'Solar'), L('২ কিলোওয়াট (অনুদান ২০২৪)', '2 kW (grant 2024)')]].map(([I, k, v], i) => {
                const Icon = I as typeof Zap
                return <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"><span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 grid place-items-center"><Icon size={15} /></span><div><div className="text-sm font-medium bn">{k as string}</div><div className="text-xs text-slate-500 bn">{v as string}</div></div></div>
              })}
            </Card>
          </div>
        )}
        {tab === 'grants' && <Card padded={false}><Table columns={gCols} rows={myGrants} emptyText={L('এই প্রতিষ্ঠান এখনো কোনো অনুদানের আবেদন করেনি', 'No grant applications from this institution')} /></Card>}
        {tab === 'inspections' && <Card padded={false}><Table columns={iCols} rows={myInsp} emptyText={L('কোনো পরিদর্শন রেকর্ড নেই', 'No inspection records')} /></Card>}
        {tab === 'complaints' && <Card><EmptyState text={L('এই প্রতিষ্ঠানের বিরুদ্ধে কোনো অভিযোগ নেই', 'No complaints against this institution')} /></Card>}
        {tab === 'docs' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[[L('নিবন্ধন সনদ', 'Registration certificate'), 'PDF · 240 KB', FileText], [L('জমির দলিল', 'Land deed'), 'PDF · 1.8 MB', FileText], [L('কমিটি রেজুলেশন ২০২৫', 'Committee resolution 2025'), 'PDF · 410 KB', FileText], [L('সম্মুখভাগের ছবি', 'Front photo'), 'JPG · 2.1 MB', Camera], [L('অভ্যন্তরীণ ছবি', 'Interior photo'), 'JPG · 1.6 MB', Camera], [L('UC – অনুদান ২০২৪', 'UC – grant 2024'), 'PDF · 190 KB', FileText]].map(([n, m, I], i) => {
              const Icon = I as typeof FileText
              return <div key={i} className="card p-4 flex items-center gap-3 hover:shadow-pop hover:border-brand-300 transition cursor-pointer"><span className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 grid place-items-center"><Icon size={18} /></span><div className="min-w-0"><div className="text-sm font-medium truncate bn">{n as string}</div><div className="text-xs text-slate-500">{m as string}</div></div></div>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
