import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'bn' | 'en'

const dict = {
  // shell
  appName: ['NRADTP', 'NRADTP'],
  appFull: ['জাতীয় ধর্ম বিষয়ক ডিজিটাল রূপান্তর প্ল্যাটফর্ম', 'National Religious Affairs Digital Transformation Platform'],
  ministry: ['ধর্ম বিষয়ক মন্ত্রণালয়', 'Ministry of Religious Affairs'],
  govt: ['গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', "Government of the People's Republic of Bangladesh"],
  search: ['খুঁজুন…', 'Search…'],
  workspace: ['কর্মক্ষেত্র', 'Workspace'],
  logout: ['লগ আউট', 'Sign out'],
  citizenPortal: ['নাগরিক পোর্টাল', 'Citizen Portal'],
  officerLogin: ['কর্মকর্তা লগইন', 'Officer Sign in'],

  // nav groups
  gOverview: ['সারসংক্ষেপ', 'Overview'],
  gInstitutions: ['ধর্মীয় প্রতিষ্ঠান', 'Religious Institutions'],
  gHajj: ['হজ ব্যবস্থাপনা', 'Hajj Management'],
  gWaqf: ['ওয়াক্‌ফ ও সম্পত্তি', 'Waqf & Assets'],
  gPeople: ['জনবল ও শিক্ষা', 'People & Education'],
  gServices: ['সেবা ও কর্মসূচি', 'Services & Programs'],
  gSystem: ['সিস্টেম', 'System'],

  // nav items
  dashboard: ['কেন্দ্রীয় ড্যাশবোর্ড', 'Central Dashboard'],
  institutions: ['প্রতিষ্ঠান নিবন্ধন ও ডাটাবেস', 'Institution Registry'],
  grants: ['সরকারি অনুদান ব্যবস্থাপনা', 'Grant Management'],
  inspections: ['মাঠ পরিদর্শন', 'Field Inspections'],
  gis: ['GIS ম্যাপিং', 'GIS Mapping'],
  hajj: ['হজযাত্রী ও এজেন্সি', 'Pilgrims & Agencies'],
  hajjOps: ['ফ্লাইট, আবাসন ও পরিবহন', 'Flights, Housing & Transport'],
  hajjTraining: ['হজ প্রশিক্ষণ', 'Hajj Training'],
  complaints: ['অভিযোগ ও সহায়তা কেন্দ্র', 'Complaints & Helpdesk'],
  waqf: ['ওয়াক্‌ফ সম্পত্তি রেজিস্ট্রি', 'Waqf Asset Registry'],
  lease: ['ইজারা ও রাজস্ব', 'Lease & Revenue'],
  education: ['ধর্মীয় শিক্ষা ব্যবস্থাপনা', 'Religious Education'],
  personnel: ['ধর্মীয় জনবল ডাটাবেস', 'Religious Personnel'],
  hrms: ['e-HRMS ও উপস্থিতি', 'e-HRMS & Attendance'],
  events: ['অনুষ্ঠান ও কর্মসূচি', 'Events & Programs'],
  assistance: ['অনুদান/সহায়তা কর্মসূচি', 'Donation / Assistance'],
  analytics: ['AI ও অ্যানালিটিক্স', 'AI & Analytics'],
  roadmap: ['বাস্তবায়ন রোডম্যাপ', 'Implementation Roadmap'],

  // common
  all: ['সকল', 'All'],
  status: ['অবস্থা', 'Status'],
  actions: ['কার্যক্রম', 'Actions'],
  view: ['দেখুন', 'View'],
  details: ['বিস্তারিত', 'Details'],
  close: ['বন্ধ', 'Close'],
  save: ['সংরক্ষণ', 'Save'],
  cancel: ['বাতিল', 'Cancel'],
  submit: ['জমা দিন', 'Submit'],
  filter: ['ফিল্টার', 'Filter'],
  export: ['এক্সপোর্ট', 'Export'],
  print: ['প্রিন্ট', 'Print'],
  newEntry: ['নতুন এন্ট্রি', 'New Entry'],
  division: ['বিভাগ', 'Division'],
  district: ['জেলা', 'District'],
  upazila: ['উপজেলা', 'Upazila'],
  union: ['ইউনিয়ন', 'Union'],
  name: ['নাম', 'Name'],
  type: ['ধরন', 'Type'],
  date: ['তারিখ', 'Date'],
  amount: ['পরিমাণ', 'Amount'],
  mobile: ['মোবাইল', 'Mobile'],
  address: ['ঠিকানা', 'Address'],
  established: ['প্রতিষ্ঠার বছর', 'Established'],
  capacity: ['ধারণক্ষমতা', 'Capacity'],
  noData: ['কোনো তথ্য পাওয়া যায়নি', 'No records found'],
  showing: ['দেখানো হচ্ছে', 'Showing'],
  of: ['এর মধ্যে', 'of'],
  total: ['মোট', 'Total'],
  today: ['আজ', 'Today'],
  thisMonth: ['এই মাস', 'This month'],
  thisYear: ['এই বছর', 'This year'],
  pending: ['অপেক্ষমাণ', 'Pending'],
  approved: ['অনুমোদিত', 'Approved'],
  rejected: ['প্রত্যাখ্যাত', 'Rejected'],
  active: ['সক্রিয়', 'Active'],
  inactive: ['নিষ্ক্রিয়', 'Inactive'],
  completed: ['সম্পন্ন', 'Completed'],
  open: ['খোলা', 'Open'],
  closed: ['বন্ধ', 'Closed'],
  inProgress: ['চলমান', 'In progress'],
  resolved: ['সমাধানকৃত', 'Resolved'],
  verified: ['যাচাইকৃত', 'Verified'],
  disbursed: ['বিতরণকৃত', 'Disbursed'],
  scheduled: ['নির্ধারিত', 'Scheduled'],
  overdue: ['বিলম্বিত', 'Overdue'],
  expired: ['মেয়াদোত্তীর্ণ', 'Expired'],
  expiring: ['মেয়াদ শেষ হচ্ছে', 'Expiring'],
  draft: ['খসড়া', 'Draft'],
  present: ['উপস্থিত', 'Present'],
  absent: ['অনুপস্থিত', 'Absent'],
  late: ['বিলম্বে', 'Late'],
  leave: ['ছুটি', 'Leave'],
  tour: ['সফর', 'Tour'],

  // institution types
  mosque: ['মসজিদ', 'Mosque'],
  madrasa: ['মাদ্রাসা', 'Madrasa'],
  temple: ['মন্দির', 'Temple'],
  church: ['গির্জা', 'Church'],
  buddhist: ['বৌদ্ধ বিহার', 'Buddhist Vihara'],
  other: ['অন্যান্য', 'Other'],
} as const

