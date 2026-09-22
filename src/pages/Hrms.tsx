import { useMemo, useState } from 'react'
import { Users, UserCheck, Clock, UserX, Palmtree, Briefcase, Search, Smartphone, MapPin, Camera, Fingerprint } from 'lucide-react'
import { useLang, fmtNum, fmtDate } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Tabs, Avatar, KV, Modal, type Column } from '../components/ui'
import { employees, hrSummary, type Employee } from '../data/mock'

export default function Hrms() {
  const { t, L, lang } = useLang()
  const [tab, setTab] = useState<'attendance' | 'leave' | 'transfer' | 'master'>('attendance')
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Employee | null>(null)
  const rows = useMemo(() => employees.filter((e) => (status === 'all' || e.status === status) && (q === '' || e.name.includes(q) || e.id.toLowerCase().includes(q.toLowerCase()) || e.office.includes(q))), [status, q])
  const statusLabel = (s: Employee['status']) => ({ Present: t('present'), Absent: t('absent'), Late: t('late'), Leave: t('leave'), Tour: t('tour') }[s])
  const cols: Column<Employee>[] = [
    { key: 'id', header: 'Emp ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: t('name'), render: (r) => <div className="flex items-center gap-2"><Avatar name={r.name} size={30} /><div><div className="font-medium bn">{r.name}</div><div className="text-xs text-slate-500 bn">{r.designation} · {L('গ্রেড', 'Grade')} {fmtNum(r.grade, lang)}</div></div></div> },
    { key: 'office', header: L('কার্যালয়', 'Office'), render: (r) => <span className="bn text-xs">{r.office}</span> },
    { key: 'checkin', header: L('চেক-ইন', 'Check-in'), render: (r) => r.checkIn ? <span className="tabular-nums">{r.checkIn}</span> : <span className="text-slate-300">—</span> },
    { key: 'gps', header: 'GPS', align: 'center', render: (r) => r.gps ? <MapPin size={14} className="inline text-emerald-600" /> : <span className="text-slate-300">—</span> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{statusLabel(r.status)}</Badge> },
  ]
  const leaveReqs = employees.slice(0, 8).map((e, i) => ({ id: `LV-${2600 + i}`, emp: e, type: ['নৈমিত্তিক', 'অর্জিত', 'চিকিৎসা', 'শ্রান্তি বিনোদন'][i % 4], from: `2026-10-${String(2 + i).padStart(2, '0')}`, days: (i % 5) + 1, status: i < 3 ? 'Pending' : i < 6 ? 'Approved' : 'Rejected' }))
  const transfers = employees.slice(10, 16).map((e, i) => ({ id: `TR-${410 + i}`, emp: e, to: ['জেলা কার্যালয়, সিলেট', 'হজ অফিস, আশকোনা', 'ওয়াক্‌ফ প্রশাসকের কার্যালয়', 'জেলা কার্যালয়, খুলনা', 'ইসলামিক ফাউন্ডেশন', 'মন্ত্রণালয় সচিবালয়'][i], date: `2026-11-0${i + 1}`, status: i < 2 ? 'Pending' : 'Approved' }))

  return (
    <div>
      <PageHeader kicker={L('মডিউল ১৩ · e-HRMS ও কর্মচারী উপস্থিতি', 'MODULE 13 · e-HRMS & EMPLOYEE ATTENDANCE')} title={t('hrms')}
        subtitle={L('কর্মচারী মাস্টার, উপস্থিতি, ছুটি, সফর, বদলি, পদায়ন, প্রশিক্ষণ, কর্মমূল্যায়ন, অবসর ও পে-রোল ইন্টিগ্রেশন', 'Employee master, attendance, leave, tour, transfer, posting, training, performance, retirement and payroll integration')} />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        <StatTile label={L('মোট কর্মচারী', 'Total employees')} value={hrSummary.totalEmployees} icon={Users} tone="slate" />
        <StatTile label={t('present')} value={hrSummary.present} icon={UserCheck} tone="emerald" hint={`${Math.round((hrSummary.present / hrSummary.totalEmployees) * 100)}%`} />
        <StatTile label={t('late')} value={hrSummary.late} icon={Clock} tone="amber" />
        <StatTile label={t('absent')} value={hrSummary.absent} icon={UserX} tone="red" />
        <StatTile label={t('leave')} value={hrSummary.leave} icon={Palmtree} tone="violet" />
        <StatTile label={t('tour')} value={hrSummary.tour} icon={Briefcase} tone="sky" />
      </div>
      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        <div>
          <div className="mb-4"><Tabs value={tab} onChange={setTab} tabs={[{ key: 'attendance', label: L('আজকের উপস্থিতি', "Today's attendance"), count: employees.length }, { key: 'leave', label: L('ছুটির আবেদন', 'Leave requests'), count: hrSummary.pendingLeave }, { key: 'transfer', label: L('বদলি / পদায়ন', 'Transfer / posting'), count: hrSummary.pendingTransfer }, { key: 'master', label: L('কর্মচারী মাস্টার', 'Employee master') }]} /></div>
          {(tab === 'attendance' || tab === 'master') && (
            <Card padded={false}>
              <Toolbar><div className="flex items-center gap-2 input !w-64 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('নাম, ID বা কার্যালয়', 'Name, ID or office')} value={q} onChange={(e) => setQ(e.target.value)} /></div>{tab === 'attendance' && <Select value={status} onChange={setStatus} options={[{ value: 'all', label: `${t('all')} ${t('status')}` }, ...(['Present', 'Late', 'Absent', 'Leave', 'Tour'] as const).map((s) => ({ value: s, label: statusLabel(s) }))]} />}<span className="ml-auto text-xs text-slate-500">{fmtDate('2026-09-22', lang)}</span></Toolbar>
              <Table columns={tab === 'master' ? [cols[0], cols[1], cols[2], { key: 'joined', header: L('যোগদান', 'Joined'), render: (r: Employee) => fmtDate(r.joined, lang) }, { key: 'lb', header: L('ছুটি ব্যালেন্স', 'Leave balance'), align: 'right', render: (r: Employee) => fmtNum(r.leaveBalance, lang) }] : cols} rows={rows} onRowClick={setSel} />
            </Card>
          )}
          {tab === 'leave' && <Card padded={false}><Table columns={[{ key: 'id', header: 'ID', render: (r: typeof leaveReqs[0]) => <span className="mono-id">{r.id}</span> }, { key: 'emp', header: t('name'), render: (r: typeof leaveReqs[0]) => <div><div className="bn font-medium">{r.emp.name}</div><div className="text-xs text-slate-500 bn">{r.emp.office}</div></div> }, { key: 'type', header: L('ছুটির ধরন', 'Leave type'), render: (r: typeof leaveReqs[0]) => <span className="bn">{r.type}</span> }, { key: 'from', header: L('শুরু', 'From'), render: (r: typeof leaveReqs[0]) => fmtDate(r.from, lang) }, { key: 'days', header: L('দিন', 'Days'), align: 'right', render: (r: typeof leaveReqs[0]) => fmtNum(r.days, lang) }, { key: 'status', header: t('status'), render: (r: typeof leaveReqs[0]) => <Badge>{r.status}</Badge> }, { key: 'act', header: t('actions'), render: (r: typeof leaveReqs[0]) => r.status === 'Pending' ? <div className="flex gap-1"><button className="btn-primary !py-1 !px-2 text-xs">{L('অনুমোদন', 'Approve')}</button><button className="btn-secondary !py-1 !px-2 text-xs">{L('না', 'Reject')}</button></div> : null }]} rows={leaveReqs} /></Card>}
          {tab === 'transfer' && <Card padded={false}><Table columns={[{ key: 'id', header: 'ID', render: (r: typeof transfers[0]) => <span className="mono-id">{r.id}</span> }, { key: 'emp', header: t('name'), render: (r: typeof transfers[0]) => <div><div className="bn font-medium">{r.emp.name}</div><div className="text-xs text-slate-500 bn">{r.emp.designation}</div></div> }, { key: 'from', header: L('বর্তমান', 'From'), render: (r: typeof transfers[0]) => <span className="bn text-xs">{r.emp.office}</span> }, { key: 'to', header: L('প্রস্তাবিত', 'To'), render: (r: typeof transfers[0]) => <span className="bn text-xs">{r.to}</span> }, { key: 'date', header: L('কার্যকর', 'Effective'), render: (r: typeof transfers[0]) => fmtDate(r.date, lang) }, { key: 'status', header: t('status'), render: (r: typeof transfers[0]) => <Badge>{r.status}</Badge> }]} rows={transfers} /></Card>}
        </div>
        <div>
          <div className="kicker mb-2 flex items-center gap-1.5"><Smartphone size={12} /> {L('মাঠ কর্মকর্তা মোবাইল উপস্থিতি', 'Field officer mobile attendance')}</div>
          <div className="mx-auto w-[280px] rounded-[36px] bg-[#0a1530] p-2.5 shadow-pop">
            <div className="rounded-[28px] bg-cream overflow-hidden h-[480px] flex flex-col">
              <div className="bg-[#0a1530] text-white px-5 pt-4 pb-4"><div className="text-xs text-brand-300 font-semibold">NRADTP Field</div><div className="font-bold bn">{L('উপস্থিতি', 'Attendance')}</div><div className="text-[11px] text-slate-400">{fmtDate('2026-09-22', lang)} · 08:52</div></div>
              <div className="flex-1 p-3 space-y-2 text-sm">
                <div className="card p-3"><div className="flex items-center gap-2 text-xs font-semibold"><MapPin size={13} className="text-emerald-600" /> GPS</div><div className="font-mono text-xs mt-1">24.3745, 88.6042</div><div className="text-[11px] text-slate-500 bn">{L('জেলা কার্যালয়, রাজশাহী থেকে ১৮ মি', '18 m from District Office, Rajshahi')}</div></div>
                <div className="card p-3"><div className="flex items-center gap-2 text-xs font-semibold"><Smartphone size={13} className="text-brand-600" /> {L('ডিভাইস', 'Device')}</div><div className="text-[11px] text-slate-500 mt-1">Samsung A54 · {L('নিবন্ধিত', 'Registered')} · IMEI •••4471</div></div>
                <div className="card p-3 flex items-center gap-3"><div className="w-14 h-14 rounded-full bg-slate-200 grid place-items-center text-slate-400"><Camera size={18} /></div><div className="text-[11px] text-slate-600 bn">{L('ঐচ্ছিক সেলফি — মুখ শনাক্তকরণে যাচাই', 'Optional selfie — verified by face match')}</div></div>
                <div className="flex-1" />
              </div>
              <div className="p-3 bg-white border-t border-slate-200"><button className="btn-primary w-full bn"><Fingerprint size={16} /> {L('চেক-ইন করুন', 'Check in')}</button></div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} title={L('কর্মচারী প্রোফাইল', 'Employee profile')} footer={<button className="btn-secondary" onClick={() => setSel(null)}>{t('close')}</button>}>
        {sel && (<div><div className="flex items-center gap-3 mb-4"><Avatar name={sel.name} size={48} /><div><div className="font-semibold bn">{sel.name}</div><div className="text-xs text-slate-500 bn">{sel.designation}</div><div className="mono-id">{sel.id}</div></div></div>
          <CardHeader title={L('সেবা রেকর্ড', 'Service record')} /><KV k={L('কার্যালয়', 'Office')} v={<span className="bn">{sel.office}</span>} /><KV k={L('গ্রেড', 'Grade')} v={fmtNum(sel.grade, lang)} /><KV k={L('যোগদান', 'Joined')} v={fmtDate(sel.joined, lang)} /><KV k={L('ছুটি ব্যালেন্স', 'Leave balance')} v={`${fmtNum(sel.leaveBalance, lang)} ${L('দিন', 'days')}`} /><KV k={L('আজকের অবস্থা', 'Today')} v={<Badge>{statusLabel(sel.status)}</Badge>} />{sel.checkIn && <KV k={L('চেক-ইন', 'Check-in')} v={`${sel.checkIn} · GPS ✓`} />}</div>)}
      </Modal>
    </div>
  )
}
