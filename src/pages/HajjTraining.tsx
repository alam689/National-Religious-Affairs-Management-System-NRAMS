import { useState } from 'react'
import { GraduationCap, Users, Award, CalendarDays, Plus, PlayCircle, FileText, HelpCircle } from 'lucide-react'
import { useLang, fmtNum, fmtDate } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Progress, Modal, KV, Stepper, type Column } from '../components/ui'
import { trainingBatches, hajjSummary, type TrainingBatch } from '../data/mock'

export default function HajjTraining() {
  const { t, L, lang } = useLang()
  const [sel, setSel] = useState<TrainingBatch | null>(null)
  const [showNew, setShowNew] = useState(false)
  const totalParts = trainingBatches.reduce((a, b) => a + b.participants, 0)
  const certs = trainingBatches.reduce((a, b) => a + b.certificates, 0)

  const cols: Column<TrainingBatch>[] = [
    { key: 'id', header: 'Batch ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'centre', header: L('প্রশিক্ষণ কেন্দ্র', 'Training centre'), render: (r) => <div><div className="font-medium bn">{r.centre}</div><div className="text-xs text-slate-500 bn">{r.district}</div></div> },
    { key: 'start', header: L('শুরুর তারিখ', 'Start date'), render: (r) => fmtDate(r.startDate, lang) },
    { key: 'trainer', header: L('প্রশিক্ষক', 'Trainer'), render: (r) => <span className="bn text-xs">{r.trainer}</span> },
    { key: 'parts', header: L('অংশগ্রহণকারী / ধারণক্ষমতা', 'Participants / capacity'), render: (r) => <div className="w-28"><div className="flex justify-between text-[11px] mb-1 tabular-nums"><span>{fmtNum(r.participants, lang)}</span><span className="text-slate-400">{fmtNum(r.capacity, lang)}</span></div><Progress value={(r.participants / r.capacity) * 100} target={80} /></div> },
    { key: 'att', header: L('উপস্থিতি', 'Attendance'), align: 'right', render: (r) => r.attendancePct ? `${fmtNum(r.attendancePct, lang)}%` : '—' },
    { key: 'cert', header: L('সনদ', 'Certificates'), align: 'right', render: (r) => fmtNum(r.certificates, lang) },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  const modules = [L('হজের ফরজ, ওয়াজিব ও সুন্নত', 'Obligations of Hajj'), L('ইহরাম ও তালবিয়া', 'Ihram & Talbiyah'), L('তাওয়াফ ও সাঈ', 'Tawaf & Sa’i'), L('মিনা–আরাফাত–মুজদালিফা', 'Mina–Arafat–Muzdalifah'), L('স্বাস্থ্য ও নিরাপত্তা', 'Health & safety'), L('সৌদি আইন ও আচরণবিধি', 'Saudi laws & conduct'), L('অ্যাপ ব্যবহার ও জরুরি যোগাযোগ', 'App use & emergency contacts')]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ০৭ · হজ প্রশিক্ষণ ব্যবস্থাপনা', 'MODULE 07 · HAJJ TRAINING MANAGEMENT')} title={t('hajjTraining')}
        subtitle={L('প্রশিক্ষণ কেন্দ্র → ব্যাচ → অংশগ্রহণকারী → উপস্থিতি → প্রশিক্ষণ উপকরণ → সনদ', 'Training Centre → Batch → Participant → Attendance → Training Material → Certificate')}
        actions={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> {L('নতুন ব্যাচ', 'New batch')}</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('মোট ব্যাচ (২০২৬)', 'Batches (2026)')} value={trainingBatches.length} icon={CalendarDays} hint={`${trainingBatches.filter((b) => b.status === 'Ongoing').length} ${L('চলমান', 'ongoing')}`} />
        <StatTile label={L('অংশগ্রহণকারী (নমুনা)', 'Participants (sample)')} value={totalParts} icon={Users} tone="sky" />
        <StatTile label={L('জাতীয় প্রশিক্ষিত হজযাত্রী', 'Pilgrims trained nationally')} value={hajjSummary.trained} icon={GraduationCap} tone="emerald" hint={`${Math.round((hajjSummary.trained / hajjSummary.registered) * 100)}% ${L('নিবন্ধিতের', 'of registered')}`} />
        <StatTile label={L('ডিজিটাল সনদ ইস্যু', 'Digital certificates issued')} value={certs} icon={Award} tone="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card padded={false} className="lg:col-span-2"><Table columns={cols} rows={trainingBatches} onRowClick={setSel} /></Card>
        <div className="space-y-4">
          <Card>
            <CardHeader title={L('প্রশিক্ষণ কারিকুলাম', 'Training curriculum')} subtitle={L('৭ মডিউল · ২ দিন', '7 modules · 2 days')} />
            <ol className="space-y-2">{modules.map((m, i) => <li key={m} className="flex items-center gap-2 text-sm"><span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 grid place-items-center text-[11px] font-bold">{fmtNum(i + 1, lang)}</span><span className="bn">{m}</span></li>)}</ol>
          </Card>
          <Card>
            <CardHeader title={L('মোবাইল অ্যাপে প্রশিক্ষণ উপকরণ', 'Training material in the app')} />
            <div className="grid grid-cols-3 gap-2 text-center">
              {[[PlayCircle, L('ভিডিও', 'Videos'), 24], [FileText, L('গাইড PDF', 'Guide PDFs'), 11], [HelpCircle, 'FAQ', 86]].map(([I, k, v]) => { const Icon = I as typeof PlayCircle; return <div key={String(k)} className="rounded-lg bg-slate-50 p-3"><Icon size={18} className="mx-auto text-brand-600" /><div className="font-bold tabular-nums mt-1">{fmtNum(v as number, lang)}</div><div className="text-[11px] text-slate-500 bn">{k as string}</div></div> })}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={!!sel} onClose={() => setSel(null)} title={<span>{L('ব্যাচ বিবরণ', 'Batch details')} · <span className="mono-id text-sm">{sel?.id}</span></span>} footer={<><button className="btn-secondary">{L('উপস্থিতি শিট', 'Attendance sheet')}</button><button className="btn-primary" onClick={() => setSel(null)}>{L('সনদ ইস্যু করুন', 'Issue certificates')}</button></>}>
        {sel && (<div>
          <div className="mb-4"><Stepper steps={[L('কেন্দ্র', 'Centre'), L('ব্যাচ', 'Batch'), L('অংশগ্রহণকারী', 'Participants'), L('উপস্থিতি', 'Attendance'), L('উপকরণ', 'Material'), L('সনদ', 'Certificate')]} current={sel.status === 'Completed' ? 5 : sel.status === 'Ongoing' ? 3 : 2} /></div>
          <KV k={L('কেন্দ্র', 'Centre')} v={<span className="bn">{sel.centre}, {sel.district}</span>} /><KV k={L('শুরু', 'Start')} v={fmtDate(sel.startDate, lang)} /><KV k={L('প্রশিক্ষক', 'Trainer')} v={<span className="bn">{sel.trainer}</span>} /><KV k={L('অংশগ্রহণকারী', 'Participants')} v={`${fmtNum(sel.participants, lang)} / ${fmtNum(sel.capacity, lang)}`} /><KV k={L('গড় উপস্থিতি', 'Avg attendance')} v={sel.attendancePct ? `${fmtNum(sel.attendancePct, lang)}%` : '—'} /><KV k={L('সনদ ইস্যু', 'Certificates issued')} v={fmtNum(sel.certificates, lang)} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} />
        </div>)}
      </Modal>
      <Modal open={showNew} onClose={() => setShowNew(false)} title={L('নতুন প্রশিক্ষণ ব্যাচ', 'New training batch')} footer={<><button className="btn-secondary" onClick={() => setShowNew(false)}>{t('cancel')}</button><button className="btn-primary" onClick={() => setShowNew(false)}>{t('save')}</button></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label bn">{L('প্রশিক্ষণ কেন্দ্র', 'Training centre')}</label><select className="input bn"><option>আশকোনা হজ ক্যাম্প</option><option>ইসলামিক ফাউন্ডেশন কেন্দ্র</option><option>জেলা মডেল মসজিদ</option></select></div>
          <div><label className="label">{t('district')}</label><input className="input bn" /></div>
          <div><label className="label bn">{L('শুরুর তারিখ', 'Start date')}</label><input className="input" type="date" /></div>
          <div><label className="label bn">{L('ধারণক্ষমতা', 'Capacity')}</label><input className="input" type="number" defaultValue={80} /></div>
          <div className="sm:col-span-2"><label className="label bn">{L('প্রশিক্ষক', 'Trainer')}</label><input className="input bn" /></div>
        </div>
      </Modal>
    </div>
  )
}
