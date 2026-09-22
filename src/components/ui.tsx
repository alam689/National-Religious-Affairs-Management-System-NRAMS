import { useEffect, type ReactNode } from 'react'
import { X, Inbox, type LucideIcon } from 'lucide-react'
import { useLang, fmtNum } from '../i18n'

export type Tone = 'brand' | 'emerald' | 'amber' | 'red' | 'violet' | 'sky' | 'slate'

export const toneSoft: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  violet: 'bg-violet-50 text-violet-700',
  sky: 'bg-sky-50 text-sky-700',
  slate: 'bg-slate-100 text-slate-700',
}
export const toneIcon: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-600',
  sky: 'bg-sky-50 text-sky-600',
  slate: 'bg-slate-100 text-slate-600',
}
export const toneSolid: Record<Tone, string> = {
  brand: 'bg-brand-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500', violet: 'bg-violet-500', sky: 'bg-sky-500', slate: 'bg-slate-400',
}

/** Map any status string to a semantic tone. */
export function statusTone(s: string): Tone {
  const k = s.toLowerCase()
  if (/(active|approved|present|delivered|resolved|completed|verified|paid|disbursed|passed|confirmed|utilized|registered)/.test(k)) return 'emerald'
  if (/(pending|late|expiring|review|awaiting|due|partial|scheduled|assigned|training)/.test(k)) return 'amber'
  if (/(rejected|absent|expired|overdue|critical|high|arrear|disputed|cancel|fail|emergency|escalat)/.test(k)) return 'red'
  if (/(open|ongoing|progress|transfer|info|in-progress|verification|allocated|boarded)/.test(k)) return 'brand'
  if (/(leave|distribut|special|leased)/.test(k)) return 'violet'
  if (/(tour|inspect|field)/.test(k)) return 'sky'
  return 'slate'
}

export function Card({ children, className = '', padded = true, hover = false }: { children: ReactNode; className?: string; padded?: boolean; hover?: boolean }) {
  return <div className={`card ${padded ? 'p-5' : ''} ${hover ? 'transition hover:shadow-pop hover:border-brand-300' : ''} ${className}`}>{children}</div>
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Badge({ children, tone, className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  const t = tone ?? statusTone(String(children))
  return <span className={`badge ${toneSoft[t]} ${className}`}>{children}</span>
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return <Badge tone={statusTone(status)}>{label ?? status}</Badge>
}

export function PageHeader({ kicker, title, subtitle, actions }: { kicker: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6 animate-fadeUp">
      <div>
        <div className="kicker mb-1">{kicker}</div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 no-print">{actions}</div>}
    </div>
  )
}

export function StatTile({ label, value, icon: Icon, tone = 'brand', hint, unit, onClick, delta }: {
  label: string; value: string | number; icon: LucideIcon; tone?: Tone; hint?: string; unit?: string; onClick?: () => void; delta?: { v: number; label?: string }
}) {
  const { lang } = useLang()
  const v = typeof value === 'number' ? fmtNum(value, lang) : value
  return (
    <div onClick={onClick} className={`card p-4 ${onClick ? 'cursor-pointer transition hover:shadow-pop hover:border-brand-300' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-semibold text-slate-500 leading-snug">{label}</div>
        <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${toneIcon[tone]}`}><Icon size={16} /></div>
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
        {v}{unit && <span className="text-sm font-medium text-slate-400 ml-1">{unit}</span>}
      </div>
      {(hint || delta) && (
        <div className="mt-1 flex items-center gap-2 text-xs">
          {delta && <span className={`font-semibold tabular-nums ${delta.v >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{delta.v >= 0 ? '▲' : '▼'} {Math.abs(delta.v)}%</span>}
          {hint && <span className="text-slate-500">{hint}</span>}
        </div>
      )}
    </div>
  )
}

export function Progress({ value, target = 100, className = '' }: { value: number; target?: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= target ? 'bg-emerald-500' : pct >= target * 0.6 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className={`h-1.5 rounded-full bg-slate-100 overflow-hidden ${className}`}>
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function EmptyState({ text }: { text?: string }) {
  const { t } = useLang()
  return (
    <div className="py-14 text-center text-slate-400">
      <Inbox className="mx-auto mb-2" size={28} />
      <div className="text-sm">{text ?? t('noData')}</div>
    </div>
  )
}

export type Column<T> = { key: string; header: ReactNode; render?: (row: T) => ReactNode; align?: 'left' | 'right' | 'center'; className?: string }

export function Table<T extends { id?: string | number }>({ columns, rows, onRowClick, emptyText }: { columns: Column<T>[]; rows: T[]; onRowClick?: (r: T) => void; emptyText?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>{columns.map((c) => <th key={c.key} className={`th ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}`}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length}><EmptyState text={emptyText} /></td></tr>
          ) : rows.map((r, i) => (
            <tr key={(r.id as string) ?? i} onClick={onRowClick ? () => onRowClick(r) : undefined} className={`${onRowClick ? 'cursor-pointer' : ''} hover:bg-brand-50/40 transition`}>
              {columns.map((c) => (
                <td key={c.key} className={`td ${c.align === 'right' ? 'text-right tabular-nums' : c.align === 'center' ? 'text-center' : ''} ${c.className ?? ''}`}>
                  {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer, wide = false }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-[2px] flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white rounded-2xl shadow-pop w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} max-h-[90vh] flex flex-col animate-fadeUp`}>
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={16} /></button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { key: T; label: string; count?: number }[]; value: T; onChange: (k: T) => void }) {
  const { lang } = useLang()
  return (
    <div className="flex gap-1 border-b border-slate-200 overflow-x-auto no-print">
      {tabs.map((tb) => (
        <button key={tb.key} onClick={() => onChange(tb.key)}
          className={`px-3.5 py-2.5 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition ${value === tb.key ? 'border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
          {tb.label}
          {tb.count !== undefined && <span className="ml-2 inline-flex px-1.5 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-600 tabular-nums">{fmtNum(tb.count, lang)}</span>}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export function KV({ k, v, mono = false }: { k: string; v: ReactNode; mono?: boolean }) {
  return (
    <div className="py-2 border-b border-slate-100 last:border-0 flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{k}</span>
      <span className={`text-slate-800 font-medium text-right ${mono ? 'mono-id' : ''}`}>{v}</span>
    </div>
  )
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('')
  return (
    <div className="rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white grid place-items-center font-semibold shrink-0" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  )
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => {
        const done = i < current, cur = i === current
        return (
          <li key={s} className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${done ? 'bg-emerald-500 text-white' : cur ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {done ? '✓' : String(i + 1).padStart(2, '0')}
            </span>
            <span className={`text-xs font-semibold ${cur ? 'text-brand-700' : done ? 'text-emerald-700' : 'text-slate-500'}`}>{s}</span>
            {i < steps.length - 1 && <span className={`w-6 h-px ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
          </li>
        )
      })}
    </ol>
  )
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-2 no-print">{children}</div>
}

export function Select({ value, onChange, options, className = '' }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`input !w-auto ${className}`}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

/** Chart palette per design theme */
export const CHART = ['#2f62d9', '#f59e0b', '#10b981', '#8b5cf6', '#0ea5e9', '#ef4444', '#94a3b8']
export const chartTooltipStyle = { borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 12px 40px rgba(10,23,48,.12)', fontSize: 12 }
