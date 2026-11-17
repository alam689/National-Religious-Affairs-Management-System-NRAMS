import { CheckCircle2, Circle, Clock, Database, Building2, Plane, Landmark, Globe, Smartphone, Users, Map, Sparkles } from 'lucide-react'
import { useLang } from '../i18n'
import { PageHeader, Card, CardHeader, Badge, Progress } from '../components/ui'

const phases = [
  { n: 1, bn: 'ফেজ ১ — ভিত্তি', en: 'Phase 1 — Foundation', period: '2026–27', tone: 'emerald', progress: 62, items: [['প্রতিষ্ঠান নিবন্ধন', 'Religious Institution Registration', 'done'], ['ডিজিটাল প্রতিষ্ঠান প্রোফাইল', 'Digital Institution Profile', 'done'], ['অনুদান ব্যবস্থাপনা', 'Grant Management', 'progress'], ['পরিদর্শন ব্যবস্থাপনা', 'Inspection Management', 'progress'], ['কর্মচারী উপস্থিতি / HR', 'Employee Attendance / HR', 'progress'], ['কেন্দ্রীয় MIS ড্যাশবোর্ড', 'Central MIS Dashboard', 'done']] },
  { n: 2, bn: 'ফেজ ২ — প্রধান সেবা', en: 'Phase 2 — Major Services', period: '2027–28', tone: 'amber', progress: 18, items: [['হজ ব্যবস্থাপনা', 'Hajj Management', 'progress'], ['হজ প্রশিক্ষণ', 'Hajj Training', 'todo'], ['অভিযোগ ব্যবস্থাপনা', 'Complaint Management', 'todo'], ['ধর্মীয় শিক্ষা ব্যবস্থাপনা', 'Religious Education Management', 'todo']] },
  { n: 3, bn: 'ফেজ ৩ — সম্পদ ও উন্নত ডিজিটালাইজেশন', en: 'Phase 3 — Asset & Advanced Digitalization', period: '2028–29', tone: 'violet', progress: 0, items: [['ওয়াক্‌ফ সম্পত্তি ব্যবস্থাপনা', 'Waqf Property Management', 'todo'], ['ইজারা ও রাজস্ব ব্যবস্থাপনা', 'Lease & Revenue Management', 'todo'], ['GIS ম্যাপিং', 'GIS Mapping', 'todo'], ['নাগরিক পোর্টাল', 'Citizen Portal', 'todo'], ['AI ও অ্যানালিটিক্স', 'AI & Analytics', 'todo']] },
] as const

