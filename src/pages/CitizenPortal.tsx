import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Building2, HandCoins, FileText, Landmark, Plane, Headset, ClipboardList, Download, ArrowRight, Database, Phone, CheckCircle2, Clock } from 'lucide-react'
import { useLang, fmtNum } from '../i18n'
import { LangToggle } from '../components/Shell'
import { Badge, Stepper, KV } from '../components/ui'
import { nationalInstitutionStats, hajjSummary, waqfSummary, grants, institutions } from '../data/mock'

export default function CitizenPortal() {
  const { t, L, lang } = useLang()
  const [track, setTrack] = useState('')
  const [result, setResult] = useState<typeof grants[number] | null>(null)
  const services = [
    { icon: Building2, bn: 'প্রতিষ্ঠান নিবন্ধন', en: 'Institution registration', d: L('নতুন মসজিদ/মন্দির/গির্জা/বিহার/মাদ্রাসা নিবন্ধন আবেদন', 'Apply to register a mosque, temple, church, vihara or madrasa') },
    { icon: FileText, bn: 'তথ্য হালনাগাদ', en: 'Information update', d: L('কমিটি, জনবল, ভবন বা যোগাযোগ তথ্য পরিবর্তন', 'Update committee, personnel, building or contact details') },
    { icon: HandCoins, bn: 'অনুদান আবেদন', en: 'Grant application', d: L('সংস্কার, নির্মাণ বা দুর্যোগ ক্ষতির জন্য সরকারি অনুদান', 'Government grants for repair, construction or disaster damage') },
    { icon: ClipboardList, bn: 'সনদ / প্রত্যয়ন', en: 'Certificate / attestation', d: L('নিবন্ধন সনদ, প্রত্যয়নপত্র ও অনাপত্তিপত্র', 'Registration certificate, attestation and NOC') },
    { icon: Landmark, bn: 'ওয়াক্‌ফ সেবা', en: 'Waqf services', d: L('ওয়াক্‌ফ তালিকাভুক্তি, ইজারা আবেদন ও ভাড়া পরিশোধ', 'Waqf enrolment, lease application and rent payment') },
    { icon: Plane, bn: 'হজ সেবা', en: 'Hajj services', d: L('প্রাক-নিবন্ধন, নিবন্ধন, পেমেন্ট ও অবস্থা যাচাই', 'Pre-registration, registration, payment and status check') },
    { icon: Headset, bn: 'অভিযোগ', en: 'Complaint', d: L('যে কোনো সেবা সম্পর্কে অভিযোগ দাখিল ও ট্র্যাক', 'Lodge and track a complaint about any service') },
    { icon: Download, bn: 'নথি ডাউনলোড', en: 'Document download', d: L('অনুমোদনপত্র, সনদ ও রসিদ ডাউনলোড', 'Download approval letters, certificates and receipts') },
  ]
  const doTrack = () => { const g = grants.find((x) => x.id.toLowerCase() === track.trim().toLowerCase()) ?? grants[5]; setResult(g) }

  return (
    <div className="min-h-full bg-[#f4f6f9] flex flex-col">
      <header className="sticky top-0 z-30 bg-[#0a1530] text-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center"><Database size={18} /></div><div className="leading-tight"><div className="font-bold tracking-tight">NRA<span className="text-brand-300">MS</span> <span className="text-slate-400 font-normal text-sm bn">{t('citizenPortal')}</span></div><div className="text-[10.5px] text-slate-400 bn">{t('ministry')}</div></div></div>
          <div className="hidden md:flex flex-1 max-w-xl mx-auto items-center gap-2 bg-white/10 border border-white/15 rounded-lg px-3 py-2 focus-within:bg-white focus-within:text-slate-800 transition"><Search size={15} /><input className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400 bn" placeholder={L('সেবা, প্রতিষ্ঠান বা আবেদন নং খুঁজুন', 'Search a service, institution or application no.')} /></div>
          <div className="ml-auto flex items-center gap-3"><LangToggle dark /><Link to="/login" className="text-xs font-semibold text-brand-300 hover:text-white bn">{t('officerLogin')} →</Link></div>
        </div>
        <div className="bg-[#0d1b3d]"><div className="max-w-7xl mx-auto px-4 h-10 flex items-center gap-1 text-xs overflow-x-auto">{[L('হোম', 'Home'), L('প্রতিষ্ঠান', 'Institutions'), L('অনুদান', 'Grants'), L('হজ', 'Hajj'), L('ওয়াক্‌ফ', 'Waqf'), L('ধর্মীয় শিক্ষা', 'Education'), L('অভিযোগ', 'Complaints'), L('নোটিশ', 'Notices'), L('যোগাযোগ', 'Contact')].map((x, i) => <a key={x} href="#" className={`px-3 py-1.5 rounded-md whitespace-nowrap bn ${i === 0 ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white'}`}>{x}</a>)}</div></div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <section className="rounded-2xl text-white p-8 lg:p-10 relative overflow-hidden mb-6" style={{ background: 'radial-gradient(700px 300px at 10% 0%, rgba(38,84,196,.55), transparent 60%), linear-gradient(120deg, #0b1633, #14306b)' }}>
          <div className="relative grid lg:grid-cols-2 gap-6 items-center">
            <div><div className="kicker !text-brand-300 mb-2">{L('ডিজিটাল ধর্ম বিষয়ক নাগরিক পোর্টাল', 'Digital Religious Affairs Citizen Portal')}</div><h1 className="text-[30px] leading-[1.15] font-bold tracking-tight bn">{L('ঘরে বসেই ধর্মীয় প্রতিষ্ঠান, অনুদান, হজ ও ওয়াক্‌ফ সেবা', 'Institution, grant, Hajj and waqf services — from home')}</h1><p className="mt-3 text-slate-300 text-sm bn">{L('আবেদন করুন, অবস্থা ট্র্যাক করুন, নথি ডাউনলোড করুন — অফিসে না গিয়েই।', 'Apply, track status and download documents without visiting an office.')}</p>
              <div className="mt-5 flex gap-2"><a href="#services" className="btn-primary bn">{L('সেবা দেখুন', 'Browse services')} <ArrowRight size={15} /></a><a href="#track" className="btn bg-white/10 border border-white/15 text-white hover:bg-white/20 bn">{L('আবেদন ট্র্যাক', 'Track application')}</a></div></div>
            <div className="grid grid-cols-2 gap-3">{[[L('নিবন্ধিত প্রতিষ্ঠান', 'Registered institutions'), Object.values(nationalInstitutionStats).reduce((a, b) => a + b, 0)], [L('হজযাত্রী ২০২৬', 'Pilgrims 2026'), hajjSummary.registered], [L('ওয়াক্‌ফ সম্পত্তি', 'Waqf properties'), waqfSummary.totalRegistered], [L('অনুদান অনুমোদিত (২০২৬)', 'Grants approved (2026)'), 8412]].map(([k, v]) => <div key={String(k)} className="rounded-xl bg-white/[.06] border border-white/10 backdrop-blur p-4"><div className="text-[11px] text-slate-400 bn">{k}</div><div className="text-2xl font-bold tabular-nums">{fmtNum(v as number, lang)}</div></div>)}</div>
          </div>
        </section>

        <section id="services" className="mb-8">
          <div className="flex items-end justify-between mb-3"><div><div className="kicker">{L('মডিউল ১৬', 'MODULE 16')}</div><h2 className="text-xl font-bold text-slate-900 bn">{L('নাগরিক ও প্রতিষ্ঠানের সেবা', 'Services for citizens & institutions')}</h2></div></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{services.map((s) => <a key={s.en} href="#" className="card p-4 hover:shadow-pop hover:border-brand-300 transition group"><span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 grid place-items-center mb-3 group-hover:bg-brand-500 group-hover:text-white transition"><s.icon size={18} /></span><div className="font-semibold text-sm bn">{L(s.bn, s.en)}</div><div className="text-xs text-slate-500 mt-1 bn">{s.d}</div></a>)}</div>
        </section>

        <section id="track" className="grid lg:grid-cols-2 gap-4 mb-8">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 bn">{L('আবেদন ট্র্যাক করুন', 'Track your application')}</h3><p className="text-xs text-slate-500 mt-0.5 bn">{L('আবেদন নং লিখুন (যেমন GRT-2026-00006) — SMS-এ প্রাপ্ত', 'Enter the application no. (e.g. GRT-2026-00006) received by SMS')}</p>
            <div className="flex gap-2 mt-3"><input className="input font-mono" placeholder="GRT-2026-00006" value={track} onChange={(e) => setTrack(e.target.value)} /><button className="btn-primary" onClick={doTrack}>{L('ট্র্যাক', 'Track')}</button></div>
            {result && (<div className="mt-4 rounded-lg border border-slate-200 p-4 animate-fadeUp"><div className="flex items-center justify-between mb-3"><span className="mono-id text-sm">{result.id}</span><Badge>{result.status}</Badge></div><div className="mb-3 overflow-x-auto"><Stepper steps={[L('আবেদন', 'Applied'), L('যাচাই', 'Verified'), L('অনুমোদন', 'Approved'), L('বরাদ্দ', 'Allocated'), L('পরিশোধ', 'Paid')]} current={Math.min(4, ['Application', 'Verification', 'Approval', 'Fund Allocation', 'Payment', 'Utilization', 'Monitoring'].indexOf(result.stage))} /></div><KV k={L('প্রতিষ্ঠান', 'Institution')} v={<span className="bn">{L(result.institution.nameBn, result.institution.nameEn)}</span>} /><KV k={L('উদ্দেশ্য', 'Purpose')} v={<span className="bn">{L(result.purposeBn, result.purposeEn)}</span>} /><KV k={L('আবেদিত অর্থ', 'Requested')} v={`৳${fmtNum(result.requested, lang)}`} /></div>)}
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 bn">{L('প্রতিষ্ঠান যাচাই', 'Verify an institution')}</h3><p className="text-xs text-slate-500 mt-0.5 bn">{L('Institution ID বা QR স্ক্যান করে নিবন্ধন যাচাই করুন', 'Verify registration by Institution ID or QR scan')}</p>
            <div className="flex gap-2 mt-3"><input className="input font-mono" defaultValue={institutions[0].id} /><button className="btn-secondary">{L('যাচাই', 'Verify')}</button></div>
            <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3"><CheckCircle2 className="text-emerald-600 shrink-0" size={20} /><div><div className="font-semibold text-emerald-800 text-sm bn">{L('নিবন্ধিত ও সক্রিয়', 'Registered & active')}</div><div className="text-xs text-emerald-700 bn mt-0.5">{L(institutions[0].nameBn, institutions[0].nameEn)} · {L(institutions[0].district.bn, institutions[0].district.en)}</div><div className="mono-id mt-1">{institutions[0].id}</div></div></div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-4">
          <div className="card p-5 lg:col-span-2"><h3 className="font-semibold text-slate-900 mb-3 bn">{L('নোটিশ ও ঘোষণা', 'Notices & announcements')}</h3><ul className="divide-y divide-slate-100">{[[L('হজ ২০২৭ প্রাক-নিবন্ধন ১৫ অক্টোবর থেকে শুরু', 'Hajj 2027 pre-registration opens 15 October'), '2026-09-20'], [L('অর্থবছর ২০২৬-২৭ অনুদান আবেদনের শেষ তারিখ ৩০ নভেম্বর', 'FY 2026-27 grant applications close 30 November'), '2026-09-15'], [L('ওয়াক্‌ফ সম্পত্তি ডিজিটাইজেশন — ইজারাদারদের তথ্য হালনাগাদের আহ্বান', 'Waqf digitisation — lessees asked to update records'), '2026-09-10'], [L('শারদীয় দুর্গাপূজা ২০২৬ উপলক্ষে অনুদান বিতরণ সূচি', 'Durga Puja 2026 grant disbursement schedule'), '2026-09-05']].map(([n, d]) => <li key={String(n)} className="py-2.5 flex items-center gap-3 text-sm"><Clock size={14} className="text-slate-400 shrink-0" /><span className="bn flex-1">{n}</span><span className="text-xs text-slate-400 tabular-nums">{d}</span></li>)}</ul></div>
          <div className="card p-5"><h3 className="font-semibold text-slate-900 mb-3 bn">{L('সহায়তা', 'Help')}</h3><div className="space-y-3 text-sm">{[[Phone, L('হজ হেল্পলাইন', 'Hajj helpline'), '16136'], [Phone, L('সাধারণ সেবা', 'General services'), '333'], [Headset, L('অনলাইন অভিযোগ (GRS)', 'Online complaint (GRS)'), 'grs.gov.bd']].map(([I, k, v], i) => { const Icon = I as typeof Phone; return <div key={i} className="flex items-center gap-3"><span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center"><Icon size={16} /></span><div><div className="text-xs text-slate-500 bn">{k as string}</div><div className="font-semibold tabular-nums">{v as string}</div></div></div> })}</div></div>
        </section>
      </main>
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-400 bn">{t('govt')} · {t('ministry')} · © 2026 NRAMS</footer>
    </div>
  )
}
