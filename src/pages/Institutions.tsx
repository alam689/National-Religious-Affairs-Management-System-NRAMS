import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Download, Building2, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { useLang, fmtNum, fmtDate } from '../i18n'
import { PageHeader, Card, StatTile, Table, Badge, Toolbar, Select, Modal, Field, Stepper, type Column } from '../components/ui'
import { institutions, divisions, type Institution, type InstType, instTypePrefix } from '../data/mock'

const typeKeys: InstType[] = ['mosque', 'madrasa', 'temple', 'church', 'buddhist', 'other']
const typeEmoji: Record<InstType, string> = { mosque: '🕌', madrasa: '📚', temple: '🛕', church: '⛪', buddhist: '☸️', other: '🏛️' }

export default function Institutions() {
  const { t, L, lang } = useLang()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [div, setDiv] = useState('all')
  const [status, setStatus] = useState('all')
  const [showNew, setShowNew] = useState(false)
  const [step, setStep] = useState(0)
  const [page, setPage] = useState(0)
  const PAGE = 12

  const rows = useMemo(() => institutions.filter((i) =>
    (type === 'all' || i.type === type) && (div === 'all' || i.divisionId === div) && (status === 'all' || i.status === status) &&
    (q === '' || i.nameBn.includes(q) || i.nameEn.toLowerCase().includes(q.toLowerCase()) || i.id.toLowerCase().includes(q.toLowerCase()))
  ), [q, type, div, status])
  const paged = rows.slice(page * PAGE, page * PAGE + PAGE)

  const cols: Column<Institution>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: t('name'), render: (r) => <div className="flex items-center gap-2"><span className="text-base">{typeEmoji[r.type]}</span><div><div className="font-medium text-slate-800 bn">{L(r.nameBn, r.nameEn)}</div><div className="text-xs text-slate-500 bn">{t(r.type)} · {L('প্রতিষ্ঠিত', 'Est.')} {fmtNum(r.established, lang).replace(/[,،]/g, '')}</div></div></div> },
    { key: 'loc', header: `${t('district')} / ${t('upazila')}`, render: (r) => <span className="bn">{L(r.district.bn, r.district.en)}, {r.upazila}</span> },
    { key: 'incharge', header: L('দায়িত্বপ্রাপ্ত', 'In-charge'), render: (r) => <div><div className="bn">{r.incharge}</div><div className="text-xs text-slate-500 tabular-nums">{r.mobile}</div></div> },
    { key: 'capacity', header: t('capacity'), align: 'right', render: (r) => fmtNum(r.capacity, lang) },
    { key: 'grants', header: L('অনুদান', 'Grants'), align: 'right', render: (r) => fmtNum(r.grantsReceived, lang) },
    { key: 'insp', header: L('শেষ পরিদর্শন', 'Last inspection'), render: (r) => r.lastInspection ? fmtDate(r.lastInspection, lang) : <span className="text-slate-400">—</span> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]

  const steps = [L('প্রতিষ্ঠান তথ্য', 'Institution'), L('ঠিকানা ও GPS', 'Location & GPS'), L('কমিটি ও জনবল', 'Committee'), L('জমি ও ভবন', 'Land & Building'), L('নথি ও ছবি', 'Documents')]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০১ · প্রতিষ্ঠান নিবন্ধন ও ডাটাবেস', 'MODULE 01 · INSTITUTION REGISTRATION & DATABASE')} title={t('institutions')}
        subtitle={L('দেশের সকল ধর্মীয় প্রতিষ্ঠানের কেন্দ্রীয় রেজিস্ট্রি — Unique Institution ID সহ', 'Central registry of every religious institution — with a unique Institution ID')}
        actions={<><button className="btn-secondary"><Download size={15} /> {t('export')}</button><button className="btn-primary" onClick={() => { setStep(0); setShowNew(true) }}><Plus size={15} /> {L('নতুন নিবন্ধন', 'New registration')}</button></>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('নমুনা রেজিস্ট্রিতে প্রতিষ্ঠান', 'Institutions in sample registry')} value={institutions.length} icon={Building2} />
        <StatTile label={t('active')} value={institutions.filter((i) => i.status === 'Active').length} icon={CheckCircle2} tone="emerald" />
        <StatTile label={L('যাচাই অপেক্ষমাণ', 'Pending verification')} value={institutions.filter((i) => i.status === 'Pending Verification').length} icon={Clock} tone="amber" />
        <StatTile label={L('GPS ট্যাগযুক্ত', 'GPS-tagged')} value={institutions.length} icon={MapPin} tone="sky" hint="100%" />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
        {typeKeys.map((k) => {
          const n = institutions.filter((i) => i.type === k).length
          const sel = type === k
          return (
            <button key={k} onClick={() => { setType(sel ? 'all' : k); setPage(0) }} className={`rounded-md border p-3 text-left transition ${sel ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white hover:border-brand-300'}`}>
              <div className="text-xl">{typeEmoji[k]}</div>
              <div className="text-xs font-semibold mt-1 bn">{t(k)}</div>
              <div className="text-lg font-bold tabular-nums">{fmtNum(n, lang)}</div>
            </button>
          )
        })}
      </div>

      <Card padded={false}>
        <Toolbar>
          <div className="flex items-center gap-2 input !w-72 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('নাম বা ID', 'Name or ID')} value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} /></div>
          <Select value={div} onChange={(v) => { setDiv(v); setPage(0) }} options={[{ value: 'all', label: `${t('all')} ${t('division')}` }, ...divisions.map((d) => ({ value: d.id, label: L(d.bn, d.en) }))]} />
          <Select value={status} onChange={(v) => { setStatus(v); setPage(0) }} options={[{ value: 'all', label: `${t('all')} ${t('status')}` }, { value: 'Active', label: t('active') }, { value: 'Pending Verification', label: L('যাচাই অপেক্ষমাণ', 'Pending Verification') }, { value: 'Inactive', label: t('inactive') }]} />
          <span className="ml-auto text-xs text-slate-500">{t('showing')} {fmtNum(paged.length, lang)} {t('of')} {fmtNum(rows.length, lang)}</span>
        </Toolbar>
        <Table columns={cols} rows={paged} onRowClick={(r) => nav(`/institutions/${r.id}`)} />
        <div className="p-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <button className="btn-secondary !py-1" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>‹</button>
          <span className="text-xs text-slate-500 tabular-nums">{fmtNum(page + 1, lang)} / {fmtNum(Math.max(1, Math.ceil(rows.length / PAGE)), lang)}</span>
          <button className="btn-secondary !py-1" disabled={(page + 1) * PAGE >= rows.length} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>
      </Card>

      <Modal open={showNew} onClose={() => setShowNew(false)} wide title={L('নতুন ধর্মীয় প্রতিষ্ঠান নিবন্ধন', 'Register a new religious institution')}
        footer={<><button className="btn-secondary" onClick={() => setShowNew(false)}>{t('cancel')}</button>{step > 0 && <button className="btn-secondary" onClick={() => setStep((s) => s - 1)}>{L('পূর্ববর্তী', 'Back')}</button>}{step < steps.length - 1 ? <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>{L('পরবর্তী', 'Next')}</button> : <button className="btn-primary" onClick={() => setShowNew(false)}>{t('submit')}</button>}</>}>
        <div className="mb-5"><Stepper steps={steps} current={step} /></div>
        {step === 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={L('প্রতিষ্ঠানের ধরন', 'Institution type')}><select className="input">{typeKeys.map((k) => <option key={k}>{t(k)}</option>)}</select></Field>
            <Field label={L('Institution ID (স্বয়ংক্রিয়)', 'Institution ID (auto)')}><input className="input font-mono" disabled value={`${instTypePrefix.mosque}-2026-000141`} /></Field>
            <Field label={L('প্রতিষ্ঠানের নাম (বাংলা)', 'Name (Bangla)')}><input className="input bn" placeholder="বায়তুল নূর জামে মসজিদ" /></Field>
            <Field label={L('প্রতিষ্ঠানের নাম (English)', 'Name (English)')}><input className="input" placeholder="Baitun Noor Jame Mosque" /></Field>
            <Field label={t('established')}><input className="input" type="number" placeholder="1985" /></Field>
            <Field label={t('capacity')} hint={L('একসাথে উপাসনায় অংশগ্রহণকারী', 'Simultaneous worshippers')}><input className="input" type="number" placeholder="500" /></Field>
          </div>
        )}
        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('division')}><select className="input">{divisions.map((d) => <option key={d.id}>{L(d.bn, d.en)}</option>)}</select></Field>
            <Field label={t('district')}><select className="input">{divisions[0].districts.map((d) => <option key={d.en}>{L(d.bn, d.en)}</option>)}</select></Field>
            <Field label={t('upazila')}><input className="input bn" /></Field>
            <Field label={t('union')}><input className="input bn" /></Field>
            <div className="sm:col-span-2"><Field label={L('বিস্তারিত ঠিকানা', 'Full address')}><textarea className="input bn" rows={2} /></Field></div>
            <Field label="GPS Latitude"><input className="input font-mono" placeholder="23.78012" /></Field>
            <Field label="GPS Longitude"><input className="input font-mono" placeholder="90.41234" /></Field>
          </div>
        )}
        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={L('কমিটি সভাপতি', 'Committee president')}><input className="input bn" /></Field>
            <Field label={L('সাধারণ সম্পাদক', 'General secretary')}><input className="input bn" /></Field>
            <Field label={L('দায়িত্বপ্রাপ্ত ব্যক্তি', 'Person in charge')}><input className="input bn" /></Field>
            <Field label={t('mobile')}><input className="input" placeholder="01XXXXXXXXX" /></Field>
            <Field label={L('ইমাম / পুরোহিত / ধর্মযাজক', 'Imam / Purohit / Priest')}><input className="input bn" /></Field>
            <Field label={L('কর্মচারী সংখ্যা', 'Staff count')}><input className="input" type="number" /></Field>
          </div>
        )}
        {step === 3 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={L('জমির পরিমাণ (শতাংশ)', 'Land area (decimal)')}><input className="input" type="number" /></Field>
            <Field label={L('দাগ / খতিয়ান নং', 'Dag / Khatian no.')}><input className="input font-mono" /></Field>
            <Field label={L('ভবনের ধরন', 'Building type')}><select className="input bn"><option>পাকা</option><option>আধা-পাকা</option><option>বহুতল</option><option>টিনশেড</option></select></Field>
            <Field label={L('তলার সংখ্যা', 'Floors')}><input className="input" type="number" /></Field>
            <Field label={L('বিদ্যুৎ সংযোগ', 'Electricity')}><select className="input"><option>{L('আছে', 'Yes')}</option><option>{L('নেই', 'No')}</option></select></Field>
            <Field label={L('পানির উৎস', 'Water source')}><select className="input"><option>{L('সাপ্লাই', 'Supply')}</option><option>{L('নলকূপ', 'Tube well')}</option></select></Field>
          </div>
        )}
        {step === 4 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[L('প্রতিষ্ঠানের ছবি (সম্মুখভাগ)', 'Photo (front)'), L('জমির দলিল', 'Land deed'), L('কমিটি রেজুলেশন', 'Committee resolution'), L('অন্যান্য নথি', 'Other documents')].map((d) => (
              <div key={d} className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500 hover:border-brand-300 hover:bg-brand-50/30 transition cursor-pointer bn">{d}<div className="text-xs text-slate-400 mt-1">PDF / JPG · max 5 MB</div></div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
