import { useState } from 'react'
import { CalendarDays, Users, Banknote, Plus, MapPin } from 'lucide-react'
import { useLang, fmtNum, fmtDate, fmtMoney } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Progress, Modal, KV, type Column } from '../components/ui'
import { events, type Event } from '../data/mock'

export default function Events() {
  const { t, L, lang } = useLang()
  const [sel, setSel] = useState<Event | null>(null)
  const [showNew, setShowNew] = useState(false)
  const cols: Column<Event>[] = [
    { key: 'id', header: 'Event ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: L('অনুষ্ঠান / কর্মসূচি', 'Event / program'), render: (r) => <div><div className="font-medium bn">{L(r.nameBn, r.nameEn)}</div><div className="text-xs text-slate-500 flex items-center gap-1 bn"><MapPin size={11} /> {r.venue}</div></div> },
    { key: 'date', header: t('date'), render: (r) => fmtDate(r.date, lang) },
    { key: 'org', header: L('আয়োজক', 'Organizer'), render: (r) => <span className="bn text-xs">{r.organizer}</span> },
    { key: 'parts', header: L('অংশগ্রহণকারী', 'Participants'), align: 'right', render: (r) => fmtNum(r.participants, lang) },
    { key: 'budget', header: L('বাজেট / ব্যয়', 'Budget / spent'), render: (r) => <div className="w-32"><div className="flex justify-between text-[11px] tabular-nums mb-1"><span>{fmtMoney(r.spent, lang, true)}</span><span className="text-slate-400">{fmtMoney(r.budget, lang, true)}</span></div><Progress value={(r.spent / r.budget) * 100} target={101} /></div> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  const upcoming = [...events].filter((e) => e.date >= '2026-09-22').sort((a, b) => a.date.localeCompare(b.date))
  return (
    <div>
      <PageHeader kicker={L('মডিউল ১৪ · ধর্মীয় অনুষ্ঠান / কর্মসূচি ব্যবস্থাপনা', 'MODULE 14 · RELIGIOUS EVENT / PROGRAM MANAGEMENT')} title={t('events')}
        subtitle={L('অনুষ্ঠান তৈরি, ভেন্যু, অংশগ্রহণকারী, বাজেট, আমন্ত্রণ, উপস্থিতি, রিসোর্স, ছবি/নথি ও প্রতিবেদন', 'Event creation, venue, participants, budget, invitation, attendance, resources, photos/documents and report')}
        actions={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> {L('নতুন অনুষ্ঠান', 'New event')}</button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('অনুষ্ঠান (২০২৬)', 'Events (2026)')} value={events.length} icon={CalendarDays} hint={`${upcoming.length} ${L('আসন্ন', 'upcoming')}`} />
        <StatTile label={L('মোট অংশগ্রহণকারী', 'Total participants')} value={events.reduce((a, e) => a + e.participants, 0)} icon={Users} tone="sky" />
        <StatTile label={L('মোট বাজেট', 'Total budget')} value={fmtMoney(events.reduce((a, e) => a + e.budget, 0), lang, true)} icon={Banknote} tone="emerald" />
        <StatTile label={L('ব্যয়িত', 'Spent')} value={fmtMoney(events.reduce((a, e) => a + e.spent, 0), lang, true)} icon={Banknote} tone="amber" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card padded={false} className="lg:col-span-2"><Table columns={cols} rows={events} onRowClick={setSel} /></Card>
        <Card>
          <CardHeader title={L('আসন্ন কর্মসূচি', 'Upcoming programs')} />
          <ol className="relative border-l border-slate-200 ml-2 space-y-4">
            {upcoming.map((e) => (
              <li key={e.id} className="ml-4 cursor-pointer" onClick={() => setSel(e)}>
                <span className="absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-white" />
                <div className="text-[11px] font-semibold text-brand-600 tabular-nums">{fmtDate(e.date, lang)}</div>
                <div className="text-sm font-medium bn">{L(e.nameBn, e.nameEn)}</div>
                <div className="text-xs text-slate-500 bn">{e.venue}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} title={<span className="bn">{sel && L(sel.nameBn, sel.nameEn)}</span>} footer={<><button className="btn-secondary">{L('প্রতিবেদন', 'Event report')}</button><button className="btn-primary" onClick={() => setSel(null)}>{t('close')}</button></>}>
        {sel && (<div><KV k="Event ID" v={sel.id} mono /><KV k={L('ভেন্যু', 'Venue')} v={<span className="bn">{sel.venue}</span>} /><KV k={t('date')} v={fmtDate(sel.date, lang)} /><KV k={L('আয়োজক', 'Organizer')} v={<span className="bn">{sel.organizer}</span>} /><KV k={L('অংশগ্রহণকারী', 'Participants')} v={fmtNum(sel.participants, lang)} /><KV k={L('বাজেট', 'Budget')} v={fmtMoney(sel.budget, lang)} /><KV k={L('ব্যয়', 'Spent')} v={fmtMoney(sel.spent, lang)} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} />
          <div className="mt-4 grid grid-cols-4 gap-2">{[L('আমন্ত্রণ', 'Invitations'), L('উপস্থিতি', 'Attendance'), L('রিসোর্স', 'Resources'), L('ছবি/নথি', 'Photos/docs')].map((x) => <div key={x} className="rounded-lg bg-slate-50 p-2 text-center text-[11px] font-semibold text-slate-600 bn">{x}</div>)}</div></div>)}
      </Modal>
      <Modal open={showNew} onClose={() => setShowNew(false)} title={L('নতুন অনুষ্ঠান / কর্মসূচি', 'New event / program')} footer={<><button className="btn-secondary" onClick={() => setShowNew(false)}>{t('cancel')}</button><button className="btn-primary" onClick={() => setShowNew(false)}>{t('save')}</button></>}>
        <div className="grid sm:grid-cols-2 gap-4"><div className="sm:col-span-2"><label className="label bn">{L('অনুষ্ঠানের নাম', 'Event name')}</label><input className="input bn" /></div><div><label className="label bn">{L('ভেন্যু', 'Venue')}</label><input className="input bn" /></div><div><label className="label">{t('date')}</label><input className="input" type="date" /></div><div><label className="label bn">{L('বাজেট (৳)', 'Budget (৳)')}</label><input className="input" type="number" /></div><div><label className="label bn">{L('প্রত্যাশিত অংশগ্রহণকারী', 'Expected participants')}</label><input className="input" type="number" /></div></div>
      </Modal>
    </div>
  )
}
