import { useMemo, useState } from 'react'
import { Users, Wallet, Stethoscope, GraduationCap, Plane, Building, Star, AlertCircle, Search, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useLang, fmtNum, fmtMoney } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Tabs, Progress, Stepper, chartTooltipStyle, CHART, type Column } from '../components/ui'
import { pilgrims, agencies, hajjSummary, hajjPipeline, type Pilgrim, type Agency } from '../data/mock'

export default function Hajj() {
  const { t, L, lang } = useLang()
  const [tab, setTab] = useState<'pilgrims' | 'agencies' | 'packages'>('pilgrims')
  const [q, setQ] = useState('')
  const [pkg, setPkg] = useState('all')
  const [pay, setPay] = useState('all')
  const [sel, setSel] = useState<Pilgrim | null>(null)
  const [agn, setAgn] = useState<Agency | null>(null)

  const rows = useMemo(() => pilgrims.filter((p) => (pkg === 'all' || p.pkg === pkg) && (pay === 'all' || p.payment === pay) && (q === '' || p.name.includes(q) || p.id.toLowerCase().includes(q.toLowerCase()) || p.nid.includes(q))), [q, pkg, pay])

  const pCols: Column<Pilgrim>[] = [
    { key: 'id', header: 'Pilgrim ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: t('name'), render: (r) => <div><div className="font-medium text-slate-800 bn">{r.name}</div><div className="text-xs text-slate-500">NID {r.nid.slice(0, 4)}•••• · {fmtNum(r.age, lang)} {L('বছর', 'y')} · {r.gender === 'F' ? L('মহিলা', 'F') : L('পুরুষ', 'M')}</div></div> },
    { key: 'district', header: t('district'), render: (r) => <span className="bn">{r.district}</span> },
    { key: 'pkg', header: L('প্যাকেজ', 'Package'), render: (r) => <span className="text-xs font-semibold">{r.pkg}</span> },
    { key: 'agency', header: L('এজেন্সি', 'Agency'), render: (r) => r.agency ? <span className="bn text-xs">{r.agency.name}</span> : <Badge tone="brand">{L('সরকারি', 'Govt')}</Badge> },
    { key: 'payment', header: L('পেমেন্ট', 'Payment'), render: (r) => <div className="w-28"><div className="flex justify-between text-[11px] mb-1"><span className="tabular-nums">{fmtMoney(r.paid, lang, true)}</span><Badge>{r.payment}</Badge></div><Progress value={(r.paid / r.total) * 100} /></div> },
    { key: 'medical', header: L('মেডিকেল', 'Medical'), render: (r) => <Badge tone={r.medical === 'Fit' ? 'emerald' : r.medical === 'Review' ? 'amber' : 'slate'}>{r.medical}</Badge> },
    { key: 'training', header: L('প্রশিক্ষণ', 'Training'), render: (r) => <Badge tone={r.training === 'Completed' ? 'emerald' : r.training === 'Scheduled' ? 'amber' : 'slate'}>{r.training}</Badge> },
    { key: 'flight', header: L('ফ্লাইট', 'Flight'), render: (r) => r.flight ? <span className="font-mono text-xs">{r.flight}</span> : <span className="text-slate-300">—</span> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  const aCols: Column<Agency>[] = [
    { key: 'id', header: 'Agency ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: t('name'), render: (r) => <div><div className="font-medium bn">{r.name}</div><div className="text-xs text-slate-500">{L('লাইসেন্স', 'Licence')} {r.licence}</div></div> },
    { key: 'quota', header: L('কোটা', 'Quota'), align: 'right', render: (r) => fmtNum(r.quota, lang) },
    { key: 'reg', header: L('নিবন্ধিত', 'Registered'), render: (r) => <div className="w-28"><div className="flex justify-between text-[11px] mb-1"><span className="tabular-nums">{fmtNum(r.registered, lang)}</span><span className="text-slate-400">{Math.round((r.registered / r.quota) * 100)}%</span></div><Progress value={(r.registered / r.quota) * 100} target={70} /></div> },
    { key: 'rating', header: L('রেটিং', 'Rating'), render: (r) => <span className="inline-flex items-center gap-1 text-amber-600 font-semibold tabular-nums"><Star size={12} fill="currentColor" /> {r.rating}</span> },
    { key: 'complaints', header: L('অভিযোগ', 'Complaints'), align: 'right', render: (r) => <span className={`tabular-nums font-semibold ${r.complaints > 8 ? 'text-red-600' : 'text-slate-700'}`}>{fmtNum(r.complaints, lang)}</span> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  const packages = [
    { name: L('সরকারি ব্যবস্থাপনা', 'Government package'), price: 583000, includes: [L('বিমান ভাড়া', 'Airfare'), L('মক্কা-মদিনা আবাসন (≤১.৫ কিমি)', 'Makkah-Madinah housing (≤1.5 km)'), L('খাবার ভাতা', 'Food allowance'), L('মোয়াল্লেম ফি', 'Muallim fee'), L('বাস ও ট্রেন', 'Bus & train')], pilgrims: hajjSummary.govt, tone: 0 },
    { name: L('বেসরকারি – সাধারণ', 'Private – Standard (A)'), price: 640000, includes: [L('বিমান ভাড়া', 'Airfare'), L('আবাসন (≤২ কিমি)', 'Housing (≤2 km)'), L('মোয়াল্লেম ফি', 'Muallim fee'), L('পরিবহন', 'Transport')], pilgrims: 52140, tone: 1 },
    { name: L('বেসরকারি – বিশেষ', 'Private – Premium (B)'), price: 745000, includes: [L('বিমান ভাড়া', 'Airfare'), L('আবাসন (≤৮০০ মি)', 'Housing (≤800 m)'), L('তিনবেলা খাবার', 'Full board'), L('VIP তাঁবু', 'VIP tent'), L('পরিবহন', 'Transport')], pilgrims: 26994, tone: 3 },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৬ · হজ ব্যবস্থাপনা প্ল্যাটফর্ম', 'MODULE 06 · HAJJ MANAGEMENT PLATFORM')} title={L('হজ ২০২৬ (১৪৪৭ হিজরি) — হজযাত্রী, এজেন্সি ও প্যাকেজ', 'Hajj 2026 (1447 AH) — Pilgrims, Agencies & Packages')}
        subtitle={L('নিবন্ধন, পেমেন্ট, মেডিকেল, প্রশিক্ষণ ও ফ্লাইট — প্রতিটি হজযাত্রীর সম্পূর্ণ জার্নি এক জায়গায়', 'Registration, payment, medical, training and flight — every pilgrim journey in one record')}
        actions={<button className="btn-secondary"><Download size={15} /> {t('export')}</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-5">
        <StatTile label={L('সৌদি কোটা', 'Saudi quota')} value={hajjSummary.quota} icon={Users} tone="slate" />
        <StatTile label={L('নিবন্ধিত হজযাত্রী', 'Registered pilgrims')} value={hajjSummary.registered} icon={Users} hint={`${Math.round((hajjSummary.registered / hajjSummary.quota) * 100)}% ${L('কোটা', 'of quota')}`} />
        <StatTile label={L('সম্পূর্ণ পেমেন্ট', 'Fully paid')} value={hajjSummary.paidFull} icon={Wallet} tone="emerald" />
        <StatTile label={L('মেডিকেল ক্লিয়ার', 'Medical cleared')} value={hajjSummary.medicalCleared} icon={Stethoscope} tone="sky" />
        <StatTile label={L('প্রশিক্ষিত', 'Trained')} value={hajjSummary.trained} icon={GraduationCap} tone="violet" />
        <StatTile label={L('গমন করেছেন', 'Departed')} value={hajjSummary.departed} icon={Plane} tone="brand" />
        <StatTile label={L('সক্রিয় এজেন্সি', 'Active agencies')} value={agencies.filter((a) => a.status === 'Active').length} icon={Building} tone="amber" hint={`${agencies.filter((a) => a.status !== 'Active').length} ${L('পর্যালোচনায়', 'under review')}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader title={L('হজযাত্রী পাইপলাইন', 'Pilgrim pipeline')} subtitle={L('প্রাক-নিবন্ধন থেকে গমন — ধাপভিত্তিক সংখ্যা', 'Stage-wise counts from pre-registration to departure')} />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={hajjPipeline.map((s) => ({ ...s, name: L(s.bn, s.stage) }))} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid stroke="#eef2f7" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} formatter={(v: number) => fmtNum(v, lang)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>{hajjPipeline.map((_, i) => <Cell key={i} fill={i < 3 ? '#2f62d9' : i < 5 ? '#4f83e6' : '#7ea6f0'} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={L('সতর্কতা', 'Alerts')} />
          <ul className="space-y-2 text-sm">
            {[
              [L(`${fmtNum(pilgrims.filter((p) => p.payment === 'Due').length, 'bn')} জন হজযাত্রীর পেমেন্ট বকেয়া (নমুনা)`, `${pilgrims.filter((p) => p.payment === 'Due').length} pilgrims with payment due (sample)`), 'red'],
              [L(`${fmtNum(pilgrims.filter((p) => p.medical === 'Pending').length, 'bn')} জনের মেডিকেল পরীক্ষা বাকি`, `${pilgrims.filter((p) => p.medical === 'Pending').length} medical checks pending`), 'amber'],
              [L(`${fmtNum(agencies.filter((a) => a.status !== 'Active').length, 'bn')} এজেন্সি পর্যালোচনা/স্থগিত`, `${agencies.filter((a) => a.status !== 'Active').length} agencies under review / suspended`), 'amber'],
              [L('ভিসা ইস্যু হার ৩৭% — লক্ষ্য ৪৫%', 'Visa issuance 37% — target 45%'), 'brand'],
            ].map(([txt, tone], i) => <li key={i} className="flex items-start gap-2"><AlertCircle size={15} className={`mt-0.5 shrink-0 ${tone === 'red' ? 'text-red-500' : tone === 'amber' ? 'text-amber-500' : 'text-brand-500'}`} /><span className="bn text-slate-700">{txt}</span></li>)}
          </ul>
        </Card>
      </div>

      <div className="mb-4"><Tabs value={tab} onChange={setTab} tabs={[{ key: 'pilgrims', label: L('হজযাত্রী ডাটাবেস', 'Pilgrim database'), count: pilgrims.length }, { key: 'agencies', label: L('এজেন্সি ব্যবস্থাপনা', 'Agency management'), count: agencies.length }, { key: 'packages', label: L('প্যাকেজ', 'Packages'), count: 3 }]} /></div>

      {tab === 'pilgrims' && (
        <Card padded={false}>
          <Toolbar>
            <div className="flex items-center gap-2 input !w-72 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('নাম, Pilgrim ID বা NID', 'Name, Pilgrim ID or NID')} value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <Select value={pkg} onChange={setPkg} options={[{ value: 'all', label: L('সকল প্যাকেজ', 'All packages') }, { value: 'Government', label: 'Government' }, { value: 'Private A', label: 'Private A' }, { value: 'Private B', label: 'Private B' }]} />
            <Select value={pay} onChange={setPay} options={[{ value: 'all', label: L('সকল পেমেন্ট', 'All payments') }, { value: 'Paid', label: 'Paid' }, { value: 'Partial', label: 'Partial' }, { value: 'Due', label: 'Due' }]} />
            <span className="ml-auto text-xs text-slate-500">{fmtNum(rows.length, lang)} {L('রেকর্ড', 'records')}</span>
          </Toolbar>
          <Table columns={pCols} rows={rows} onRowClick={setSel} />
        </Card>
      )}
      {tab === 'agencies' && <Card padded={false}><Table columns={aCols} rows={agencies} onRowClick={setAgn} /></Card>}
      {tab === 'packages' && (
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((p, i) => (
            <div key={i} className="card p-5 hover:shadow-pop hover:border-brand-300 transition">
              <div className="flex items-center justify-between"><h3 className="font-semibold bn">{p.name}</h3><span className="w-3 h-3 rounded-full" style={{ background: CHART[p.tone] }} /></div>
              <div className="text-2xl font-bold tabular-nums mt-2">{fmtMoney(p.price, lang)}</div>
              <div className="text-xs text-slate-500 bn">{fmtNum(p.pilgrims, lang)} {L('জন হজযাত্রী', 'pilgrims')}</div>
              <ul className="mt-4 space-y-1.5 text-sm">{p.includes.map((x) => <li key={x} className="flex items-center gap-2 bn"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{x}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!sel} onClose={() => setSel(null)} wide title={<span>{L('হজযাত্রী প্রোফাইল', 'Pilgrim profile')} · <span className="mono-id text-sm">{sel?.id}</span></span>} footer={<button className="btn-secondary" onClick={() => setSel(null)}>{t('close')}</button>}>
        {sel && (<div>
          <div className="mb-5"><Stepper steps={[L('নিবন্ধন', 'Registered'), L('পেমেন্ট', 'Payment'), L('মেডিকেল', 'Medical'), L('প্রশিক্ষণ', 'Training'), L('ফ্লাইট', 'Flight'), L('সৌদিতে', 'In KSA')]} current={sel.status === 'In Saudi Arabia' ? 5 : sel.flight ? 4 : sel.training === 'Completed' ? 3 : sel.medical === 'Fit' ? 2 : sel.payment === 'Paid' ? 1 : 0} /></div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div><CardHeader title={L('ব্যক্তিগত তথ্য', 'Personal')} /><KV k={t('name')} v={<span className="bn">{sel.name}</span>} /><KV k="NID" v={sel.nid} mono /><KV k={L('বয়স / লিঙ্গ', 'Age / gender')} v={`${fmtNum(sel.age, lang)} / ${sel.gender}`} /><KV k={t('district')} v={<span className="bn">{sel.district}</span>} />{sel.mahram && <KV k={L('মাহরাম', 'Mahram')} v={<span className="bn">{sel.mahram}</span>} />}<KV k={L('প্যাকেজ', 'Package')} v={sel.pkg} /><KV k={L('এজেন্সি', 'Agency')} v={sel.agency ? <span className="bn">{sel.agency.name}</span> : L('সরকারি ব্যবস্থাপনা', 'Government')} /></div>
            <div><CardHeader title={L('সেবা অবস্থা', 'Service status')} /><KV k={L('মোট প্যাকেজ মূল্য', 'Package total')} v={fmtMoney(sel.total, lang)} /><KV k={L('পরিশোধিত', 'Paid')} v={<span className={sel.payment === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>{fmtMoney(sel.paid, lang)}</span>} /><KV k={L('বকেয়া', 'Outstanding')} v={fmtMoney(sel.total - sel.paid, lang)} /><KV k={L('মেডিকেল', 'Medical')} v={<Badge tone={sel.medical === 'Fit' ? 'emerald' : 'amber'}>{sel.medical}</Badge>} /><KV k={L('প্রশিক্ষণ', 'Training')} v={<Badge>{sel.training}</Badge>} /><KV k={L('ফ্লাইট', 'Flight')} v={sel.flight ?? '—'} mono /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} /></div>
          </div>
        </div>)}
      </Modal>
      <Modal open={!!agn} onClose={() => setAgn(null)} title={<span>{L('এজেন্সি প্রোফাইল', 'Agency profile')} · <span className="mono-id text-sm">{agn?.id}</span></span>} footer={<><button className="btn-danger">{L('স্থগিত করুন', 'Suspend')}</button><button className="btn-secondary" onClick={() => setAgn(null)}>{t('close')}</button></>}>
        {agn && (<div><KV k={t('name')} v={<span className="bn">{agn.name}</span>} /><KV k={L('লাইসেন্স', 'Licence')} v={agn.licence} mono /><KV k={L('কোটা', 'Quota')} v={fmtNum(agn.quota, lang)} /><KV k={L('নিবন্ধিত হজযাত্রী', 'Registered pilgrims')} v={fmtNum(agn.registered, lang)} /><KV k={L('অভিযোগ (২০২৬)', 'Complaints (2026)')} v={fmtNum(agn.complaints, lang)} /><KV k={L('রেটিং', 'Rating')} v={`★ ${agn.rating}`} /><KV k={t('status')} v={<Badge>{agn.status}</Badge>} /></div>)}
      </Modal>
    </div>
  )
}
