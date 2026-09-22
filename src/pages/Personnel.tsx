import { useMemo, useState } from 'react'
import { UserSquare2, GraduationCap, UserCheck, Search, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang, fmtNum, fmtDate } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Avatar, type Column } from '../components/ui'
import { personnel, type Personnel as P } from '../data/mock'

const roleBn: Record<string, string> = { Imam: 'ইমাম', Khatib: 'খতিব', Muazzin: 'মুয়াজ্জিন', Purohit: 'পুরোহিত', Priest: 'ধর্মযাজক', Bhikkhu: 'ভিক্ষু', Instructor: 'ধর্মীয় শিক্ষক' }

export default function Personnel() {
  const { t, L, lang } = useLang()
  const nav = useNavigate()
  const [role, setRole] = useState('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<P | null>(null)
  const rows = useMemo(() => personnel.filter((p) => (role === 'all' || p.role === role) && (q === '' || p.name.includes(q) || p.id.toLowerCase().includes(q.toLowerCase()))), [role, q])
  const cols: Column<P>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: t('name'), render: (r) => <div className="flex items-center gap-2"><Avatar name={r.name} size={30} /><div><div className="font-medium bn">{r.name}</div><div className="text-xs text-slate-500 tabular-nums">{r.mobile}</div></div></div> },
    { key: 'role', header: L('পদ', 'Role'), render: (r) => <Badge tone="brand">{L(roleBn[r.role], r.role)}</Badge> },
    { key: 'inst', header: L('প্রতিষ্ঠান', 'Institution'), render: (r) => <div><div className="bn text-xs truncate max-w-[220px]">{L(r.institution.nameBn, r.institution.nameEn)}</div><div className="mono-id">{r.institution.id}</div></div> },
    { key: 'q', header: L('যোগ্যতা', 'Qualification'), render: (r) => <span className="bn text-xs">{r.qualification}</span> },
    { key: 'tr', header: L('প্রশিক্ষণ', 'Trainings'), align: 'right', render: (r) => fmtNum(r.trainings, lang) },
    { key: 'app', header: L('নিয়োগ', 'Appointed'), render: (r) => fmtDate(r.appointedOn, lang) },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  return (
    <div>
      <PageHeader kicker={L('মডিউল ১২ · ধর্মীয় নেতা / জনবল ডাটাবেস', 'MODULE 12 · RELIGIOUS LEADER / PERSONNEL DATABASE')} title={t('personnel')}
        subtitle={L('সরকারি কার্যক্রমের সাথে যুক্ত ইমাম, খতিব, মুয়াজ্জিন, পুরোহিত, ধর্মযাজক, ভিক্ষু ও ধর্মীয় শিক্ষকদের কাঠামোবদ্ধ ডাটাবেস', 'Structured database of imams, khatibs, muazzins, purohits, priests, bhikkhus and religious instructors linked to government programs')}
        actions={<button className="btn-primary"><Plus size={15} /> {L('নতুন নিবন্ধন', 'New registration')}</button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('নিবন্ধিত জনবল (নমুনা)', 'Registered personnel (sample)')} value={personnel.length} icon={UserSquare2} hint={L('জাতীয়: ৩,১২,৪৫০', 'National: 3,12,450')} />
        <StatTile label={t('active')} value={personnel.filter((p) => p.status === 'Active').length} icon={UserCheck} tone="emerald" />
        <StatTile label={L('প্রশিক্ষণপ্রাপ্ত', 'Trained (≥1)')} value={personnel.filter((p) => p.trainings > 0).length} icon={GraduationCap} tone="violet" />
        <StatTile label={L('ইমাম / খতিব', 'Imams / Khatibs')} value={personnel.filter((p) => p.role === 'Imam' || p.role === 'Khatib').length} icon={UserSquare2} tone="sky" />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-5">
        {Object.keys(roleBn).map((k) => { const n = personnel.filter((p) => p.role === k).length; const s = role === k; return <button key={k} onClick={() => setRole(s ? 'all' : k)} className={`rounded-md border p-3 text-left transition ${s ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white hover:border-brand-300'}`}><div className="text-xs font-semibold bn">{L(roleBn[k], k)}</div><div className="text-lg font-bold tabular-nums">{fmtNum(n, lang)}</div></button> })}
      </div>
      <Card padded={false}>
        <Toolbar><div className="flex items-center gap-2 input !w-64 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('নাম বা ID', 'Name or ID')} value={q} onChange={(e) => setQ(e.target.value)} /></div><Select value={role} onChange={setRole} options={[{ value: 'all', label: L('সকল পদ', 'All roles') }, ...Object.keys(roleBn).map((k) => ({ value: k, label: L(roleBn[k], k) }))]} /></Toolbar>
        <Table columns={cols} rows={rows} onRowClick={setSel} />
      </Card>
      <Modal open={!!sel} onClose={() => setSel(null)} title={L('জনবল প্রোফাইল', 'Personnel profile')} footer={<><button className="btn-secondary" onClick={() => sel && nav(`/institutions/${sel.institution.id}`)}>{L('প্রতিষ্ঠান দেখুন', 'View institution')}</button><button className="btn-primary" onClick={() => setSel(null)}>{t('close')}</button></>}>
        {sel && (<div><div className="flex items-center gap-3 mb-4"><Avatar name={sel.name} size={48} /><div><div className="font-semibold bn">{sel.name}</div><div className="mono-id">{sel.id}</div></div></div>
          <CardHeader title={L('সেবা ইতিহাস', 'Service history')} /><KV k={L('পদ', 'Role')} v={L(roleBn[sel.role], sel.role)} /><KV k={L('প্রতিষ্ঠান', 'Institution')} v={<span className="bn">{L(sel.institution.nameBn, sel.institution.nameEn)}</span>} /><KV k={L('যোগ্যতা', 'Qualification')} v={<span className="bn">{sel.qualification}</span>} /><KV k={L('নিয়োগ', 'Appointed')} v={fmtDate(sel.appointedOn, lang)} /><KV k={L('প্রশিক্ষণ সম্পন্ন', 'Trainings completed')} v={fmtNum(sel.trainings, lang)} /><KV k={t('mobile')} v={sel.mobile} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} /></div>)}
      </Modal>
    </div>
  )
}
