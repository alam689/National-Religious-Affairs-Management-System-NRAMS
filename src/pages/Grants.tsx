import { useMemo, useState } from 'react'
import { HandCoins, CheckCircle2, Clock, Banknote, FileCheck2, Plus, Download, Search } from 'lucide-react'
import { useLang, fmtNum, fmtDate, fmtMoney } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Stepper, Tabs, type Column } from '../components/ui'
import { grants, grantStages, type Grant } from '../data/mock'

const stageLabelBn: Record<string, string> = { Application: 'আবেদন', Verification: 'যাচাই', Approval: 'অনুমোদন', 'Fund Allocation': 'অর্থ বরাদ্দ', Payment: 'পরিশোধ', Utilization: 'ব্যবহার', Monitoring: 'মনিটরিং' }

export default function Grants() {
  const { t, L, lang } = useLang()
  const [view, setView] = useState<'list' | 'board'>('list')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [sel, setSel] = useState<Grant | null>(null)
  const [showNew, setShowNew] = useState(false)

  const rows = useMemo(() => grants.filter((g) => (status === 'all' || g.status === status) && (q === '' || g.id.toLowerCase().includes(q.toLowerCase()) || g.institution.nameBn.includes(q) || g.institution.nameEn.toLowerCase().includes(q.toLowerCase()))), [q, status])
  const sum = (arr: Grant[], k: 'requested' | 'approved') => arr.reduce((a, g) => a + g[k], 0)
  const approvedRows = grants.filter((g) => ['Approved', 'Disbursed', 'Utilized'].includes(g.status))

  const cols: Column<Grant>[] = [
    { key: 'id', header: 'Grant ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'inst', header: L('প্রতিষ্ঠান', 'Institution'), render: (r) => <div><div className="font-medium text-slate-800 bn truncate max-w-[260px]">{L(r.institution.nameBn, r.institution.nameEn)}</div><div className="text-xs text-slate-500 mono-id">{r.institution.id}</div></div> },
    { key: 'purpose', header: L('উদ্দেশ্য', 'Purpose'), render: (r) => <span className="bn">{L(r.purposeBn, r.purposeEn)}</span> },
    { key: 'applied', header: L('আবেদনের তারিখ', 'Applied'), render: (r) => fmtDate(r.appliedOn, lang) },
    { key: 'req', header: L('আবেদিত', 'Requested'), align: 'right', render: (r) => fmtMoney(r.requested, lang) },
    { key: 'apr', header: t('approved'), align: 'right', render: (r) => r.approved ? <span className="text-emerald-700 font-semibold">{fmtMoney(r.approved, lang)}</span> : <span className="text-slate-400">—</span> },
    { key: 'stage', header: L('ধাপ', 'Stage'), render: (r) => <span className="text-xs font-semibold text-slate-600 bn">{L(stageLabelBn[r.stage], r.stage)} <span className="text-slate-400">({grantStages.indexOf(r.stage) + 1}/7)</span></span> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৩ · সরকারি অনুদান ব্যবস্থাপনা', 'MODULE 03 · GOVERNMENT GRANT MANAGEMENT')} title={t('grants')}
        subtitle={L('আবেদন → যাচাই → অনুমোদন → অর্থ বরাদ্দ → পরিশোধ → ব্যবহার → মনিটরিং — সম্পূর্ণ ডিজিটাল', 'Application → Verification → Approval → Fund Allocation → Payment → Utilization → Monitoring — fully digital')}
        actions={<><button className="btn-secondary"><Download size={15} /> {t('export')}</button><button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> {L('নতুন আবেদন', 'New application')}</button></>} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <StatTile label={L('মোট আবেদন', 'Total applications')} value={grants.length} icon={HandCoins} hint={L('অর্থবছর ২০২৬-২৭', 'FY 2026-27')} />
        <StatTile label={L('যাচাই/অনুমোদন অপেক্ষমাণ', 'Pending review')} value={grants.filter((g) => ['Pending', 'Under Review'].includes(g.status)).length} icon={Clock} tone="amber" />
        <StatTile label={L('অনুমোদিত অর্থ', 'Approved amount')} value={fmtMoney(sum(approvedRows, 'approved'), lang, true)} icon={CheckCircle2} tone="emerald" />
        <StatTile label={L('বিতরণকৃত', 'Disbursed')} value={fmtMoney(sum(grants.filter((g) => ['Disbursed', 'Utilized'].includes(g.status)), 'approved'), lang, true)} icon={Banknote} tone="brand" />
        <StatTile label={L('UC জমা হয়েছে', 'UC submitted')} value={grants.filter((g) => g.ucSubmitted).length} icon={FileCheck2} tone="violet" hint={`${L('বিতরণকৃতের মধ্যে', 'of disbursed')} ${grants.filter((g) => ['Disbursed', 'Utilized'].includes(g.status)).length}`} />
      </div>

      <div className="mb-4"><Tabs value={view} onChange={setView} tabs={[{ key: 'list', label: L('তালিকা', 'List'), count: rows.length }, { key: 'board', label: L('ওয়ার্কফ্লো বোর্ড', 'Workflow board') }]} /></div>

      {view === 'list' ? (
        <Card padded={false}>
          <Toolbar>
            <div className="flex items-center gap-2 input !w-72 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('Grant ID বা প্রতিষ্ঠান', 'Grant ID or institution')} value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <Select value={status} onChange={setStatus} options={[{ value: 'all', label: `${t('all')} ${t('status')}` }, ...['Pending', 'Under Review', 'Approved', 'Disbursed', 'Utilized', 'Rejected'].map((s) => ({ value: s, label: s }))]} />
          </Toolbar>
          <Table columns={cols} rows={rows} onRowClick={setSel} />
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {grantStages.map((s, i) => {
            const items = grants.filter((g) => g.stage === s && g.status !== 'Rejected')
            return (
              <div key={s} className="min-w-0">
                <div className="flex items-center justify-between mb-2 px-1"><span className="text-xs font-bold uppercase tracking-wide text-slate-500 bn">{String(i + 1).padStart(2, '0')} · {L(stageLabelBn[s], s)}</span><span className="text-xs bg-slate-100 rounded-full px-2 tabular-nums">{fmtNum(items.length, lang)}</span></div>
                <div className="space-y-2">
                  {items.slice(0, 6).map((g) => (
                    <div key={g.id} onClick={() => setSel(g)} className="card p-3 cursor-pointer hover:shadow-pop hover:border-brand-300 transition">
                      <div className="mono-id mb-1">{g.id}</div>
                      <div className="text-xs font-medium text-slate-800 bn line-clamp-2">{L(g.institution.nameBn, g.institution.nameEn)}</div>
                      <div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-500 bn">{L(g.purposeBn, g.purposeEn)}</span><span className="font-semibold tabular-nums">{fmtMoney(g.approved || g.requested, lang, true)}</span></div>
                    </div>
                  ))}
                  {items.length > 6 && <div className="text-center text-xs text-slate-400">+{fmtNum(items.length - 6, lang)} {L('আরও', 'more')}</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!sel} onClose={() => setSel(null)} wide title={<span>{L('অনুদান বিবরণ', 'Grant details')} · <span className="mono-id text-sm">{sel?.id}</span></span>}
        footer={sel && sel.status !== 'Rejected' && grantStages.indexOf(sel.stage) < 6 ? <><button className="btn-danger">{L('প্রত্যাখ্যান', 'Reject')}</button><button className="btn-primary" onClick={() => setSel(null)}>{L('পরবর্তী ধাপে পাঠান', 'Advance to next stage')}</button></> : <button className="btn-secondary" onClick={() => setSel(null)}>{t('close')}</button>}>
        {sel && (
          <div>
            <div className="mb-5 overflow-x-auto"><Stepper steps={grantStages.map((s) => L(stageLabelBn[s], s))} current={sel.status === 'Rejected' ? -1 : grantStages.indexOf(sel.stage)} /></div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <CardHeader title={L('আবেদনকারী প্রতিষ্ঠান', 'Applicant institution')} />
                <KV k={t('name')} v={<span className="bn">{L(sel.institution.nameBn, sel.institution.nameEn)}</span>} /><KV k="Institution ID" v={sel.institution.id} mono /><KV k={t('district')} v={L(sel.institution.district.bn, sel.institution.district.en)} /><KV k={L('পূর্বের অনুদান', 'Previous grants')} v={fmtNum(sel.institution.grantsReceived, lang)} />
                <KV k={L('যোগাযোগ', 'Contact')} v={<span className="tabular-nums">{sel.institution.mobile}</span>} />
              </div>
              <div>
                <CardHeader title={L('আর্থিক তথ্য', 'Financials')} />
                <KV k={L('উদ্দেশ্য', 'Purpose')} v={<span className="bn">{L(sel.purposeBn, sel.purposeEn)}</span>} /><KV k={L('আবেদিত অর্থ', 'Requested')} v={fmtMoney(sel.requested, lang)} /><KV k={L('অনুমোদিত অর্থ', 'Approved')} v={sel.approved ? <span className="text-emerald-700">{fmtMoney(sel.approved, lang)}</span> : '—'} /><KV k={L('অর্থবছর', 'Fiscal year')} v={sel.fiscalYear} /><KV k={L('বর্তমান অবস্থা', 'Status')} v={<Badge>{sel.status}</Badge>} /><KV k={L('ব্যবহার সনদ (UC)', 'Utilization Certificate')} v={sel.ucSubmitted ? <Badge tone="emerald">{L('জমা হয়েছে', 'Submitted')}</Badge> : <Badge tone="slate">{L('অপেক্ষমাণ', 'Awaiting')}</Badge>} />
              </div>
            </div>
            <div className="mt-5">
              <CardHeader title={L('কার্যক্রম লগ', 'Activity log')} />
              <ul className="space-y-2 text-sm">
                {grantStages.slice(0, Math.max(1, grantStages.indexOf(sel.stage) + 1)).map((s, i) => (
                  <li key={s} className="flex items-start gap-3"><span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" /><div><span className="font-medium bn">{L(stageLabelBn[s], s)}</span> <span className="text-slate-500 bn">— {L('উপজেলা ধর্ম কর্মকর্তা কর্তৃক সম্পন্ন', 'completed by Upazila Religious Affairs Officer')}</span><div className="text-xs text-slate-400">{fmtDate(sel.appliedOn, lang)} · +{i * 6} {L('দিন', 'days')}</div></div></li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showNew} onClose={() => setShowNew(false)} title={L('নতুন অনুদান আবেদন', 'New grant application')} footer={<><button className="btn-secondary" onClick={() => setShowNew(false)}>{t('cancel')}</button><button className="btn-primary" onClick={() => setShowNew(false)}>{t('submit')}</button></>}>
        <div className="grid gap-4">
          <div><label className="label">Institution ID</label><input className="input font-mono" placeholder="MOS-2026-000001" /></div>
          <div><label className="label bn">{L('অনুদানের উদ্দেশ্য', 'Purpose')}</label><select className="input bn"><option>ভবন সংস্কার</option><option>অজুখানা নির্মাণ</option><option>সীমানা প্রাচীর</option><option>সৌর বিদ্যুৎ</option><option>প্রাকৃতিক দুর্যোগ ক্ষতি</option></select></div>
          <div><label className="label bn">{L('আবেদিত অর্থ (৳)', 'Requested amount (৳)')}</label><input className="input" type="number" placeholder="250000" /></div>
          <div><label className="label bn">{L('যৌক্তিকতা', 'Justification')}</label><textarea className="input bn" rows={3} /></div>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center text-sm text-slate-500 bn">{L('প্রাক্কলন, কমিটি রেজুলেশন ও ছবি সংযুক্ত করুন', 'Attach estimate, committee resolution and photos')}</div>
        </div>
      </Modal>
    </div>
  )
}
