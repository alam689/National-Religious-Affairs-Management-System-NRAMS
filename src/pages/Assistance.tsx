import { useMemo, useState } from 'react'
import { Gift, Clock, CheckCircle2, Banknote, Plus } from 'lucide-react'
import { useLang, fmtNum, fmtDate, fmtMoney } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Stepper, type Column } from '../components/ui'
import { assistance, type Assistance as A } from '../data/mock'

const stages = ['Application', 'Verification', 'Approval', 'Disbursement', 'Monitoring'] as const
const stageBn: Record<string, string> = { Application: 'আবেদন', Verification: 'যাচাই', Approval: 'অনুমোদন', Disbursement: 'বিতরণ', Monitoring: 'মনিটরিং' }

export default function Assistance() {
  const { t, L, lang } = useLang()
  const [scheme, setScheme] = useState('all')
  const [sel, setSel] = useState<A | null>(null)
  const [showNew, setShowNew] = useState(false)
  const schemes = Array.from(new Set(assistance.map((a) => a.scheme)))
  const rows = useMemo(() => assistance.filter((a) => scheme === 'all' || a.scheme === scheme), [scheme])
  const cols: Column<A>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'scheme', header: L('কর্মসূচি', 'Scheme'), render: (r) => <span className="bn text-xs font-medium">{r.scheme}</span> },
    { key: 'applicant', header: L('আবেদনকারী', 'Applicant'), render: (r) => <div><div className="bn">{r.applicant}</div><div className="text-xs text-slate-500 bn">{r.district}</div></div> },
    { key: 'applied', header: L('আবেদন', 'Applied'), render: (r) => fmtDate(r.appliedOn, lang) },
    { key: 'amount', header: t('amount'), align: 'right', render: (r) => fmtMoney(r.amount, lang) },
    { key: 'stage', header: L('ধাপ', 'Stage'), render: (r) => <span className="text-xs font-semibold bn">{L(stageBn[r.stage], r.stage)} <span className="text-slate-400">({stages.indexOf(r.stage) + 1}/5)</span></span> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  return (
    <div>
      <PageHeader kicker={L('মডিউল ১৫ · অনুদান / সহায়তা ব্যবস্থাপনা', 'MODULE 15 · DONATION / ASSISTANCE MANAGEMENT')} title={t('assistance')}
        subtitle={L('আবেদন → যাচাই → অনুমোদন → বিতরণ → মনিটরিং — সরকারি সহায়তা ও ধর্মীয়/সামাজিক কল্যাণমূলক সহায়তার জন্য', 'Application → Verification → Approval → Disbursement → Monitoring — for government assistance and religious/social welfare support')}
        actions={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> {L('নতুন আবেদন', 'New application')}</button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('মোট আবেদন', 'Total applications')} value={assistance.length} icon={Gift} />
        <StatTile label={L('যাচাই / অনুমোদন অপেক্ষমাণ', 'Pending verification / approval')} value={assistance.filter((a) => ['Pending', 'Under Review'].includes(a.status)).length} icon={Clock} tone="amber" />
        <StatTile label={L('বিতরণকৃত', 'Disbursed')} value={assistance.filter((a) => ['Disbursed', 'Completed'].includes(a.status)).length} icon={CheckCircle2} tone="emerald" />
        <StatTile label={L('বিতরণকৃত অর্থ', 'Amount disbursed')} value={fmtMoney(assistance.filter((a) => ['Disbursed', 'Completed'].includes(a.status)).reduce((s, a) => s + a.amount, 0), lang, true)} icon={Banknote} tone="brand" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card padded={false} className="lg:col-span-2">
          <Toolbar><Select value={scheme} onChange={setScheme} options={[{ value: 'all', label: L('সকল কর্মসূচি', 'All schemes') }, ...schemes.map((s) => ({ value: s, label: s }))]} /><span className="ml-auto text-xs text-slate-500">{fmtNum(rows.length, lang)} {L('আবেদন', 'applications')}</span></Toolbar>
          <Table columns={cols} rows={rows} onRowClick={setSel} />
        </Card>
        <Card>
          <CardHeader title={L('কর্মসূচি অনুযায়ী', 'By scheme')} />
          <ul className="space-y-2">{schemes.map((s) => { const items = assistance.filter((a) => a.scheme === s); return <li key={s} onClick={() => setScheme(scheme === s ? 'all' : s)} className={`p-3 rounded-lg border cursor-pointer transition ${scheme === s ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}><div className="text-xs font-semibold bn">{s}</div><div className="flex justify-between mt-1 text-xs text-slate-500"><span>{fmtNum(items.length, lang)} {L('আবেদন', 'apps')}</span><span className="tabular-nums font-semibold text-slate-800">{fmtMoney(items.reduce((a, x) => a + x.amount, 0), lang, true)}</span></div></li> })}</ul>
        </Card>
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} title={<span>{L('সহায়তা আবেদন', 'Assistance application')} · <span className="mono-id text-sm">{sel?.id}</span></span>} footer={<><button className="btn-danger">{L('প্রত্যাখ্যান', 'Reject')}</button><button className="btn-primary" onClick={() => setSel(null)}>{L('পরবর্তী ধাপ', 'Advance stage')}</button></>}>
        {sel && (<div><div className="mb-4"><Stepper steps={stages.map((s) => L(stageBn[s], s))} current={stages.indexOf(sel.stage)} /></div><KV k={L('কর্মসূচি', 'Scheme')} v={<span className="bn">{sel.scheme}</span>} /><KV k={L('আবেদনকারী', 'Applicant')} v={<span className="bn">{sel.applicant}</span>} /><KV k={t('district')} v={<span className="bn">{sel.district}</span>} /><KV k={t('amount')} v={fmtMoney(sel.amount, lang)} /><KV k={L('আবেদনের তারিখ', 'Applied on')} v={fmtDate(sel.appliedOn, lang)} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} /></div>)}
      </Modal>
      <Modal open={showNew} onClose={() => setShowNew(false)} title={L('নতুন সহায়তা আবেদন', 'New assistance application')} footer={<><button className="btn-secondary" onClick={() => setShowNew(false)}>{t('cancel')}</button><button className="btn-primary" onClick={() => setShowNew(false)}>{t('submit')}</button></>}>
        <div className="grid gap-4"><div><label className="label bn">{L('কর্মসূচি', 'Scheme')}</label><select className="input bn">{schemes.map((s) => <option key={s}>{s}</option>)}</select></div><div><label className="label bn">{L('আবেদনকারীর নাম', 'Applicant name')}</label><input className="input bn" /></div><div><label className="label">NID</label><input className="input font-mono" /></div><div><label className="label bn">{L('প্রার্থিত অর্থ (৳)', 'Requested amount (৳)')}</label><input className="input" type="number" /></div></div>
      </Modal>
    </div>
  )
}
