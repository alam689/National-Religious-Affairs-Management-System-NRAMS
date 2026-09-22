import { useMemo, useState } from 'react'
import { FileSignature, Banknote, AlertOctagon, CalendarX, Search, Receipt } from 'lucide-react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useLang, fmtNum, fmtDate, fmtMoney } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Toolbar, Select, Modal, KV, Stepper, chartTooltipStyle, type Column } from '../components/ui'
import { leases, waqfRevenueTrend, waqfSummary, monthLabels, monthLabelsBn, type Lease } from '../data/mock'

export default function WaqfLeases() {
  const { t, L, lang } = useLang()
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Lease | null>(null)
  const rows = useMemo(() => leases.filter((l) => (status === 'all' || l.status === status) && (q === '' || l.id.toLowerCase().includes(q.toLowerCase()) || l.tenant.includes(q) || l.property.id.toLowerCase().includes(q.toLowerCase()))), [status, q])
  const monthly = leases.reduce((a, l) => a + l.monthlyRent, 0)
  const arrear = leases.reduce((a, l) => a + l.monthlyRent * l.dueMonths, 0)
  const trend = waqfRevenueTrend.map((r) => ({ ...r, m: lang === 'bn' ? monthLabelsBn[r.i] : monthLabels[r.i], collected: +r.collected.toFixed(1), target: +r.target.toFixed(1) }))

  const cols: Column<Lease>[] = [
    { key: 'id', header: 'Lease ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'prop', header: L('সম্পত্তি', 'Property'), render: (r) => <div><div className="font-medium bn truncate max-w-[220px]">{L(r.property.nameBn, r.property.nameEn)}</div><div className="mono-id">{r.property.id}</div></div> },
    { key: 'tenant', header: L('ইজারাদার', 'Tenant'), render: (r) => <div><div className="bn">{r.tenant}</div><div className="text-xs text-slate-500 font-mono">{r.agreementNo}</div></div> },
    { key: 'period', header: L('মেয়াদ', 'Period'), render: (r) => <span className="text-xs">{fmtDate(r.start, lang)} → {fmtDate(r.end, lang)}</span> },
    { key: 'rent', header: L('মাসিক ভাড়া', 'Monthly rent'), align: 'right', render: (r) => fmtMoney(r.monthlyRent, lang) },
    { key: 'paid', header: L('পরিশোধ (মাস)', 'Paid (months)'), align: 'right', render: (r) => <span className="tabular-nums">{fmtNum(r.paidMonths, lang)}/12</span> },
    { key: 'arrear', header: L('বকেয়া', 'Arrear'), align: 'right', render: (r) => r.dueMonths ? <span className="text-red-600 font-semibold">{fmtMoney(r.monthlyRent * r.dueMonths, lang)}</span> : <span className="text-emerald-600 text-xs font-semibold">{L('নেই', 'None')}</span> },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ১০ · ওয়াক্‌ফ ইজারা ও রাজস্ব ব্যবস্থাপনা', 'MODULE 10 · WAQF LEASE & REVENUE MANAGEMENT')} title={t('lease')}
        subtitle={L('সম্পত্তি → ইজারা → ইজারাদার → চুক্তি → ভাড়া → পরিশোধ → বকেয়া — কোন সম্পত্তি কত রাজস্ব দিচ্ছে, কার বকেয়া, কোন ইজারা কখন শেষ', 'Property → Lease → Tenant → Agreement → Rent → Payment → Arrear — which property earns what, who owes, and which lease expires when')} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('সক্রিয় ইজারা (জাতীয়)', 'Active leases (national)')} value={waqfSummary.leased} icon={FileSignature} tone="violet" hint={`${leases.length} ${L('নমুনা', 'in sample')}`} />
        <StatTile label={L('মাসিক দাবি (নমুনা)', 'Monthly demand (sample)')} value={fmtMoney(monthly, lang, true)} icon={Banknote} tone="emerald" />
        <StatTile label={L('মোট বকেয়া (নমুনা)', 'Total arrear (sample)')} value={fmtMoney(arrear, lang, true)} icon={AlertOctagon} tone="red" hint={`${leases.filter((l) => l.status === 'Arrear').length} ${L('ইজারা', 'leases')}`} />
        <StatTile label={L('৯০ দিনে মেয়াদ শেষ', 'Expiring in 90 days')} value={leases.filter((l) => l.status === 'Expiring').length} icon={CalendarX} tone="amber" hint={`${leases.filter((l) => l.status === 'Expired').length} ${L('ইতিমধ্যে মেয়াদোত্তীর্ণ', 'already expired')}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader title={L('রাজস্ব সংগ্রহ বনাম লক্ষ্য', 'Revenue collection vs target')} subtitle={L('অর্থবছর ২০২৬-২৭ · কোটি টাকা', 'FY 2026-27 · ৳ crore')} />
          <div className="h-56">
            <ResponsiveContainer>
              <ComposedChart data={trend} margin={{ left: -15, right: 10 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="collected" name={L('সংগৃহীত', 'Collected')} fill="#2f62d9" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="target" name={L('লক্ষ্য', 'Target')} stroke="#f59e0b" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={L('শীর্ষ রাজস্ব সম্পত্তি', 'Top revenue properties')} />
          <ul className="space-y-2">{[...leases].sort((a, b) => b.monthlyRent - a.monthlyRent).slice(0, 6).map((l, i) => <li key={l.id} className="flex items-center gap-2 text-sm"><span className="w-5 text-xs text-slate-400 tabular-nums">{fmtNum(i + 1, lang)}</span><div className="flex-1 min-w-0"><div className="truncate bn text-xs font-medium">{L(l.property.nameBn, l.property.nameEn)}</div><div className="mono-id">{l.property.id}</div></div><span className="font-semibold tabular-nums text-xs">{fmtMoney(l.monthlyRent * 12, lang, true)}<span className="text-slate-400">/{L('বছর', 'yr')}</span></span></li>)}</ul>
        </Card>
      </div>

      <Card padded={false}>
        <Toolbar>
          <div className="flex items-center gap-2 input !w-64 !py-1.5"><Search size={14} className="text-slate-400" /><input className="bg-transparent outline-none w-full bn" placeholder={L('Lease ID, Waqf ID বা ইজারাদার', 'Lease ID, Waqf ID or tenant')} value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Select value={status} onChange={setStatus} options={[{ value: 'all', label: `${t('all')} ${t('status')}` }, ...['Active', 'Expiring', 'Expired', 'Arrear'].map((s) => ({ value: s, label: s }))]} />
        </Toolbar>
        <Table columns={cols} rows={rows} onRowClick={setSel} />
      </Card>

      <Modal open={!!sel} onClose={() => setSel(null)} title={<span>{L('ইজারা', 'Lease')} <span className="mono-id text-sm">{sel?.id}</span></span>} footer={<><button className="btn-secondary"><Receipt size={14} /> {L('ডিমান্ড নোটিশ', 'Demand notice')}</button><button className="btn-primary" onClick={() => setSel(null)}>{L('পেমেন্ট রেকর্ড', 'Record payment')}</button></>}>
        {sel && (<div>
          <div className="mb-4 overflow-x-auto"><Stepper steps={[L('সম্পত্তি', 'Property'), L('ইজারা', 'Lease'), L('ইজারাদার', 'Tenant'), L('চুক্তি', 'Agreement'), L('ভাড়া', 'Rent'), L('পরিশোধ', 'Payment'), L('বকেয়া', 'Arrear')]} current={sel.dueMonths ? 6 : 5} /></div>
          <KV k={L('সম্পত্তি', 'Property')} v={<span className="bn">{L(sel.property.nameBn, sel.property.nameEn)}</span>} /><KV k="Waqf ID" v={sel.property.id} mono /><KV k={L('ইজারাদার', 'Tenant')} v={<span className="bn">{sel.tenant}</span>} /><KV k={L('চুক্তি নং', 'Agreement')} v={sel.agreementNo} mono /><KV k={L('মেয়াদ', 'Period')} v={`${fmtDate(sel.start, lang)} → ${fmtDate(sel.end, lang)}`} /><KV k={L('মাসিক ভাড়া', 'Monthly rent')} v={fmtMoney(sel.monthlyRent, lang)} /><KV k={L('পরিশোধিত (মাস)', 'Paid months')} v={`${fmtNum(sel.paidMonths, lang)} / 12`} /><KV k={L('বকেয়া', 'Arrear')} v={sel.dueMonths ? <span className="text-red-600 font-semibold">{fmtMoney(sel.monthlyRent * sel.dueMonths, lang)} ({fmtNum(sel.dueMonths, lang)} {L('মাস', 'mo')})</span> : L('নেই', 'None')} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} />
        </div>)}
      </Modal>
    </div>
  )
}
