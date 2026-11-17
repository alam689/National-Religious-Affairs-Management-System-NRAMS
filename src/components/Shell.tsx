import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Building2, HandCoins, ClipboardCheck, Map, Users, Plane, GraduationCap, Headset, Landmark, FileSignature,
  BookOpen, UserSquare2, Fingerprint, CalendarDays, Gift, Sparkles, Route, Search, Bell, Globe, LogOut, Menu, X, ChevronDown, Database, type LucideIcon,
} from 'lucide-react'
import { useLang, type TKey } from '../i18n'
import { signOut } from '../auth'

type Item = { to: string; k: TKey; icon: LucideIcon; phase: 1 | 2 | 3 }
type Group = { k: TKey; items: Item[] }

export const navGroups: Group[] = [
  { k: 'gOverview', items: [{ to: '/', k: 'dashboard', icon: LayoutDashboard, phase: 1 }] },
  { k: 'gInstitutions', items: [
    { to: '/institutions', k: 'institutions', icon: Building2, phase: 1 },
    { to: '/grants', k: 'grants', icon: HandCoins, phase: 1 },
    { to: '/inspections', k: 'inspections', icon: ClipboardCheck, phase: 1 },
    { to: '/gis', k: 'gis', icon: Map, phase: 3 },
  ] },
  { k: 'gHajj', items: [
    { to: '/hajj', k: 'hajj', icon: Users, phase: 2 },
    { to: '/hajj/operations', k: 'hajjOps', icon: Plane, phase: 2 },
    { to: '/hajj/training', k: 'hajjTraining', icon: GraduationCap, phase: 2 },
    { to: '/complaints', k: 'complaints', icon: Headset, phase: 2 },
  ] },
  { k: 'gWaqf', items: [
    { to: '/waqf', k: 'waqf', icon: Landmark, phase: 3 },
    { to: '/waqf/leases', k: 'lease', icon: FileSignature, phase: 3 },
  ] },
  { k: 'gPeople', items: [
    { to: '/education', k: 'education', icon: BookOpen, phase: 2 },
    { to: '/personnel', k: 'personnel', icon: UserSquare2, phase: 1 },
    { to: '/hrms', k: 'hrms', icon: Fingerprint, phase: 1 },
  ] },
  { k: 'gServices', items: [
    { to: '/events', k: 'events', icon: CalendarDays, phase: 2 },
    { to: '/assistance', k: 'assistance', icon: Gift, phase: 2 },
  ] },
  { k: 'gSystem', items: [
    { to: '/analytics', k: 'analytics', icon: Sparkles, phase: 3 },
    { to: '/roadmap', k: 'roadmap', icon: Route, phase: 1 },
  ] },
]

export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center shadow-sm shrink-0">
        <Database size={18} className="text-white" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-bold text-[15px] text-white tracking-tight">NRA<span className="text-brand-300">MS</span></div>
          <div className="text-[10.5px] text-slate-400 bn truncate max-w-[180px]">{t('ministry')}</div>
        </div>
      )}
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLang()
  return (
    <aside className="w-[264px] h-full bg-[#0a1530] text-slate-300 flex flex-col">
      <div className="h-16 px-4 flex items-center border-b border-white/10 shrink-0"><Logo /></div>
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((g) => (
          <div key={g.k}>
            <div className="px-2.5 mb-1.5 text-[10.5px] uppercase tracking-[.14em] text-slate-500 font-semibold bn">{t(g.k)}</div>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.to}>
                  <NavLink to={it.to} end={it.to === '/'} onClick={onNavigate}
                    className={({ isActive }) => `flex items-center gap-2.5 px-2.5 py-2 text-[13.5px] rounded-lg transition bn ${isActive ? 'bg-brand-500/20 text-white shadow-[inset_2px_0_0_0_#4f83e6]' : 'hover:bg-white/5 hover:text-white'}`}>
                    <it.icon size={16} className="shrink-0 opacity-90" />
                    <span className="truncate">{t(it.k)}</span>
                    <span className={`ml-auto text-[9.5px] font-bold px-1.5 rounded-full ${it.phase === 1 ? 'bg-emerald-500/20 text-emerald-300' : it.phase === 2 ? 'bg-amber-500/20 text-amber-300' : 'bg-violet-500/20 text-violet-300'}`}>P{it.phase}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 text-[10.5px] text-slate-500 bn">
        {t('govt')}<br />v0.1 · Prototype
      </div>
    </aside>
  )
}

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`inline-flex rounded-lg p-0.5 text-xs font-semibold ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
      {(['bn', 'en'] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1 rounded-md transition ${lang === l ? 'bg-brand-500 text-white shadow-sm' : dark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          {l === 'bn' ? 'বাং' : 'EN'}
        </button>
      ))}
    </div>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { t, L } = useLang()
  const nav = useNavigate()
  const [notif, setNotif] = useState(false)
  const notes = [
    L('১২টি অনুদান আবেদন যাচাইয়ের অপেক্ষায়', '12 grant applications awaiting verification'),
    L('হজ ফ্লাইট BG-3008 বোর্ডিং শুরু', 'Hajj flight BG-3008 boarding started'),
    L('৭টি ওয়াক্‌ফ ইজারা এই মাসে মেয়াদোত্তীর্ণ হবে', '7 waqf leases expire this month'),
    L('৩টি উচ্চ-অগ্রাধিকার অভিযোগ SLA অতিক্রম করেছে', '3 high-priority complaints breached SLA'),
  ]
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6 shrink-0 no-print">
      <button className="lg:hidden btn-ghost p-2" onClick={onMenu}><Menu size={18} /></button>
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 w-full max-w-md focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200 transition">
        <Search size={15} className="text-slate-400" />
        <input placeholder={L('প্রতিষ্ঠান, হজযাত্রী, ওয়াক্‌ফ ID খুঁজুন…', 'Search institution, pilgrim, waqf ID…')} className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400 bn" />
        <kbd className="text-[10px] text-slate-400 border border-slate-200 rounded px-1">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="hidden sm:inline-flex badge bg-brand-50 text-brand-700 bn">{t('workspace')}: {L('মন্ত্রণালয় সচিবালয়', 'Ministry HQ')}</span>
        <LangToggle />
        <div className="relative">
          <button className="btn-ghost p-2 relative" onClick={() => setNotif((v) => !v)}>
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          {notif && (
            <div className="absolute right-0 mt-2 w-80 card shadow-pop p-2 z-40 animate-fadeUp">
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{L('বিজ্ঞপ্তি', 'Notifications')}</div>
              {notes.map((n, i) => <div key={i} className="px-2 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 bn">{n}</div>)}
            </div>
          )}
        </div>
        <button className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:bg-slate-50 rounded-lg pr-2 py-1" onClick={() => { signOut(); nav('/login') }} title={t('logout')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white grid place-items-center text-xs font-bold">MR</div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-sm font-semibold text-slate-800 bn">{L('মোঃ রেজাউল করিম', 'Md. Rezaul Karim')}</div>
            <div className="text-[11px] text-slate-500 bn">{L('যুগ্মসচিব (উন্নয়ন)', 'Joint Secretary (Dev)')}</div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  )
}

export default function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  return (
    <div className="h-full flex">
      <div className="hidden lg:block h-full shrink-0 no-print"><Sidebar /></div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 animate-fadeUp"><Sidebar onNavigate={() => setOpen(false)} /></div>
          <button className="absolute top-4 left-[276px] text-white" onClick={() => setOpen(false)}><X /></button>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div key={loc.pathname} className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 pb-24">{children}</div>
        </main>
      </div>
    </div>
  )
}

export { Globe, LogOut }
