import { useMemo, useState } from 'react'
import { ClipboardCheck, CheckCircle2, CalendarClock, AlertTriangle, MapPin, Camera, Smartphone, Wifi, Battery, ChevronRight, Search } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLang, fmtNum, fmtDate } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Progress, chartTooltipStyle, type Column } from '../components/ui'
import { inspections, divisions, type Inspection } from '../data/mock'

const checklist = ['ভবনের কাঠামোগত অবস্থা', 'অজুখানা / স্যানিটেশন', 'বিদ্যুৎ ও অগ্নি নিরাপত্তা', 'কমিটি বৈধতা ও সভা রেজিস্টার', 'হিসাব খাতা ও ব্যাংক স্টেটমেন্ট', 'পূর্ববর্তী অনুদানের ব্যবহার', 'জনবলের উপস্থিতি ও নিয়োগপত্র', 'সাইনবোর্ড ও Institution ID প্রদর্শন']

export default function Inspections() {
  const { t, L, lang } = useLang()
  const [status, setStatus] = useState('all')
  const [div, setDiv] = useState('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Inspection | null>(null)
  const [appStep, setAppStep] = useState(0)
  const [checks, setChecks] = useState<boolean[]>(checklist.map(() => false))

  const rows = useMemo(() => inspections.filter((i) => (status === 'all' || i.status === status) && (div === 'all' || i.institution.divisionId === div) && (q === '' || i.id.toLowerCase().includes(q.toLowerCase()) || i.institution.nameBn.includes(q) || i.officer.includes(q))), [status, div, q])
  const byDiv = divisions.map((d) => ({ name: L(d.bn, d.en), done: inspections.filter((i) => i.institution.divisionId === d.id && i.status === 'Completed').length, pending: inspections.filter((i) => i.institution.divisionId === d.id && i.status !== 'Completed').length }))
  const issueCount: Record<string, number> = {}
  inspections.forEach((i) => i.issues.forEach((x) => { issueCount[x] = (issueCount[x] || 0) + 1 }))
  const topIssues = Object.entries(issueCount).sort((a, b) => b[1] - a[1]).slice(0, 6)

  const cols: Column<Inspection>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'inst', header: L('প্রতিষ্ঠান', 'Institution'), render: (r) => <div><div className="font-medium text-slate-800 bn truncate max-w-[240px]">{L(r.institution.nameBn, r.institution.nameEn)}</div><div className="text-xs text-slate-500 bn">{L(r.institution.district.bn, r.institution.district.en)}</div></div> },
    { key: 'officer', header: L('কর্মকর্তা', 'Officer'), render: (r) => <span className="bn text-xs">{r.officer}</span> },
    { key: 'date', header: t('date'), render: (r) => fmtDate(r.date, lang) },
    { key: 'score', header: L('স্কোর', 'Score'), render: (r) => r.score ? <div className="w-24"><div className="flex justify-between text-xs mb-1"><span className="tabular-nums font-semibold">{fmtNum(r.score, lang)}</span></div><Progress value={r.score} target={80} /></div> : <span className="text-slate-400">—</span> },
    { key: 'issues', header: L('সমস্যা', 'Issues'), align: 'center', render: (r) => r.issues.length ? <span className="badge bg-amber-50 text-amber-700 tabular-nums">{fmtNum(r.issues.length, lang)}</span> : <span className="text-slate-300">0</span> },
    { key: 'photos', header: <Camera size={13} />, align: 'center', render: (r) => fmtNum(r.photos, lang) },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৪ · প্রতিষ্ঠান পরিদর্শন ব্যবস্থাপনা', 'MODULE 04 · INSTITUTION INSPECTION MANAGEMENT')} title={t('inspections')}
        subtitle={L('Check-in → GPS → প্রতিষ্ঠান → চেকলিস্ট → ছবি → ফাইন্ডিংস → সুপারিশ — মাঠ কর্মকর্তার মোবাইল অ্যাপ থেকে', 'Check-in → GPS → Institution → Checklist → Photo → Findings → Recommendation — from the field officer mobile app')} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('মোট পরিদর্শন (২০২৬)', 'Inspections (2026)')} value={inspections.length} icon={ClipboardCheck} />
        <StatTile label={t('completed')} value={inspections.filter((i) => i.status === 'Completed').length} icon={CheckCircle2} tone="emerald" />
        <StatTile label={L('নির্ধারিত / অপেক্ষমাণ', 'Scheduled / pending')} value={inspections.filter((i) => i.status === 'Scheduled').length} icon={CalendarClock} tone="amber" />
        <StatTile label={L('ফলো-আপ প্রয়োজন / বিলম্বিত', 'Follow-up / overdue')} value={inspections.filter((i) => i.status === 'Follow-up Required' || i.status === 'Overdue').length} icon={AlertTriangle} tone="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader title={L('বিভাগভিত্তিক পরিদর্শন', 'Inspections by division')} subtitle={L('সম্পন্ন বনাম অপেক্ষমাণ', 'Completed vs pending')} />
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={byDiv} margin={{ left: -20, right: 5 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="done" name={t('completed')} stackId="a" fill="#2f62d9" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" name={t('pending')} stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={L('শীর্ষ চিহ্নিত সমস্যা', 'Top identified issues')} subtitle={L('সকল পরিদর্শন', 'All inspections')} />
          <ul className="space-y-2.5">
            {topIssues.map(([k, v]) => (
              <li key={k}><div className="flex justify-between text-xs mb-1"><span className="bn text-slate-700">{k}</span><span className="font-semibold tabular-nums">{fmtNum(v, lang)}</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${(v / topIssues[0][1]) * 100}%` }} /></div></li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card padded={false} className="lg:col-span-2">
          <Toolbar>
            <div className="flex items-center gap-2 input !w-64 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('ID, প্রতিষ্ঠান বা কর্মকর্তা', 'ID, institution or officer')} value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <Select value={div} onChange={setDiv} options={[{ value: 'all', label: `${t('all')} ${t('division')}` }, ...divisions.map((d) => ({ value: d.id, label: L(d.bn, d.en) }))]} />
            <Select value={status} onChange={setStatus} options={[{ value: 'all', label: `${t('all')} ${t('status')}` }, ...['Completed', 'Scheduled', 'Follow-up Required', 'Overdue'].map((s) => ({ value: s, label: s }))]} />
          </Toolbar>
          <Table columns={cols} rows={rows} onRowClick={setSel} />
        </Card>

        {/* Mobile app mock */}
        <div>
          <div className="kicker mb-2 flex items-center gap-1.5"><Smartphone size={12} /> {L('মাঠ কর্মকর্তা মোবাইল অ্যাপ', 'Field officer mobile app')}</div>
          <div className="mx-auto w-[300px] rounded-[36px] bg-[#0a1530] p-2.5 shadow-pop">
            <div className="rounded-[28px] bg-cream overflow-hidden h-[560px] flex flex-col">
              <div className="bg-[#0a1530] text-white px-5 pt-3 pb-3">
                <div className="flex justify-between text-[10px] text-slate-300 mb-2"><span>09:41</span><span className="flex gap-1 items-center"><Wifi size={10} /><Battery size={10} /></span></div>
                <div className="text-xs text-brand-300 font-semibold">NRAMS Field</div>
                <div className="font-bold text-sm bn">{L('পরিদর্শন', 'Inspection')} · {['Check-in', L('চেকলিস্ট', 'Checklist'), L('ছবি ও ফাইন্ডিংস', 'Photos & findings'), L('জমা', 'Submit')][appStep]}</div>
                <div className="flex gap-1 mt-2">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${i <= appStep ? 'bg-brand-400' : 'bg-white/20'}`} />)}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
                {appStep === 0 && (<>
                  <div className="card p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">GPS</div>
                    <div className="flex items-center gap-2 mt-1"><span className="relative w-3 h-3"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" /><span className="absolute inset-0 rounded-full bg-emerald-500" /></span><span className="font-mono text-xs">23.78034, 90.41221</span></div>
                    <div className="text-xs text-slate-500 mt-1 bn">{L('নির্ভুলতা ±৮ মি · প্রতিষ্ঠান থেকে ৪২ মি', 'Accuracy ±8 m · 42 m from institution')}</div>
                  </div>
                  <div className="card p-3">
                    <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 bn">{L('নিকটবর্তী প্রতিষ্ঠান', 'Nearby institution')}</div>
                    <div className="font-semibold text-slate-800 bn mt-1">{L(inspections[3].institution.nameBn, inspections[3].institution.nameEn)}</div>
                    <div className="mono-id">{inspections[3].institution.id}</div>
                  </div>
                  <div className="card p-3 flex items-center justify-between"><span className="bn">{L('নির্ধারিত পরিদর্শন', 'Scheduled visit')}</span><Badge tone="amber">{L('আজ', 'Today')}</Badge></div>
                </>)}
                {appStep === 1 && checklist.map((c, i) => (
                  <label key={c} className={`card p-3 flex items-center gap-3 cursor-pointer ${checks[i] ? 'border-emerald-300 bg-emerald-50/40' : ''}`}>
                    <input type="checkbox" className="rounded" checked={checks[i]} onChange={() => setChecks((a) => a.map((v, j) => (j === i ? !v : v)))} />
                    <span className="text-xs bn flex-1">{c}</span>
                    <select className="text-[10px] border border-slate-200 rounded px-1 py-0.5 bg-white"><option>{L('ভালো', 'Good')}</option><option>{L('মাঝারি', 'Fair')}</option><option>{L('খারাপ', 'Poor')}</option></select>
                  </label>
                ))}
                {appStep === 2 && (<>
                  <div className="grid grid-cols-3 gap-2">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="aspect-square rounded-lg bg-slate-200 grid place-items-center text-slate-400"><Camera size={16} /></div>)}<div className="aspect-square rounded-lg border-2 border-dashed border-brand-300 grid place-items-center text-brand-500 text-xl">+</div></div>
                  <div className="card p-3"><div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 bn">{L('ফাইন্ডিংস', 'Findings')}</div><textarea className="input mt-1 text-xs bn" rows={3} defaultValue="ছাদের পূর্ব পাশে ফাটল দেখা গেছে; অজুখানার ২টি ট্যাপ অকার্যকর।" /></div>
                  <div className="card p-3"><div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400 bn">{L('সুপারিশ', 'Recommendation')}</div><select className="input mt-1 text-xs bn"><option>জরুরি মেরামত অনুদানের সুপারিশ</option><option>ফলো-আপ পরিদর্শন ৩০ দিনে</option><option>কোনো ব্যবস্থা প্রয়োজন নেই</option></select></div>
                </>)}
                {appStep === 3 && (
                  <div className="card p-4 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 grid place-items-center"><CheckCircle2 /></div>
                    <div className="font-semibold mt-2 bn">{L('পরিদর্শন জমা দেওয়ার জন্য প্রস্তুত', 'Ready to submit')}</div>
                    <div className="text-xs text-slate-500 mt-1 bn">{fmtNum(checks.filter(Boolean).length, lang)}/{fmtNum(checklist.length, lang)} {L('চেকলিস্ট আইটেম · ৫ ছবি · GPS যাচাইকৃত', 'checklist items · 5 photos · GPS verified')}</div>
                    <div className="text-xs text-slate-500 mt-2 bn">{L('অফলাইন হলে সংযোগ ফিরলে স্বয়ংক্রিয় সিঙ্ক হবে', 'Auto-syncs when connection is restored if offline')}</div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
                {appStep > 0 && <button className="btn-secondary flex-1 !py-2 text-xs" onClick={() => setAppStep((s) => s - 1)}>{L('পূর্ববর্তী', 'Back')}</button>}
                <button className="btn-primary flex-1 !py-2 text-xs" onClick={() => setAppStep((s) => (s + 1) % 4)}>{appStep === 3 ? t('submit') : [L('Check-in করুন', 'Check in'), L('পরবর্তী', 'Next'), L('পরবর্তী', 'Next')][appStep]} <ChevronRight size={13} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!sel} onClose={() => setSel(null)} title={<span>{L('পরিদর্শন প্রতিবেদন', 'Inspection report')} · <span className="mono-id text-sm">{sel?.id}</span></span>} footer={<button className="btn-secondary" onClick={() => setSel(null)}>{t('close')}</button>}>
        {sel && (<div>
          <KV k={L('প্রতিষ্ঠান', 'Institution')} v={<span className="bn">{L(sel.institution.nameBn, sel.institution.nameEn)}</span>} /><KV k="Institution ID" v={sel.institution.id} mono /><KV k={L('কর্মকর্তা', 'Officer')} v={<span className="bn">{sel.officer}</span>} /><KV k={t('date')} v={fmtDate(sel.date, lang)} /><KV k={L('Check-in GPS', 'Check-in GPS')} v={<span className="flex items-center gap-1"><MapPin size={12} />{sel.gps}</span>} mono /><KV k={L('স্কোর', 'Score')} v={sel.score ? `${fmtNum(sel.score, lang)}/100` : '—'} /><KV k={L('ছবি', 'Photos')} v={fmtNum(sel.photos, lang)} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} />
          <div className="mt-4"><div className="label bn">{L('চিহ্নিত সমস্যা', 'Identified issues')}</div>{sel.issues.length ? <div className="flex flex-wrap gap-1.5">{sel.issues.map((x) => <Badge key={x} tone="amber" className="bn">{x}</Badge>)}</div> : <span className="text-sm text-emerald-600 font-semibold">{L('কোনো সমস্যা চিহ্নিত হয়নি', 'No issues identified')}</span>}</div>
        </div>)}
      </Modal>
    </div>
  )
}
