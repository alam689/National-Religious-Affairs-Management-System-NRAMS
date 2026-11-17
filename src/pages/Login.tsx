import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Check, Database, Building2, Plane, Landmark, HandCoins, ClipboardCheck, Users, Map, Globe } from 'lucide-react'
import { useLang } from '../i18n'
import { LangToggle } from '../components/Shell'

const workspaces = [
  { id: 'hq', bn: 'মন্ত্রণালয় সচিবালয়', en: 'Ministry HQ' },
  { id: 'if', bn: 'ইসলামিক ফাউন্ডেশন', en: 'Islamic Foundation' },
  { id: 'hajj', bn: 'হজ অফিস', en: 'Hajj Office' },
  { id: 'waqf', bn: 'ওয়াক্‌ফ প্রশাসন', en: 'Waqf Administration' },
  { id: 'trust', bn: 'ধর্মীয় কল্যাণ ট্রাস্ট', en: 'Religious Welfare Trusts' },
  { id: 'field', bn: 'জেলা/উপজেলা কার্যালয়', en: 'District / Upazila Office' },
]

const chips = [
  { icon: Building2, bn: 'ধর্মীয় প্রতিষ্ঠান', en: 'Institutions', x: 6, y: 18 },
  { icon: HandCoins, bn: 'অনুদান', en: 'Grants', x: 58, y: 12 },
  { icon: Plane, bn: 'হজ', en: 'Hajj', x: 72, y: 34 },
  { icon: Landmark, bn: 'ওয়াক্‌ফ', en: 'Waqf', x: 10, y: 50 },
  { icon: ClipboardCheck, bn: 'পরিদর্শন', en: 'Inspection', x: 66, y: 62 },
  { icon: Users, bn: 'জনবল', en: 'Personnel', x: 14, y: 78 },
  { icon: Map, bn: 'GIS', en: 'GIS', x: 62, y: 84 },
]

export default function Login() {
  const { L, t } = useLang()
  const nav = useNavigate()
  const [ws, setWs] = useState('hq')
  const [email, setEmail] = useState('rezaul.karim')
  const [pw, setPw] = useState('••••••••')

  return (
    <div className="min-h-full grid lg:grid-cols-2">
      {/* Left navy panel */}
      <div className="relative overflow-hidden bg-[#08122b] text-white p-8 lg:p-12 flex flex-col"
        style={{ backgroundImage: 'radial-gradient(600px 400px at 15% 10%, rgba(38,84,196,.55), transparent 60%), radial-gradient(500px 400px at 90% 90%, rgba(47,98,217,.35), transparent 60%)' }}>
        <div className="absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center"><Database size={20} /></div>
            <div>
              <div className="font-bold text-lg tracking-tight">NRA<span className="text-brand-300">MS</span></div>
              <div className="text-[11px] text-slate-400 bn">{t('ministry')}</div>
            </div>
          </div>
          <LangToggle dark />
        </div>
        <div className="relative mt-12 lg:mt-20 max-w-lg">
          <div className="kicker !text-brand-300 mb-3">{L('জাতীয় ধর্ম বিষয়ক ব্যবস্থাপনা সিস্টেম', 'National Religious Affairs Management System')}</div>
          <h1 className="text-[34px] leading-[1.15] font-bold tracking-tight bn">
            {L('ধর্মীয় প্রতিষ্ঠান, হজ, ওয়াক্‌ফ ও কল্যাণ সেবা — একটি সমন্বিত প্ল্যাটফর্মে', 'Institutions, Hajj, Waqf and welfare services — on one integrated platform')}
          </h1>
          <p className="mt-4 text-slate-300 text-sm leading-relaxed bn">
            {L('নিবন্ধন থেকে অনুদান, মাঠ পরিদর্শন থেকে জাতীয় ড্যাশবোর্ড — মন্ত্রণালয় ও অধীনস্থ দপ্তরের সকল কার্যক্রম এক জায়গায়।', 'From registration to grants, field inspection to the national dashboard — every ministry and agency workflow in one place.')}
          </p>
        </div>
        {/* Floating chips converging to DB */}
        <div className="relative flex-1 mt-8 min-h-[280px] hidden md:block">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {chips.map((c, i) => (
              <line key={i} x1={c.x + 10} y1={c.y + 4} x2={50} y2={50} stroke="rgba(126,166,240,.35)" strokeWidth=".3" strokeDasharray="1.5 1.5" className="animate-dash" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </svg>
          {chips.map((c, i) => (
            <div key={i} className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[.06] border border-white/10 backdrop-blur text-xs font-semibold animate-float bn" style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${i * 0.6}s` }}>
              <c.icon size={13} className="text-brand-300" />{L(c.bn, c.en)}
            </div>
          ))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center shadow-pop">
              <span className="absolute inset-0 rounded-2xl border-2 border-brand-300 animate-pulseRing" />
              <Database size={26} />
            </div>
          </div>
        </div>
        <div className="relative text-[11px] text-slate-500 bn mt-6">{t('govt')} · {L('সকল তথ্য সরকারি তথ্য সুরক্ষা নীতিমালা অনুসারে সংরক্ষিত', 'All data is protected under Government data security policy')}</div>
      </div>

      {/* Right panel */}
      <div className="bg-[#eef2f7] p-6 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-4">
          <div className="card p-5 animate-fadeUp">
            <div className="kicker mb-1">{L('ধাপ ০১', 'Step 01')}</div>
            <h2 className="font-semibold text-slate-900 mb-3 bn">{L('কর্মক্ষেত্র নির্বাচন করুন', 'Select your workspace')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {workspaces.map((w) => (
                <button key={w.id} onClick={() => setWs(w.id)}
                  className={`relative text-left rounded-lg border px-3 py-2.5 text-sm transition bn ${ws === w.id ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100 text-brand-700 font-semibold' : 'border-slate-200 hover:border-brand-300 text-slate-700'}`}>
                  {L(w.bn, w.en)}
                  {ws === w.id && <Check size={14} className="absolute top-2 right-2 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-5 animate-fadeUp" style={{ animationDelay: '.1s' }}>
            <div className="kicker mb-1">{L('ধাপ ০২', 'Step 02')}</div>
            <h2 className="font-semibold text-slate-900 mb-3 bn">{t('officerLogin')}</h2>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); nav('/') }}>
              <div>
                <label className="label bn">{L('অফিসিয়াল ই-মেইল', 'Official e-mail')}</label>
                <div className="flex">
                  <input className="input rounded-r-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-200 bg-slate-100 text-xs text-slate-500">@mora.gov.bd</span>
                </div>
              </div>
              <div>
                <label className="label bn">{L('পাসওয়ার্ড', 'Password')}</label>
                <input type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 bn"><input type="checkbox" className="rounded" defaultChecked /> {L('আমাকে মনে রাখুন', 'Remember me')}</label>
                <a className="text-brand-600 font-semibold hover:underline bn" href="#">{L('পাসওয়ার্ড ভুলে গেছেন?', 'Forgot password?')}</a>
              </div>
              <button className="btn-primary w-full bn">{L('সাইন ইন', 'Sign in')} <ArrowRight size={16} /></button>
            </form>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span className="bn">{L('আপনি নাগরিক বা প্রতিষ্ঠান?', 'Citizen or institution?')}</span>
              <Link to="/portal" className="inline-flex items-center gap-1 text-brand-600 font-semibold hover:underline bn"><Globe size={13} /> {t('citizenPortal')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