export type TKey = keyof typeof dict

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string; L: (bn: string, en: string) => string }>({
  lang: 'bn',
  setLang: () => {},
  t: (k) => dict[k][1],
  L: (_bn, en) => en,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('nradtp.lang') as Lang) || 'bn')
  const set = (l: Lang) => {
    setLang(l)
    try { localStorage.setItem('nradtp.lang', l) } catch {}
  }
  const t = (k: TKey) => dict[k][lang === 'bn' ? 0 : 1]
  const L = (bn: string, en: string) => (lang === 'bn' ? bn : en)
  return <LangCtx.Provider value={{ lang, setLang: set, t, L }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)

// ---- number / date helpers ----
const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
export function toBn(s: string | number): string {
  return String(s).replace(/\d/g, (d) => bnDigits[Number(d)])
}
export function fmtNum(n: number, lang: Lang): string {
  const s = n.toLocaleString('en-IN')
  return lang === 'bn' ? toBn(s) : s
}
export function fmtMoney(n: number, lang: Lang, compact = false): string {
  if (compact) {
    let v = n, suffix = ''
    if (n >= 1e7) { v = n / 1e7; suffix = lang === 'bn' ? ' কোটি' : ' Cr' }
    else if (n >= 1e5) { v = n / 1e5; suffix = lang === 'bn' ? ' লক্ষ' : ' L' }
    const s = v.toLocaleString('en-IN', { maximumFractionDigits: 1 })
    return '৳' + (lang === 'bn' ? toBn(s) : s) + suffix
  }
  return '৳' + fmtNum(n, lang)
}
const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function fmtDate(iso: string, lang: Lang): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const day = d.getDate(), m = d.getMonth(), y = d.getFullYear()
  return lang === 'bn' ? `${toBn(day)} ${bnMonths[m]} ${toBn(y)}` : `${day} ${enMonths[m]} ${y}`
}
