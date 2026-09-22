import { useNavigate } from 'react-router-dom'
import { Building2, Users, Landmark, HandCoins, ClipboardCheck, Headset, Plane, FileSignature, AlertTriangle, ArrowRight, Download, Printer } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import { useLang, fmtNum } from '../i18n'
import { Card, CardHeader, StatTile, Badge, CHART, chartTooltipStyle, Progress } from '../components/ui'
import { nationalInstitutionStats, registrationTrend, grantByDivision, hajjPipeline, hajjSummary, waqfSummary, grants, inspections, complaints, monthLabels, monthLabelsBn } from '../data/mock'

export default function Dashboard() {
  const { t, L, lang } = useLang()
  const nav = useNavigate()
  const totalInst = Object.values(nationalInstitutionStats).reduce((a, b) => a + b, 0)
  const pendingGrants = grants.filter((g) => ['Pending', 'Under Review'].includes(g.status)).length
  const approvedGrants = grants.filter((g) => ['Approved', 'Disbursed', 'Utilized'].includes(g.status)).length
  const openComplaints = complaints.filter((c) => !['Resolved', 'Closed'].includes(c.status)).length
  const pie = [
    { name: t('mosque'), value: nationalInstitutionStats.mosque },
    { name: t('madrasa'), value: nationalInstitutionStats.madrasa },
    { name: t('temple'), value: nationalInstitutionStats.temple },
    { name: t('church'), value: nationalInstitutionStats.church },
    { name: t('buddhist'), value: nationalInstitutionStats.buddhist },
    { name: t('other'), value: nationalInstitutionStats.other },
  ]
  const trend = registrationTrend.map((r) => ({ ...r, m: lang === 'bn' ? monthLabelsBn[r.i] : monthLabels[r.i] }))
  const alerts = [
    { tone: 'red', text: L('৩টি উচ্চ-অগ্রাধিকার হজ অভিযোগ SLA অতিক্রম করেছে', '3 high-priority Hajj complaints breached SLA'), to: '/complaints' },
    { tone: 'amber', text: L(`${fmtNum(pendingGrants, 'bn')}টি অনুদান আবেদন যাচাইয়ের অপেক্ষায়`, `${pendingGrants} grant applications awaiting verification`), to: '/grants' },
    { tone: 'amber', text: L('৭টি ওয়াক্‌ফ ইজারা ৯০ দিনের মধ্যে মেয়াদোত্তীর্ণ', '7 waqf leases expire within 90 days'), to: '/waqf/leases' },
    { tone: 'brand', text: L(`${fmtNum(inspections.filter((i) => i.status === 'Overdue').length, 'bn')}টি পরিদর্শন বিলম্বিত`, `${inspections.filter((i) => i.status === 'Overdue').length} field inspections overdue`), to: '/inspections' },
  ] as const

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6 animate-fadeUp">
        <div>
          <div className="kicker mb-1">{L('মডিউল ১৭ · কেন্দ্রীয় MIS', 'MODULE 17 · CENTRAL MIS')}</div>
          <h1 className="text-2xl font-bold text-slate-900 bn">{L('জাতীয় ধর্ম বিষয়ক ড্যাশবোর্ড', 'National Religious Affairs Dashboard')}</h1>
          <p className="text-sm text-slate-500 mt-1 bn">{L('২২ সেপ্টেম্বর ২০২৬ · সকল অধীনস্থ দপ্তরের সমন্বিত চিত্র', '22 Sep 2026 · Consolidated view across all subordinate offices')}</p>
        </div>
        <div className="flex gap-2 no-print">
          <button className="btn-secondary"><Download size={15} /> {t('export')}</button>
          <button className="btn-secondary" onClick={() => window.print()}><Printer size={15} /> {t('print')}</button>
        </div>
      </div>

      {/* KPI row 1: institutions */}
      <div className="kicker mb-2 bn">{L('ধর্মীয় প্রতিষ্ঠান', 'Religious Institutions')}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <StatTile label={L('নিবন্ধিত প্রতিষ্ঠান', 'Registered Institutions')} value={totalInst} icon={Building2} onClick={() => nav('/institutions')} delta={{ v: 4.2 }} hint={t('thisMonth')} />
        <StatTile label={L('নিবন্ধিত মসজিদ', 'Registered Mosques')} value={nationalInstitutionStats.mosque} icon={Building2} tone="emerald" />
        <StatTile label={t('madrasa')} value={nationalInstitutionStats.madrasa} icon={Building2} tone="sky" />
        <StatTile label={t('temple')} value={nationalInstitutionStats.temple} icon={Building2} tone="amber" />
        <StatTile label={t('church')} value={nationalInstitutionStats.church} icon={Building2} tone="violet" />
        <StatTile label={t('buddhist')} value={nationalInstitutionStats.buddhist} icon={Building2} tone="slate" />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        <StatTile label={L('নিবন্ধিত হজযাত্রী', 'Registered Pilgrims')} value={hajjSummary.registered} icon={Users} onClick={() => nav('/hajj')} />
        <StatTile label={L('হজ আবেদন', 'Hajj Applications')} value={hajjSummary.quota} icon={Plane} tone="sky" />
        <StatTile label={L('ওয়াক্‌ফ সম্পত্তি', 'Waqf Properties')} value={waqfSummary.totalRegistered} icon={Landmark} tone="violet" onClick={() => nav('/waqf')} />
        <StatTile label={L('সক্রিয় ইজারা', 'Active Leases')} value={waqfSummary.leased} icon={FileSignature} tone="violet" onClick={() => nav('/waqf/leases')} />
        <StatTile label={L('অনুদান আবেদন', 'Grant Applications')} value={12840} icon={HandCoins} tone="amber" onClick={() => nav('/grants')} />
        <StatTile label={L('অনুমোদিত অনুদান', 'Approved Grants')} value={8412} icon={HandCoins} tone="emerald" hint={`${approvedGrants}/${grants.length} ${L('নমুনা', 'sample')}`} />
        <StatTile label={L('মাঠ পরিদর্শন', 'Field Inspections')} value={21870} icon={ClipboardCheck} tone="sky" onClick={() => nav('/inspections')} />
        <StatTile label={L('অপেক্ষমাণ অভিযোগ', 'Pending Complaints')} value={1263} icon={Headset} tone="red" hint={`${openComplaints} ${L('নমুনা', 'sample')}`} onClick={() => nav('/complaints')} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card className="lg:col-span-2">
          <CardHeader title={L('নিবন্ধন, অনুদান ও পরিদর্শন প্রবণতা', 'Registration, grant & inspection trend')} subtitle={L('২০২৬ · মাসভিত্তিক', '2026 · monthly')} />
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{ left: -10, right: 10, top: 5 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f62d9" stopOpacity=".35" /><stop offset="100%" stopColor="#2f62d9" stopOpacity="0" /></linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="institutions" name={L('প্রতিষ্ঠান নিবন্ধন', 'Institution registrations')} stroke="#2f62d9" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="inspections" name={L('পরিদর্শন', 'Inspections')} stroke="#0ea5e9" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="grants" name={L('অনুদান', 'Grants')} stroke="#f59e0b" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={L('প্রতিষ্ঠানের ধরন অনুযায়ী', 'Institutions by type')} subtitle={L('জাতীয় রেজিস্ট্রি', 'National registry')} />
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="#fff">
                  {pie.map((_, i) => <Cell key={i} fill={CHART[i % CHART.length]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => fmtNum(v, lang)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {pie.map((p, i) => (
              <li key={p.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART[i] }} />
                <span className="text-slate-600 bn flex-1">{p.name}</span>
                <span className="font-semibold tabular-nums text-slate-800">{fmtNum(p.value, lang)}</span>
                <span className="text-slate-400 tabular-nums w-10 text-right">{((p.value / totalInst) * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        <Card>
          <CardHeader title={L('হজ ২০২৬ পাইপলাইন', 'Hajj 2026 pipeline')} subtitle={L('প্রাক-নিবন্ধন থেকে গমন', 'Pre-registration to departure')} action={<button className="text-xs text-brand-600 font-semibold inline-flex items-center gap-1" onClick={() => nav('/hajj')}>{t('view')} <ArrowRight size={12} /></button>} />
          <div className="space-y-2.5">
            {hajjPipeline.map((s, i) => (
              <div key={s.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 bn">{L(s.bn, s.stage)}</span>
                  <span className="font-semibold tabular-nums text-slate-800">{fmtNum(s.value, lang)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(s.value / hajjPipeline[0].value) * 100}%`, background: CHART[i % 5] }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title={L('বিভাগভিত্তিক অনুদান', 'Grants by division')} subtitle={L('আবেদন বনাম অনুমোদন · অর্থবছর ২০২৬-২৭', 'Applied vs approved · FY 2026-27')} />
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={grantByDivision.map((g) => ({ ...g, name: lang === 'bn' ? g.division.bn : g.division.en }))} margin={{ left: -15, right: 5 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="applied" name={L('আবেদন', 'Applied')} fill="#adc7f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name={L('অনুমোদিত', 'Approved')} fill="#2f62d9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={L('ওয়াক্‌ফ রাজস্ব', 'Waqf revenue')} subtitle={L('অর্থবছর ২০২৬-২৭ · সংগ্রহ বনাম লক্ষ্য', 'FY 2026-27 · collection vs target')} />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">{L('বার্ষিক রাজস্ব', 'Annual revenue')}</div>
              <div className="text-lg font-bold tabular-nums text-slate-900">৳{lang === 'bn' ? '১৮৪.৫' : '184.5'} <span className="text-xs text-slate-400 font-medium">{L('কোটি', 'Cr')}</span></div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">{L('বকেয়া', 'Arrear')}</div>
              <div className="text-lg font-bold tabular-nums text-red-600">৳{lang === 'bn' ? '১২.৬' : '12.6'} <span className="text-xs text-slate-400 font-medium">{L('কোটি', 'Cr')}</span></div>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            {[
              [L('ডিজিটাইজড সম্পত্তি', 'Properties digitised'), waqfSummary.digitised, waqfSummary.totalRegistered],
              [L('ইজারাভুক্ত', 'Under lease'), waqfSummary.leased, waqfSummary.totalRegistered],
              [L('বিরোধপূর্ণ / মামলাধীন', 'Disputed / litigated'), waqfSummary.disputed, waqfSummary.totalRegistered],
            ].map(([lbl, v, tot]) => (
              <div key={String(lbl)}>
                <div className="flex justify-between mb-1"><span className="text-slate-600 bn">{lbl}</span><span className="font-semibold tabular-nums">{fmtNum(v as number, lang)} <span className="text-slate-400">/ {fmtNum(tot as number, lang)}</span></span></div>
                <Progress value={((v as number) / (tot as number)) * 100} target={60} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title={L('ব্যবস্থা গ্রহণ প্রয়োজন', 'Action required')} subtitle={L('সিস্টেম-উৎপন্ন সতর্কতা', 'System-generated alerts')} />
          <ul className="space-y-2">
            {alerts.map((a, i) => (
              <li key={i} onClick={() => nav(a.to)} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brand-300 hover:shadow-pop cursor-pointer transition">
                <span className={`w-8 h-8 rounded-lg grid place-items-center ${a.tone === 'red' ? 'bg-red-50 text-red-600' : a.tone === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-brand-50 text-brand-600'}`}><AlertTriangle size={15} /></span>
                <span className="text-sm text-slate-700 bn flex-1">{a.text}</span>
                <ArrowRight size={14} className="text-slate-400" />
              </li>
            ))}
          </ul>
        </Card>
        <Card padded={false}>
          <div className="p-5 pb-3"><CardHeader title={L('সাম্প্রতিক কার্যক্রম', 'Recent activity')} subtitle={L('সকল মডিউল', 'All modules')} /></div>
          <ul className="divide-y divide-slate-100">
            {[
              ['GRT-2026-00061', L('অনুদান অনুমোদিত – ৳৩,৫০,০০০', 'Grant approved – ৳3,50,000'), 'Approved', '10:42'],
              ['INS-2026-00057', L('পরিদর্শন সম্পন্ন – দারুস সালাম মসজিদ, কুমিল্লা', 'Inspection completed – Darus Salam Mosque, Cumilla'), 'Completed', '10:15'],
              ['HCT-020291', L('অভিযোগ এসকালেটেড – মেডিকেল, মক্কা', 'Complaint escalated – Medical, Makkah'), 'Escalated', '09:58'],
              ['WQF-DHA-00012', L('নতুন ওয়াক্‌ফ সম্পত্তি ডিজিটাইজড', 'New waqf property digitised'), 'Registered', '09:30'],
              ['MOS-2026-000138', L('নতুন মসজিদ নিবন্ধন আবেদন – সিলেট', 'New mosque registration – Sylhet'), 'Pending', '09:05'],
              ['LSE-2026-0021', L('ইজারা নবায়ন – মেসার্স করিম এন্টারপ্রাইজ', 'Lease renewed – M/s Karim Enterprise'), 'Active', '08:47'],
            ].map(([id, txt, st, tm]) => (
              <li key={id} className="px-5 py-3 flex items-center gap-3">
                <span className="mono-id w-36 shrink-0">{id}</span>
                <span className="text-sm text-slate-700 bn flex-1 truncate">{txt}</span>
                <Badge>{st}</Badge>
                <span className="text-xs text-slate-400 tabular-nums">{tm}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
