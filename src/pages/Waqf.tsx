import { useMemo, useState } from 'react'
import { Landmark, FileWarning, ScanLine, Plus, Search, MapPin, FileText, Image } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useLang, fmtNum, fmtMoney } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Progress, CHART, chartTooltipStyle, type Column } from '../components/ui'
import { waqfProperties, waqfSummary, divisions, leases, type WaqfProperty } from '../data/mock'

const kindBn: Record<string, string> = { Land: 'জমি', 'Commercial Building': 'বাণিজ্যিক ভবন', Residential: 'আবাসিক', 'Shop Complex': 'মার্কেট', Agricultural: 'কৃষি জমি', Pond: 'পুকুর' }
const legalBn: Record<string, string> = { Clear: 'নিষ্কণ্টক', Disputed: 'বিরোধপূর্ণ', 'Under Litigation': 'মামলাধীন', Encroached: 'বেদখল' }

export default function Waqf() {
  const { t, L, lang } = useLang()
  const [q, setQ] = useState('')
  const [div, setDiv] = useState('all')
  const [legal, setLegal] = useState('all')
  const [sel, setSel] = useState<WaqfProperty | null>(null)
  const [showNew, setShowNew] = useState(false)
  const rows = useMemo(() => waqfProperties.filter((w) => (div === 'all' || w.divisionId === div) && (legal === 'all' || w.legalStatus === legal) && (q === '' || w.id.toLowerCase().includes(q.toLowerCase()) || w.nameBn.includes(q) || w.waqifName.includes(q))), [q, div, legal])
  const byKind = Object.keys(kindBn).map((k) => ({ name: L(kindBn[k], k), value: waqfProperties.filter((w) => w.kind === k).length }))
  const legalTone = (s: string): 'emerald' | 'amber' | 'red' => (s === 'Clear' ? 'emerald' : s === 'Disputed' ? 'amber' : 'red')

  const cols: Column<WaqfProperty>[] = [
    { key: 'id', header: 'Waqf ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: L('সম্পত্তি', 'Property'), render: (r) => <div><div className="font-medium bn">{L(r.nameBn, r.nameEn)}</div><div className="text-xs text-slate-500 bn">{L('ওয়াকিফ', 'Waqif')}: {r.waqifName}</div></div> },
    { key: 'kind', header: t('type'), render: (r) => <span className="bn text-xs font-semibold">{L(kindBn[r.kind], r.kind)}</span> },
    { key: 'land', header: L('জমি (শতাংশ)', 'Land (dec.)'), align: 'right', render: (r) => fmtNum(r.landDecimal, lang) },
    { key: 'deed', header: L('দলিল নং', 'Deed no.'), render: (r) => <span className="font-mono text-xs">{r.deedNo}</span> },
    { key: 'use', header: L('বর্তমান ব্যবহার', 'Current use'), render: (r) => <span className="bn text-xs">{r.currentUse}</span> },
    { key: 'value', header: L('প্রাক্কলিত মূল্য', 'Est. value'), align: 'right', render: (r) => fmtMoney(r.estValue, lang, true) },
    { key: 'lease', header: L('ইজারা', 'Lease'), render: (r) => r.leased ? <Badge tone="violet">{L('ইজারাভুক্ত', 'Leased')}</Badge> : <Badge tone="slate">{L('নেই', 'None')}</Badge> },
    { key: 'legal', header: L('আইনি অবস্থা', 'Legal status'), render: (r) => <Badge tone={legalTone(r.legalStatus)}>{L(legalBn[r.legalStatus], r.legalStatus)}</Badge> },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৯ · ওয়াক্‌ফ সম্পত্তি ব্যবস্থাপনা', 'MODULE 09 · WAQF PROPERTY MANAGEMENT')} title={L('ডিজিটাল ওয়াক্‌ফ অ্যাসেট রেজিস্ট্রি', 'Digital Waqf Asset Registry')}
        subtitle={L('প্রতিটি ওয়াক্‌ফ সম্পত্তির Waqf ID, GPS, দলিল, বর্তমান ব্যবহার, ইজারাদার, রাজস্ব ও আইনি অবস্থা — এক ডাটাবেসে', 'Waqf ID, GPS, deed, current use, lessee, revenue and legal status for every waqf property — in one database')}
        actions={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> {L('সম্পত্তি ডিজিটাইজ', 'Digitise property')}</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('নিবন্ধিত ওয়াক্‌ফ এস্টেট (জাতীয়)', 'Registered waqf estates (national)')} value={waqfSummary.totalRegistered} icon={Landmark} tone="violet" />
        <StatTile label={L('ডিজিটাইজড', 'Digitised')} value={waqfSummary.digitised} icon={ScanLine} tone="emerald" hint={`${Math.round((waqfSummary.digitised / waqfSummary.totalRegistered) * 100)}%`} />
        <StatTile label={L('বিরোধপূর্ণ / মামলাধীন / বেদখল', 'Disputed / litigated / encroached')} value={waqfSummary.disputed} icon={FileWarning} tone="red" />
        <StatTile label={L('প্রাক্কলিত সম্পদ মূল্য (নমুনা)', 'Est. asset value (sample)')} value={fmtMoney(waqfProperties.reduce((a, w) => a + w.estValue, 0), lang, true)} icon={Landmark} tone="brand" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card>
          <CardHeader title={L('সম্পত্তির ধরন', 'Property type')} />
          <div className="h-40"><ResponsiveContainer><PieChart><Pie data={byKind} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={2} stroke="#fff">{byKind.map((_, i) => <Cell key={i} fill={CHART[i]} />)}</Pie><Tooltip contentStyle={chartTooltipStyle} /></PieChart></ResponsiveContainer></div>
          <ul className="space-y-1 mt-1">{byKind.map((k, i) => <li key={k.name} className="flex items-center gap-2 text-xs"><span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART[i] }} /><span className="bn flex-1 text-slate-600">{k.name}</span><span className="font-semibold tabular-nums">{fmtNum(k.value, lang)}</span></li>)}</ul>
        </Card>
        <Card>
          <CardHeader title={L('ডিজিটাইজেশন অগ্রগতি (বিভাগ)', 'Digitisation progress (division)')} />
          <div className="space-y-2.5">{divisions.map((d, i) => { const p = 45 + ((i * 17) % 50); return <div key={d.id}><div className="flex justify-between text-xs mb-1"><span className="bn">{L(d.bn, d.en)}</span><span className="tabular-nums font-semibold">{fmtNum(p, lang)}%</span></div><Progress value={p} target={70} /></div> })}</div>
        </Card>
        <Card>
          <CardHeader title={L('আইনি অবস্থা', 'Legal status')} />
          <div className="grid grid-cols-2 gap-2">{Object.keys(legalBn).map((k) => { const n = waqfProperties.filter((w) => w.legalStatus === k).length; return <button key={k} onClick={() => setLegal(legal === k ? 'all' : k)} className={`rounded-md border p-3 text-left transition ${legal === k ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}><Badge tone={legalTone(k)}>{L(legalBn[k], k)}</Badge><div className="text-xl font-bold tabular-nums mt-1">{fmtNum(n, lang)}</div></button> })}</div>
        </Card>
      </div>

      <Card padded={false}>
        <Toolbar>
          <div className="flex items-center gap-2 input !w-64 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('Waqf ID, নাম বা ওয়াকিফ', 'Waqf ID, name or waqif')} value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Select value={div} onChange={setDiv} options={[{ value: 'all', label: `${t('all')} ${t('division')}` }, ...divisions.map((d) => ({ value: d.id, label: L(d.bn, d.en) }))]} />
          <span className="ml-auto text-xs text-slate-500">{fmtNum(rows.length, lang)} {L('সম্পত্তি', 'properties')}</span>
        </Toolbar>
        <Table columns={cols} rows={rows} onRowClick={setSel} />
      </Card>

      <Modal open={!!sel} onClose={() => setSel(null)} wide title={<span>{L('ওয়াক্‌ফ সম্পত্তি', 'Waqf property')} · <span className="mono-id text-sm">{sel?.id}</span></span>} footer={<button className="btn-secondary" onClick={() => setSel(null)}>{t('close')}</button>}>
        {sel && (<div className="grid sm:grid-cols-2 gap-6">
          <div><CardHeader title={L('সম্পত্তি তথ্য', 'Property information')} /><KV k={t('name')} v={<span className="bn">{L(sel.nameBn, sel.nameEn)}</span>} /><KV k={t('type')} v={L(kindBn[sel.kind], sel.kind)} /><KV k={L('ওয়াকিফ', 'Waqif')} v={<span className="bn">{sel.waqifName}</span>} /><KV k={L('দলিল নং / সাল', 'Deed no. / year')} v={sel.deedNo} mono /><KV k={L('জমি', 'Land')} v={`${fmtNum(sel.landDecimal, lang)} ${L('শতাংশ', 'decimal')}`} /><KV k={t('district')} v={L(sel.district.bn, sel.district.en)} /><KV k="GPS" v={<span className="flex items-center gap-1"><MapPin size={12} />{sel.lat.toFixed(5)}, {sel.lon.toFixed(5)}</span>} mono /></div>
          <div><CardHeader title={L('ব্যবহার, রাজস্ব ও আইনি', 'Use, revenue & legal')} /><KV k={L('বর্তমান ব্যবহার', 'Current use')} v={<span className="bn">{sel.currentUse}</span>} /><KV k={L('প্রাক্কলিত মূল্য', 'Est. value')} v={fmtMoney(sel.estValue, lang)} /><KV k={L('ইজারা', 'Lease')} v={sel.leased ? (() => { const l = leases.find((x) => x.property.id === sel.id); return l ? <span>{l.id} · <span className="bn">{l.tenant}</span></span> : '—' })() : L('ইজারাভুক্ত নয়', 'Not leased')} /><KV k={L('আইনি অবস্থা', 'Legal status')} v={<Badge tone={legalTone(sel.legalStatus)}>{L(legalBn[sel.legalStatus], sel.legalStatus)}</Badge>} />
            <div className="mt-4 label bn">{L('নথি ও ছবি', 'Documents & photos')}</div>
            <div className="grid grid-cols-2 gap-2">{[[FileText, L('ওয়াক্‌ফ দলিল', 'Waqf deed')], [FileText, L('খতিয়ান / নামজারি', 'Khatian / mutation')], [Image, L('সম্পত্তির ছবি', 'Property photo')], [FileText, L('ইজারা চুক্তি', 'Lease agreement')]].map(([I, k], i) => { const Icon = I as typeof FileText; return <div key={i} className="flex items-center gap-2 text-xs rounded-lg border border-slate-200 p-2 hover:border-brand-300 cursor-pointer"><Icon size={13} className="text-slate-500" /><span className="bn truncate">{k as string}</span></div> })}</div>
          </div>
        </div>)}
      </Modal>
      <Modal open={showNew} onClose={() => setShowNew(false)} title={L('নতুন ওয়াক্‌ফ সম্পত্তি ডিজিটাইজেশন', 'Digitise a waqf property')} footer={<><button className="btn-secondary" onClick={() => setShowNew(false)}>{t('cancel')}</button><button className="btn-primary" onClick={() => setShowNew(false)}>{t('save')}</button></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label bn">{L('এস্টেট / সম্পত্তির নাম', 'Estate / property name')}</label><input className="input bn" /></div>
          <div><label className="label">{t('type')}</label><select className="input bn">{Object.keys(kindBn).map((k) => <option key={k}>{L(kindBn[k], k)}</option>)}</select></div>
          <div><label className="label bn">{L('ওয়াকিফের নাম', 'Waqif name')}</label><input className="input bn" /></div>
          <div><label className="label bn">{L('দলিল নং / সাল', 'Deed no. / year')}</label><input className="input font-mono" placeholder="1234/1985" /></div>
          <div><label className="label bn">{L('জমির পরিমাণ (শতাংশ)', 'Land (decimal)')}</label><input className="input" type="number" /></div>
          <div><label className="label">GPS</label><input className="input font-mono" placeholder="23.7801, 90.4123" /></div>
          <div className="sm:col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-5 text-center text-sm text-slate-500 bn">{L('দলিল স্ক্যান আপলোড করুন — OCR স্বয়ংক্রিয়ভাবে দাগ/খতিয়ান পড়বে (Phase 3)', 'Upload deed scan — OCR reads dag/khatian automatically (Phase 3)')}</div>
        </div>
      </Modal>
    </div>
  )
}
