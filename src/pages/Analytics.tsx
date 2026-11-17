import { useState } from 'react'
import { Sparkles, TrendingUp, ShieldAlert, Landmark, ClipboardCheck, MessageSquare, ScanText, Bot, Send, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from 'recharts'
import { useLang, fmtNum } from '../i18n'
import { PageHeader, Card, CardHeader, Badge, chartTooltipStyle, toneIcon, type Tone } from '../components/ui'
import { grants, inspections } from '../data/mock'

const forecast = ['2022', '2023', '2024', '2025', '2026', '2027', '2028'].map((y, i) => ({ y, actual: i < 5 ? [57000, 122000, 85000, 87000, 83452][i] : undefined, forecast: i >= 4 ? [83452, 91000, 98500][i - 4] : undefined, lo: i >= 4 ? [83452, 86000, 90000][i - 4] : undefined, hi: i >= 4 ? [83452, 96000, 107000][i - 4] : undefined }))

export default function Analytics() {
  const { t, L, lang } = useLang()
  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([
    { me: true, text: L('রাজশাহী বিভাগে গত ৩ মাসে কতটি অনুদান অনুমোদিত হয়েছে?', 'How many grants were approved in Rajshahi division in the last 3 months?') },
    { me: false, text: L('রাজশাহী বিভাগে জুলাই–সেপ্টেম্বর ২০২৬-এ ৪১২টি অনুদান অনুমোদিত হয়েছে (মোট ৳৮.৪ কোটি)। গত বছরের তুলনায় ১২% বেশি। বিস্তারিত দেখতে অনুদান মডিউলে ফিল্টার প্রয়োগ করা হয়েছে।', 'In Rajshahi division 412 grants were approved in Jul–Sep 2026 (৳8.4 crore total), 12% above last year. The grant module filter has been prepared for you.') },
  ])
  const [input, setInput] = useState('')
  const anomalies = grants.filter((g) => g.approved && g.approved > g.requested * 0.95).slice(0, 5)
  const risk = inspections.filter((i) => i.status !== 'Scheduled').map((i) => ({ x: i.score, y: i.issues.length + (i.institution.grantsReceived / 2), z: i.institution.capacity, name: L(i.institution.nameBn, i.institution.nameEn), risk: i.score < 65 && i.issues.length >= 2 }))
  const useCases: { icon: typeof Sparkles; tone: Tone; bn: string; en: string; descBn: string; descEn: string }[] = [
    { icon: TrendingUp, tone: 'brand', bn: 'হজ চাহিদা পূর্বাভাস', en: 'Hajj demand forecasting', descBn: 'প্রাক-নিবন্ধন প্রবণতা, প্যাকেজ মূল্য ও কোটা থেকে পরবর্তী বছরের চাহিদা অনুমান', descEn: 'Predict next-year demand from pre-registration trend, package price and quota' },
    { icon: ShieldAlert, tone: 'red', bn: 'অনুদান অসঙ্গতি শনাক্তকরণ', en: 'Grant anomaly detection', descBn: 'অস্বাভাবিক অনুমোদন হার, পুনরাবৃত্ত আবেদন ও UC বিলম্ব চিহ্নিত করা', descEn: 'Flag unusual approval ratios, repeat applications and delayed UCs' },
    { icon: Landmark, tone: 'violet', bn: 'ওয়াক্‌ফ রাজস্ব পূর্বাভাস ও ব্যবহার বিশ্লেষণ', en: 'Waqf revenue forecast & utilisation', descBn: 'বাজার ভাড়ার তুলনায় কম ভাড়া ও অব্যবহৃত সম্পত্তি চিহ্নিত করা', descEn: 'Spot below-market rents and under-utilised properties' },
    { icon: ClipboardCheck, tone: 'sky', bn: 'পরিদর্শন ঝুঁকি অগ্রাধিকার', en: 'Inspection risk prioritisation', descBn: 'পূর্বের স্কোর, সমস্যা ও অনুদানের ভিত্তিতে কোন প্রতিষ্ঠান আগে পরিদর্শন করা উচিত', descEn: 'Rank institutions to inspect first from prior scores, issues and grants' },
    { icon: MessageSquare, tone: 'amber', bn: 'অভিযোগ প্রবণতা বিশ্লেষণ', en: 'Complaint trend analysis', descBn: 'এজেন্সি/হোটেল/রুটভিত্তিক পুনরাবৃত্ত সমস্যা ও SLA ঝুঁকি', descEn: 'Recurring issues by agency/hotel/route and SLA risk' },
    { icon: ScanText, tone: 'emerald', bn: 'নথি OCR', en: 'Document OCR', descBn: 'ওয়াক্‌ফ দলিল, খতিয়ান ও UC থেকে স্বয়ংক্রিয় তথ্য আহরণ', descEn: 'Extract data automatically from waqf deeds, khatians and UCs' },
  ]

  return (
    <div>
      <PageHeader kicker={L('মডিউল ১৮ · AI / অ্যাডভান্সড অ্যানালিটিক্স — ফেজ ৩', 'MODULE 18 · AI / ADVANCED ANALYTICS — PHASE 3')} title={t('analytics')}
        subtitle={L('প্রশাসনিক ও সেবা অটোমেশনে AI — ধর্মীয় বিষয়বস্তু বা ব্যাখ্যায় AI সিদ্ধান্ত গ্রহণ করবে না', 'AI for administrative and service automation — never for religious content or interpretation')} />

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5 flex items-start gap-3 text-sm text-amber-800">
        <Info size={18} className="shrink-0 mt-0.5" />
        <span className="bn">{L('নীতিগত সীমা: AI শুধুমাত্র প্রশাসনিক পূর্বাভাস, অসঙ্গতি শনাক্তকরণ, অগ্রাধিকার নির্ধারণ ও নথি প্রক্রিয়াকরণে ব্যবহৃত হবে। সকল সুপারিশ human-in-the-loop অনুমোদন সাপেক্ষ; কোনো ধর্মীয় ব্যাখ্যা, ফতোয়া বা আচার-বিষয়ক সিদ্ধান্তে AI ব্যবহার হবে না।', 'Policy boundary: AI is used only for administrative forecasting, anomaly detection, prioritisation and document processing. Every recommendation requires human-in-the-loop approval; AI is never applied to religious interpretation, rulings or ritual decisions.')}</span>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
        {useCases.map((u) => <div key={u.en} className="card p-4 flex gap-3 hover:shadow-pop hover:border-brand-300 transition"><span className={`w-10 h-10 rounded-lg grid place-items-center shrink-0 ${toneIcon[u.tone]}`}><u.icon size={18} /></span><div><div className="font-semibold text-sm bn">{L(u.bn, u.en)}</div><div className="text-xs text-slate-500 mt-0.5 bn">{L(u.descBn, u.descEn)}</div></div></div>)}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        <Card>
          <CardHeader title={L('হজ চাহিদা পূর্বাভাস', 'Hajj demand forecast')} subtitle={L('নিবন্ধিত হজযাত্রী · ২০২৭–২৮ পূর্বাভাস (৮০% আস্থা ব্যবধান)', 'Registered pilgrims · 2027–28 forecast (80% confidence band)')} />
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={forecast} margin={{ left: -10, right: 10 }}>
                <defs><linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f62d9" stopOpacity=".2" /><stop offset="100%" stopColor="#2f62d9" stopOpacity=".05" /></linearGradient></defs>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => fmtNum(v, lang)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="hi" name={L('উচ্চ সীমা', 'Upper')} stroke="none" fill="url(#band)" />
                <Area type="monotone" dataKey="lo" name={L('নিম্ন সীমা', 'Lower')} stroke="none" fill="#fff" />
                <Area type="monotone" dataKey="actual" name={L('প্রকৃত', 'Actual')} stroke="#2f62d9" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="forecast" name={L('পূর্বাভাস', 'Forecast')} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title={L('পরিদর্শন ঝুঁকি ম্যাট্রিক্স', 'Inspection risk matrix')} subtitle={L('স্কোর বনাম সমস্যা · বুদবুদ = ধারণক্ষমতা · লাল = অগ্রাধিকার', 'Score vs issues · bubble = capacity · red = priority')} />
          <div className="h-56">
            <ResponsiveContainer>
              <ScatterChart margin={{ left: -10, right: 10 }}>
                <CartesianGrid stroke="#eef2f7" />
                <XAxis dataKey="x" name={L('স্কোর', 'Score')} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <YAxis dataKey="y" name={L('ঝুঁকি সূচক', 'Risk index')} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <ZAxis dataKey="z" range={[30, 300]} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={risk.filter((r) => !r.risk)} fill="#adc7f7" />
                <Scatter data={risk.filter((r) => r.risk)} fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card padded={false}>
          <div className="p-5 pb-2"><CardHeader title={L('অনুদান অসঙ্গতি — পর্যালোচনার জন্য চিহ্নিত', 'Grant anomalies — flagged for review')} subtitle={L('নিয়ম: অনুমোদন ≥ ৯৫% আবেদিত অর্থ · human review প্রয়োজন', 'Rule: approved ≥ 95% of requested · human review required')} /></div>
          <ul className="divide-y divide-slate-100">
            {anomalies.map((g) => <li key={g.id} className="px-5 py-3 flex items-center gap-3 text-sm"><ShieldAlert size={15} className="text-red-500 shrink-0" /><span className="mono-id w-32 shrink-0">{g.id}</span><span className="bn flex-1 truncate">{L(g.institution.nameBn, g.institution.nameEn)}</span><span className="tabular-nums text-xs text-slate-500">{Math.round((g.approved / g.requested) * 100)}%</span><Badge tone="amber">{L('পর্যালোচনা', 'Review')}</Badge></li>)}
          </ul>
        </Card>
        <Card padded={false} className="flex flex-col">
          <div className="px-5 py-3 bg-[#0a1530] rounded-t-xl text-white flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center"><Bot size={16} /></span><div><div className="text-sm font-semibold">NRAMS {L('সহকারী', 'Assistant')}</div><div className="text-[10px] text-slate-400 bn">{L('শুধু প্রশাসনিক তথ্য ও নেভিগেশন', 'Administrative data & navigation only')}</div></div></div>
          <div className="flex-1 bg-slate-50 p-4 space-y-3 min-h-[220px] max-h-[300px] overflow-y-auto">
            {msgs.map((m, i) => <div key={i} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm bn ${m.me ? 'ml-auto bg-brand-500 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>{m.text}</div>)}
          </div>
          <form className="p-3 border-t border-slate-200 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!input.trim()) return; setMsgs((m) => [...m, { me: true, text: input }, { me: false, text: L('এটি একটি প্রোটোটাইপ। প্রকৃত বাস্তবায়নে সহকারী MIS ডাটাবেস থেকে উত্তর দেবে এবং প্রাসঙ্গিক মডিউলে নেভিগেট করবে।', 'This is a prototype. In production the assistant answers from the MIS database and navigates to the relevant module.') }]); setInput('') }}>
            <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={L('প্রশ্ন লিখুন…', 'Ask a question…')} /><button className="btn-primary"><Send size={15} /></button>
          </form>
        </Card>
      </div>
    </div>
  )
}