export default function Roadmap() {
  const { L } = useLang()
  const names = [['National Religious Affairs Management System', 'NRAMS', true], ['National Religious Affairs Digital Transformation Platform', 'NRADTP', false], ['Integrated Religious Affairs Management System', 'IRAMS', false], ['National Religious Affairs Digital Management Platform', 'NRADMP', false], ['Digital Religious Affairs Service Platform', 'DRASP', false], ['Integrated Religious Institutions & Services Platform', 'IRISP', false], ['Bangladesh Religious Affairs Digital Platform', 'BRADP', false], ['e-Religious Affairs Bangladesh', 'e-RAB', false], ['National Religious Institutions & Services Management System', 'NRISMS', false]] as const
  return (
    <div>
      <PageHeader kicker={L('প্রকল্প · ধাপভিত্তিক বাস্তবায়ন ও স্থাপত্য', 'PROJECT · PHASED IMPLEMENTATION & ARCHITECTURE')} title={L('বাস্তবায়ন রোডম্যাপ', 'Implementation Roadmap')}
        subtitle={L('১৮টি স্কোপ এলাকা তিনটি ফেজে — একটি umbrella platform-এর অধীনে', '18 scope areas across three phases — under one umbrella platform')} />

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {phases.map((p) => (
          <Card key={p.n} className="animate-fadeUp" >
            <div className="flex items-start justify-between mb-3"><div><div className="kicker">{p.period}</div><h3 className="font-semibold text-slate-900 bn">{L(p.bn, p.en)}</h3></div><Badge tone={p.tone}>{p.progress}%</Badge></div>
            <Progress value={p.progress} target={100} className="mb-4" />
            <ul className="space-y-2">
              {p.items.map(([bn, en, st], i) => <li key={en} className="flex items-center gap-2 text-sm">{st === 'done' ? <CheckCircle2 size={16} className="text-emerald-500" /> : st === 'progress' ? <Clock size={16} className="text-amber-500" /> : <Circle size={16} className="text-slate-300" />}<span className="text-xs text-slate-400 tabular-nums w-5">{String(i + 1 + (p.n === 1 ? 0 : p.n === 2 ? 6 : 10)).padStart(2, '0')}</span><span className={`bn ${st === 'todo' ? 'text-slate-500' : 'text-slate-800'}`}>{L(bn, en)}</span></li>)}
            </ul>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title={L('Umbrella প্ল্যাটফর্ম স্থাপত্য', 'Umbrella platform architecture')} subtitle={L('সকল মডিউল একটি কেন্দ্রীয় প্ল্যাটফর্ম, একটি ডাটা মডেল ও একটি পরিচয় ব্যবস্থার অধীনে', 'All modules under one central platform, one data model and one identity system')} />
          <div className="flex flex-col items-center gap-2 text-xs font-semibold">
            <div className="px-4 py-2 rounded-lg bg-[#0a1530] text-white bn">{L('ধর্ম বিষয়ক মন্ত্রণালয়', 'Ministry of Religious Affairs')}</div>
            <div className="w-px h-4 bg-slate-300" />
            <div className="px-5 py-2.5 rounded-xl bg-brand-500 text-white flex items-center gap-2 shadow-sm"><Database size={14} /> {L('কেন্দ্রীয় প্ল্যাটফর্ম', 'Central Platform')} <span className="text-brand-200 font-normal">· API · SSO · Master Data</span></div>
            <div className="w-px h-4 bg-slate-300" />
            <div className="grid grid-cols-3 gap-2 w-full">
              {[[Building2, L('ধর্মীয় প্রতিষ্ঠান', 'Religious Institutions'), L('নিবন্ধন · অনুদান · পরিদর্শন · শিক্ষা · জনবল', 'Registry · Grants · Inspection · Education · Personnel')], [Plane, L('হজ ব্যবস্থাপনা', 'Hajj Management'), L('নিবন্ধন · এজেন্সি · ফ্লাইট · প্রশিক্ষণ · অভিযোগ', 'Registration · Agencies · Flights · Training · Complaints')], [Landmark, L('ওয়াক্‌ফ / সম্পদ', 'Waqf / Asset'), L('রেজিস্ট্রি · ইজারা · রাজস্ব · আইনি', 'Registry · Lease · Revenue · Legal')]].map(([I, k, d], i) => { const Icon = I as typeof Building2; return <div key={i} className="rounded-lg border border-brand-200 bg-brand-50 p-3 text-center"><Icon size={16} className="mx-auto text-brand-600 mb-1" /><div className="bn text-brand-800">{k as string}</div><div className="text-[10px] font-normal text-slate-500 mt-1 bn">{d as string}</div></div> })}
            </div>
            <div className="w-px h-4 bg-slate-300" />
            {[[Globe, L('নাগরিক পোর্টাল', 'Citizen Portal')], [Smartphone, L('মোবাইল অ্যাপ (হজযাত্রী · প্রতিষ্ঠান · কর্মকর্তা)', 'Mobile Apps (Pilgrim · Institution · Officer)')], [Users, L('মাঠ কর্মকর্তা', 'Field Officers')]].map(([I, k], i) => { const Icon = I as typeof Globe; return <div key={i} className="contents"><div className="px-4 py-2 rounded-lg border border-slate-200 bg-white flex items-center gap-2 bn"><Icon size={14} className="text-slate-500" /> {k as string}</div>{i < 2 && <div className="w-px h-3 bg-slate-300" />}</div> })}
            <div className="w-px h-4 bg-slate-300" />
            <div className="px-4 py-2 rounded-lg bg-slate-800 text-white flex items-center gap-2"><Map size={14} /> GIS <span className="text-slate-500">+</span> MIS <span className="text-slate-500">+</span> <Sparkles size={14} /> AI</div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader title={L('প্রকল্পের সম্ভাব্য নাম', 'Candidate project names')} subtitle={L('নির্বাচিত নাম: NRAMS — ভবিষ্যতে সকল মডিউল একই umbrella-র অধীনে রাখার জন্য সবচেয়ে flexible', 'Selected name: NRAMS — keeps every future module under one umbrella')} />
            <ul className="space-y-1.5">{names.map(([full, short, rec], i) => <li key={short} className={`flex items-center gap-3 text-sm rounded-lg px-3 py-2 ${rec ? 'bg-brand-50 border border-brand-200' : ''}`}><span className="text-xs text-slate-400 tabular-nums w-4">{i + 1}</span><span className="flex-1 text-slate-700">{full}</span><span className={`font-mono text-xs font-bold ${rec ? 'text-brand-700' : 'text-slate-500'}`}>{short}</span>{rec && <Badge tone="brand">{L('প্রস্তাবিত', 'Recommended')}</Badge>}</li>)}</ul>
          </Card>
          <Card>
            <CardHeader title={L('প্রস্তাবিত প্রযুক্তি স্ট্যাক', 'Proposed technology stack')} />
            <div className="grid grid-cols-2 gap-2 text-xs">{[['Frontend', 'React · TypeScript · Tailwind'], ['Mobile', 'React Native (offline-first)'], ['Backend', 'Node.js / Java microservices · REST + GraphQL'], ['Database', 'PostgreSQL + PostGIS · Redis'], ['GIS', 'OpenStreetMap · BBS shapefiles · GeoServer'], ['Identity', 'NID/BRN integration · SSO · RBAC'], ['Payments', 'ekPay / Sonali Bank / Nagad · bKash'], ['Hosting', 'National Data Centre (BCC) · Bangla.gov.bd'], ['AI', 'Forecasting · anomaly detection · OCR (Bangla)'], ['Interop', 'Hajj (Nusuk) API · e-Nothi · iBAS++ · GRS']].map(([k, v]) => <div key={k} className="rounded-lg bg-slate-50 p-2.5"><div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">{k}</div><div className="text-slate-700 font-medium mt-0.5">{v}</div></div>)}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
