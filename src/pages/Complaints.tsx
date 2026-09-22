import { useMemo, useState } from 'react'
import { Headset, AlertTriangle, CheckCircle2, Timer, Plus, Search } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useLang, fmtNum, fmtDate } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Stepper, chartTooltipStyle, type Column } from '../components/ui'
import { complaints, complaintCategories, complaintTrend, type Complaint } from '../data/mock'

const catBn: Record<string, string> = { Accommodation: 'আবাসন', Transportation: 'পরিবহন', Food: 'খাবার', Agency: 'এজেন্সি', Flight: 'ফ্লাইট', 'Lost documents': 'হারানো নথি', Medical: 'মেডিকেল', Other: 'অন্যান্য' }

export default function Complaints() {
  const { t, L, lang } = useLang()
  const [cat, setCat] = useState('all')
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Complaint | null>(null)
  const [showNew, setShowNew] = useState(false)
  const rows = useMemo(() => complaints.filter((c) => (cat === 'all' || c.category === cat) && (status === 'all' || c.status === status) && (q === '' || c.id.toLowerCase().includes(q.toLowerCase()) || c.pilgrim.includes(q))), [cat, status, q])
  const open = complaints.filter((c) => !['Resolved', 'Closed'].includes(c.status))
  const breached = open.filter((c) => c.ageHours > c.slaHours)
  const stageIdx = (s: Complaint['status']) => ({ Open: 0, Assigned: 1, 'In Progress': 2, Escalated: 2, Resolved: 3, Closed: 4 }[s])

  const cols: Column<Complaint>[] = [
    { key: 'id', header: 'Ticket', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'cat', header: L('ক্যাটাগরি', 'Category'), render: (r) => <span className="bn font-medium">{L(catBn[r.category], r.category)}</span> },
    { key: 'summary', header: L('সারসংক্ষেপ', 'Summary'), render: (r) => <div className="max-w-[280px]"><div className="bn truncate">{r.summary}</div><div className="text-xs text-slate-500 bn">{r.pilgrim}{r.agency ? ` · ${r.agency}` : ''}</div></div> },
    { key: 'channel', header: L('মাধ্যম', 'Channel'), render: (r) => <span className="text-xs">{r.channel}</span> },
    { key: 'priority', header: L('অগ্রাধিকার', 'Priority'), render: (r) => <Badge tone={r.priority === 'High' ? 'red' : r.priority === 'Medium' ? 'amber' : 'slate'}>{r.priority}</Badge> },
    { key: 'assigned', header: L('দায়িত্বপ্রাপ্ত', 'Assigned to'), render: (r) => <span className="bn text-xs">{r.assignedTo}</span> },
    { key: 'sla', header: 'SLA', render: (r) => { const br = r.ageHours > r.slaHours && !['Resolved', 'Closed'].includes(r.status); return <span className={`text-xs tabular-nums font-semibold ${br ? 'text-red-600' : 'text-slate-600'}`}>{fmtNum(r.ageHours, lang)}h / {fmtNum(r.slaHours, lang)}h{br && ' ⚠'}</span> } },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৮ · হজ অভিযোগ ও সহায়তা কেন্দ্র', 'MODULE 08 · HAJJ COMPLAINT & SUPPORT CENTRE')} title={t('complaints')}
        subtitle={L('টিকেট → দায়িত্বপ্রাপ্ত কর্মকর্তা → ব্যবস্থা → সমাধান → ক্লোজার — অ্যাপ, হটলাইন ১৬১৩৬, ওয়েব ও সরাসরি', 'Ticket → Assigned Officer → Action → Resolution → Closure — via app, hotline 16136, web and walk-in')}
        actions={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> {L('নতুন টিকেট', 'New ticket')}</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('মোট টিকেট (হজ ২০২৬)', 'Total tickets (Hajj 2026)')} value={complaints.length} icon={Headset} />
        <StatTile label={L('খোলা / চলমান', 'Open / in progress')} value={open.length} icon={Timer} tone="amber" />
        <StatTile label={L('SLA অতিক্রান্ত', 'SLA breached')} value={breached.length} icon={AlertTriangle} tone="red" />
        <StatTile label={L('সমাধান হার', 'Resolution rate')} value={`${Math.round((complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length / complaints.length) * 100)}%`} icon={CheckCircle2} tone="emerald" hint={L('গড় সমাধান সময় ১৯ ঘণ্টা', 'Avg resolution 19h')} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader title={L('দৈনিক টিকেট প্রবণতা', 'Daily ticket trend')} subtitle={L('খোলা বনাম সমাধান · মে ২০২৬', 'Opened vs resolved · May 2026')} />
          <div className="h-48">
            <ResponsiveContainer>
              <LineChart data={complaintTrend} margin={{ left: -20, right: 10 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="opened" name={L('খোলা', 'Opened')} stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resolved" name={L('সমাধান', 'Resolved')} stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={L('ক্যাটাগরি অনুযায়ী', 'By category')} />
          <div className="grid grid-cols-2 gap-2">
            {complaintCategories.map((c) => { const n = complaints.filter((x) => x.category === c).length; const sel = cat === c; return <button key={c} onClick={() => setCat(sel ? 'all' : c)} className={`rounded-md border p-2 text-left transition ${sel ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:border-brand-300'}`}><div className="text-[11px] font-semibold bn">{L(catBn[c], c)}</div><div className="text-lg font-bold tabular-nums">{fmtNum(n, lang)}</div></button> })}
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <Toolbar>
          <div className="flex items-center gap-2 input !w-64 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('টিকেট বা হজযাত্রীর নাম', 'Ticket or pilgrim name')} value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Select value={status} onChange={setStatus} options={[{ value: 'all', label: `${t('all')} ${t('status')}` }, ...['Open', 'Assigned', 'In Progress', 'Escalated', 'Resolved', 'Closed'].map((s) => ({ value: s, label: s }))]} />
          {cat !== 'all' && <button className="btn-ghost text-xs" onClick={() => setCat('all')}>✕ {L(catBn[cat], cat)}</button>}
        </Toolbar>
        <Table columns={cols} rows={rows} onRowClick={setSel} />
      </Card>

      <Modal open={!!sel} onClose={() => setSel(null)} title={<span>{L('টিকেট', 'Ticket')} <span className="mono-id text-sm">{sel?.id}</span></span>} footer={<><button className="btn-secondary">{L('পুনঃবরাদ্দ', 'Reassign')}</button><button className="btn-primary" onClick={() => setSel(null)}>{L('সমাধান চিহ্নিত করুন', 'Mark resolved')}</button></>}>
        {sel && (<div>
          <div className="mb-4 overflow-x-auto"><Stepper steps={[L('টিকেট', 'Ticket'), L('বরাদ্দ', 'Assigned'), L('ব্যবস্থা', 'Action'), L('সমাধান', 'Resolved'), L('ক্লোজ', 'Closed')]} current={stageIdx(sel.status)} /></div>
          <p className="text-sm bg-slate-50 rounded-lg p-3 mb-3 bn">{sel.summary}</p>
          <KV k={L('ক্যাটাগরি', 'Category')} v={L(catBn[sel.category], sel.category)} /><KV k={L('হজযাত্রী', 'Pilgrim')} v={<span className="bn">{sel.pilgrim}</span>} /><KV k={L('এজেন্সি', 'Agency')} v={sel.agency ? <span className="bn">{sel.agency}</span> : '—'} /><KV k={L('মাধ্যম', 'Channel')} v={sel.channel} /><KV k={L('অগ্রাধিকার', 'Priority')} v={<Badge tone={sel.priority === 'High' ? 'red' : sel.priority === 'Medium' ? 'amber' : 'slate'}>{sel.priority}</Badge>} /><KV k={L('দায়িত্বপ্রাপ্ত', 'Assigned to')} v={<span className="bn">{sel.assignedTo}</span>} /><KV k={L('খোলার তারিখ', 'Opened')} v={fmtDate(sel.openedOn, lang)} /><KV k="SLA" v={`${fmtNum(sel.ageHours, lang)}h / ${fmtNum(sel.slaHours, lang)}h`} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} />
        </div>)}
      </Modal>
      <Modal open={showNew} onClose={() => setShowNew(false)} title={L('নতুন অভিযোগ টিকেট', 'New complaint ticket')} footer={<><button className="btn-secondary" onClick={() => setShowNew(false)}>{t('cancel')}</button><button className="btn-primary" onClick={() => setShowNew(false)}>{L('টিকেট তৈরি', 'Create ticket')}</button></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Pilgrim ID</label><input className="input font-mono" placeholder="PLG-2026-000001" /></div>
          <div><label className="label bn">{L('ক্যাটাগরি', 'Category')}</label><select className="input bn">{complaintCategories.map((c) => <option key={c}>{L(catBn[c], c)}</option>)}</select></div>
          <div><label className="label bn">{L('অগ্রাধিকার', 'Priority')}</label><select className="input"><option>High</option><option>Medium</option><option>Low</option></select></div>
          <div><label className="label bn">{L('মাধ্যম', 'Channel')}</label><select className="input"><option>Hotline</option><option>App</option><option>Web</option><option>Walk-in</option></select></div>
          <div className="sm:col-span-2"><label className="label bn">{L('বিবরণ', 'Description')}</label><textarea className="input bn" rows={3} /></div>
        </div>
      </Modal>
    </div>
  )
}
