// Deterministic mock data for NRAMS. All records are synthetic.

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
const R = rng(20260922)
const pick = <T,>(a: readonly T[]) => a[Math.floor(R() * a.length)]
const int = (a: number, b: number) => a + Math.floor(R() * (b - a + 1))
const pad = (n: number, w: number) => String(n).padStart(w, '0')
const dateIn = (y: number, m1: number, m2: number) => `${y}-${pad(int(m1, m2), 2)}-${pad(int(1, 28), 2)}`

// ---------- Geography ----------
// All 8 divisions and 64 districts. lon/lat is an interior point of the real boundary polygon and r is the
// radius (in degrees) of the largest circle around it that stays inside the district — both derived from the
// BBS / OCHA administrative boundaries (geoBoundaries gbOpen BGD ADM2), the same data drawn in bd-geo.json.
export type Division = { id: string; bn: string; en: string; lon: number; lat: number; districts: District[] }
export type District = { bn: string; en: string; lon: number; lat: number; r: number }

export const divisions: Division[] = [
  { id: 'DHA', bn: 'ঢাকা', en: 'Dhaka', lon: 90.083, lat: 23.533, districts: [
    { bn: 'ঢাকা', en: 'Dhaka', lon: 90.357, lat: 23.77, r: 0.106 }, { bn: 'গাজীপুর', en: 'Gazipur', lon: 90.441, lat: 24.106, r: 0.181 }, { bn: 'নারায়ণগঞ্জ', en: 'Narayanganj', lon: 90.592, lat: 23.741, r: 0.079 },
    { bn: 'টাঙ্গাইল', en: 'Tangail', lon: 89.998, lat: 24.377, r: 0.212 }, { bn: 'ফরিদপুর', en: 'Faridpur', lon: 89.893, lat: 23.504, r: 0.155 }, { bn: 'কিশোরগঞ্জ', en: 'Kishoreganj', lon: 90.968, lat: 24.401, r: 0.192 },
    { bn: 'মানিকগঞ্জ', en: 'Manikganj', lon: 89.939, lat: 23.847, r: 0.135 }, { bn: 'মুন্সীগঞ্জ', en: 'Munshiganj', lon: 90.312, lat: 23.547, r: 0.095 }, { bn: 'নরসিংদী', en: 'Narsingdi', lon: 90.795, lat: 23.993, r: 0.128 },
    { bn: 'গোপালগঞ্জ', en: 'Gopalganj', lon: 89.932, lat: 23, r: 0.115 }, { bn: 'মাদারীপুর', en: 'Madaripur', lon: 90.131, lat: 23.215, r: 0.1 }, { bn: 'রাজবাড়ী', en: 'Rajbari', lon: 89.601, lat: 23.705, r: 0.107 },
    { bn: 'শরীয়তপুর', en: 'Shariatpur', lon: 90.371, lat: 23.285, r: 0.121 },
  ] },
  { id: 'CTG', bn: 'চট্টগ্রাম', en: 'Chattogram', lon: 92.027, lat: 22.74, districts: [
    { bn: 'চট্টগ্রাম', en: 'Chattogram', lon: 91.987, lat: 22.228, r: 0.138 }, { bn: 'কক্সবাজার', en: "Cox's Bazar", lon: 91.996, lat: 21.746, r: 0.101 }, { bn: 'কুমিল্লা', en: 'Cumilla', lon: 90.975, lat: 23.588, r: 0.162 },
    { bn: 'নোয়াখালী', en: 'Noakhali', lon: 91.126, lat: 22.81, r: 0.144 }, { bn: 'ব্রাহ্মণবাড়িয়া', en: 'Brahmanbaria', lon: 91.092, lat: 23.909, r: 0.125 }, { bn: 'রাঙ্গামাটি', en: 'Rangamati', lon: 92.237, lat: 22.763, r: 0.21 },
    { bn: 'বান্দরবান', en: 'Bandarban', lon: 92.389, lat: 21.676, r: 0.196 }, { bn: 'চাঁদপুর', en: 'Chandpur', lon: 90.805, lat: 23.29, r: 0.129 }, { bn: 'ফেনী', en: 'Feni', lon: 91.41, lat: 22.97, r: 0.087 },
    { bn: 'লক্ষ্মীপুর', en: 'Lakshmipur', lon: 90.856, lat: 22.92, r: 0.1 }, { bn: 'খাগড়াছড়ি', en: 'Khagrachhari', lon: 91.961, lat: 23.235, r: 0.154 },
  ] },
  { id: 'RAJ', bn: 'রাজশাহী', en: 'Rajshahi', lon: 89.163, lat: 24.598, districts: [
    { bn: 'রাজশাহী', en: 'Rajshahi', lon: 88.719, lat: 24.475, r: 0.16 }, { bn: 'বগুড়া', en: 'Bogura', lon: 89.39, lat: 24.844, r: 0.216 }, { bn: 'পাবনা', en: 'Pabna', lon: 89.371, lat: 24.074, r: 0.159 },
    { bn: 'নাটোর', en: 'Natore', lon: 89.08, lat: 24.36, r: 0.17 }, { bn: 'সিরাজগঞ্জ', en: 'Sirajganj', lon: 89.578, lat: 24.387, r: 0.161 }, { bn: 'জয়পুরহাট', en: 'Joypurhat', lon: 89.087, lat: 25.134, r: 0.108 },
    { bn: 'নওগাঁ', en: 'Naogaon', lon: 88.74, lat: 24.912, r: 0.225 }, { bn: 'চাঁপাইনবাবগঞ্জ', en: 'Chapai Nawabganj', lon: 88.264, lat: 24.725, r: 0.151 },
  ] },
  { id: 'KHU', bn: 'খুলনা', en: 'Khulna', lon: 89.396, lat: 22.804, districts: [
    { bn: 'খুলনা', en: 'Khulna', lon: 89.402, lat: 22.552, r: 0.132 }, { bn: 'যশোর', en: 'Jashore', lon: 89.185, lat: 23.1, r: 0.18 }, { bn: 'কুষ্টিয়া', en: 'Kushtia', lon: 88.933, lat: 24.007, r: 0.105 },
    { bn: 'সাতক্ষীরা', en: 'Satkhira', lon: 89.097, lat: 22.645, r: 0.134 }, { bn: 'বাগেরহাট', en: 'Bagerhat', lon: 89.739, lat: 22.586, r: 0.158 }, { bn: 'চুয়াডাঙ্গা', en: 'Chuadanga', lon: 88.884, lat: 23.649, r: 0.113 },
    { bn: 'ঝিনাইদহ', en: 'Jhenaidah', lon: 89.147, lat: 23.544, r: 0.144 }, { bn: 'মাগুরা', en: 'Magura', lon: 89.408, lat: 23.399, r: 0.111 }, { bn: 'মেহেরপুর', en: 'Meherpur', lon: 88.686, lat: 23.767, r: 0.091 },
    { bn: 'নড়াইল', en: 'Narail', lon: 89.554, lat: 23.151, r: 0.112 },
  ] },
  { id: 'BAR', bn: 'বরিশাল', en: 'Barishal', lon: 90.245, lat: 22.418, districts: [
    { bn: 'বরিশাল', en: 'Barishal', lon: 90.326, lat: 22.857, r: 0.122 }, { bn: 'পটুয়াখালী', en: 'Patuakhali', lon: 90.457, lat: 22.331, r: 0.132 }, { bn: 'ভোলা', en: 'Bhola', lon: 90.724, lat: 22.162, r: 0.085 },
    { bn: 'পিরোজপুর', en: 'Pirojpur', lon: 90.027, lat: 22.71, r: 0.088 }, { bn: 'বরগুনা', en: 'Barguna', lon: 90.136, lat: 22.185, r: 0.064 }, { bn: 'ঝালকাঠি', en: 'Jhalokati', lon: 90.208, lat: 22.611, r: 0.09 },
  ] },
  { id: 'SYL', bn: 'সিলেট', en: 'Sylhet', lon: 91.693, lat: 24.712, districts: [
    { bn: 'সিলেট', en: 'Sylhet', lon: 91.953, lat: 24.954, r: 0.221 }, { bn: 'মৌলভীবাজার', en: 'Moulvibazar', lon: 91.792, lat: 24.445, r: 0.159 }, { bn: 'হবিগঞ্জ', en: 'Habiganj', lon: 91.423, lat: 24.474, r: 0.171 },
    { bn: 'সুনামগঞ্জ', en: 'Sunamganj', lon: 91.4, lat: 24.916, r: 0.227 },
  ] },
  { id: 'RNG', bn: 'রংপুর', en: 'Rangpur', lon: 89.376, lat: 25.6, districts: [
    { bn: 'রংপুর', en: 'Rangpur', lon: 89.251, lat: 25.674, r: 0.174 }, { bn: 'দিনাজপুর', en: 'Dinajpur', lon: 88.655, lat: 25.709, r: 0.189 }, { bn: 'কুড়িগ্রাম', en: 'Kurigram', lon: 89.667, lat: 25.738, r: 0.146 },
    { bn: 'ঠাকুরগাঁও', en: 'Thakurgaon', lon: 88.354, lat: 26.019, r: 0.16 }, { bn: 'পঞ্চগড়', en: 'Panchagarh', lon: 88.57, lat: 26.276, r: 0.089 }, { bn: 'গাইবান্ধা', en: 'Gaibandha', lon: 89.534, lat: 25.311, r: 0.172 },
    { bn: 'লালমনিরহাট', en: 'Lalmonirhat', lon: 89.394, lat: 25.922, r: 0.09 }, { bn: 'নীলফামারী', en: 'Nilphamari', lon: 88.934, lat: 26.012, r: 0.151 },
  ] },
  { id: 'MYM', bn: 'ময়মনসিংহ', en: 'Mymensingh', lon: 90.57, lat: 24.832, districts: [
    { bn: 'ময়মনসিংহ', en: 'Mymensingh', lon: 90.392, lat: 24.659, r: 0.224 }, { bn: 'নেত্রকোণা', en: 'Netrokona', lon: 90.765, lat: 24.953, r: 0.164 }, { bn: 'জামালপুর', en: 'Jamalpur', lon: 89.864, lat: 24.848, r: 0.113 },
    { bn: 'শেরপুর', en: 'Sherpur', lon: 90.077, lat: 25.081, r: 0.147 },
  ] },
]
export const districtCount = divisions.reduce((n, d) => n + d.districts.length, 0)

// Random point guaranteed to fall inside the district (uniform over 80% of its inscribed circle)
const scatter = (d: District) => {
  const a = R() * 2 * Math.PI, k = Math.sqrt(R()) * 0.8 * d.r
  return { lat: d.lat + Math.sin(a) * k, lon: d.lon + (Math.cos(a) * k) / 0.916 }
}

// ---------- Institutions ----------
export type InstType = 'mosque' | 'madrasa' | 'temple' | 'church' | 'buddhist' | 'other'
export type Institution = {
  id: string; type: InstType; nameBn: string; nameEn: string; divisionId: string; district: District; upazila: string; union: string;
  established: number; committeeHead: string; incharge: string; mobile: string; landDecimal: number; building: string; capacity: number;
  lat: number; lon: number; status: 'Active' | 'Pending Verification' | 'Inactive'; grantsReceived: number; lastInspection: string | null; registeredOn: string;
}

const mosqueNames = ['বায়তুল মোকাররম জামে মসজিদ', 'কেন্দ্রীয় জামে মসজিদ', 'বায়তুন নূর জামে মসজিদ', 'দারুস সালাম মসজিদ', 'মদিনা জামে মসজিদ', 'বায়তুল আমান মসজিদ', 'শাহী জামে মসজিদ', 'গাউসুল আজম মসজিদ', 'হযরত শাহজালাল (রঃ) মসজিদ', 'বায়তুল ফালাহ মসজিদ']
const mosqueEn = ['Baitul Mukarram Jame Mosque', 'Central Jame Mosque', 'Baitun Noor Jame Mosque', 'Darus Salam Mosque', 'Madina Jame Mosque', 'Baitul Aman Mosque', 'Shahi Jame Mosque', 'Gausul Azam Mosque', 'Hazrat Shahjalal (R) Mosque', 'Baitul Falah Mosque']
const madrasaNames = ['দারুল উলূম মাদ্রাসা', 'জামিয়া ইসলামিয়া', 'হাফেজিয়া মাদ্রাসা', 'আলিয়া মাদ্রাসা', 'নূরানী তালিমুল কুরআন মাদ্রাসা', 'দাখিল মাদ্রাসা', 'কামিল মাদ্রাসা']
const madrasaEn = ['Darul Uloom Madrasa', 'Jamia Islamia', 'Hafezia Madrasa', 'Alia Madrasa', 'Nurani Talimul Quran Madrasa', 'Dakhil Madrasa', 'Kamil Madrasa']
const templeNames = ['শ্রী শ্রী কালী মন্দির', 'ঢাকেশ্বরী মন্দির', 'রাধা গোবিন্দ মন্দির', 'শিব মন্দির', 'দুর্গা মন্দির', 'লোকনাথ মন্দির', 'জগন্নাথ মন্দির']
const templeEn = ['Sri Sri Kali Mandir', 'Dhakeshwari Mandir', 'Radha Govinda Mandir', 'Shiva Mandir', 'Durga Mandir', 'Loknath Mandir', 'Jagannath Mandir']
const churchNames = ['সেন্ট মেরিস ক্যাথেড্রাল', 'হলি রোজারি চার্চ', 'ব্যাপ্টিস্ট চার্চ', 'সেন্ট থমাস চার্চ', 'ইমানুয়েল চার্চ', 'ক্রাইস্ট চার্চ']
const churchEn = ["St. Mary's Cathedral", 'Holy Rosary Church', 'Baptist Church', "St. Thomas' Church", 'Immanuel Church', 'Christ Church']
const buddhistNames = ['ধর্মরাজিক বৌদ্ধ বিহার', 'কমলাপুর বৌদ্ধ বিহার', 'রাজবন বিহার', 'বুদ্ধ ধাতু জাদি', 'শাক্যমুনি বৌদ্ধ বিহার', 'মহামুনি বৌদ্ধ বিহার']
const buddhistEn = ['Dharmarajika Buddhist Vihara', 'Kamalapur Buddhist Vihara', 'Rajban Vihara', 'Buddha Dhatu Jadi', 'Shakyamuni Buddhist Vihara', 'Mahamuni Buddhist Vihara']

const firstNames = ['মোঃ আব্দুল করিম', 'মোঃ রফিকুল ইসলাম', 'মাওলানা হাফিজুর রহমান', 'মোঃ শফিকুল আলম', 'মোঃ জাহাঙ্গীর হোসেন', 'শ্রী সুবাস চন্দ্র দাস', 'শ্রী নির্মল কুমার রায়', 'ফাদার জোসেফ গোমেজ', 'ভান্তে সুমনানন্দ থেরো', 'মোঃ কামরুল হাসান', 'শ্রীমতী অনিতা রানী', 'মোঃ মনিরুজ্জামান', 'রেভারেন্ড ডেভিড বৈদ্য', 'মোঃ আনোয়ার হোসেন']
const upazilas = ['সদর', 'উত্তর', 'দক্ষিণ', 'পূর্ব', 'পশ্চিম', 'মডেল', 'পৌরসভা']
const unions = ['১ নং ইউনিয়ন', '২ নং ইউনিয়ন', '৩ নং ইউনিয়ন', '৪ নং ইউনিয়ন', '৫ নং ইউনিয়ন', '৬ নং ইউনিয়ন', 'পৌর এলাকা']

export const instTypePrefix: Record<InstType, string> = { mosque: 'MOS', madrasa: 'MAD', temple: 'TMP', church: 'CHR', buddhist: 'BUD', other: 'OTH' }

export const institutions: Institution[] = (() => {
  const out: Institution[] = []
  const typeWeights: InstType[] = ['mosque', 'mosque', 'mosque', 'mosque', 'mosque', 'madrasa', 'madrasa', 'temple', 'temple', 'church', 'buddhist', 'other']
  let n = 0
  for (let i = 0; i < 140; i++) {
    const type = pick(typeWeights)
    const div = pick(divisions)
    const dist = pick(div.districts)
    let nameBn = '', nameEn = ''
    const k = int(0, 9)
    switch (type) {
      case 'mosque': nameBn = mosqueNames[k % mosqueNames.length]; nameEn = mosqueEn[k % mosqueEn.length]; break
      case 'madrasa': nameBn = madrasaNames[k % madrasaNames.length]; nameEn = madrasaEn[k % madrasaEn.length]; break
      case 'temple': nameBn = templeNames[k % templeNames.length]; nameEn = templeEn[k % templeEn.length]; break
      case 'church': nameBn = churchNames[k % churchNames.length]; nameEn = churchEn[k % churchEn.length]; break
      case 'buddhist': nameBn = buddhistNames[k % buddhistNames.length]; nameEn = buddhistEn[k % buddhistEn.length]; break
      default: nameBn = 'ধর্মীয় সাংস্কৃতিক কেন্দ্র'; nameEn = 'Religious Cultural Centre'
    }
    n++
    const status = R() < 0.82 ? 'Active' : R() < 0.7 ? 'Pending Verification' : 'Inactive'
    out.push({
      id: `${instTypePrefix[type]}-2026-${pad(n, 6)}`,
      type, nameBn: `${nameBn}, ${dist.bn}`, nameEn: `${nameEn}, ${dist.en}`,
      divisionId: div.id, district: dist, upazila: pick(upazilas), union: pick(unions),
      established: int(1890, 2020), committeeHead: pick(firstNames), incharge: pick(firstNames),
      mobile: `01${int(3, 9)}${pad(int(0, 99999999), 8)}`, landDecimal: int(5, 480), building: pick(['পাকা', 'আধা-পাকা', 'বহুতল', 'টিনশেড']),
      capacity: int(80, 5000), ...scatter(dist),
      status, grantsReceived: int(0, 6), lastInspection: R() < 0.7 ? dateIn(2026, 1, 9) : null, registeredOn: dateIn(2025, 7, 12),
    })
  }
  return out
})()

export const nationalInstitutionStats = { mosque: 305432, madrasa: 78210, temple: 40418, church: 3120, buddhist: 2680, other: 940 }

// ---------- Grants ----------
export type GrantStage = 'Application' | 'Verification' | 'Approval' | 'Fund Allocation' | 'Payment' | 'Utilization' | 'Monitoring'
export const grantStages: GrantStage[] = ['Application', 'Verification', 'Approval', 'Fund Allocation', 'Payment', 'Utilization', 'Monitoring']
export type Grant = { id: string; institution: Institution; purposeBn: string; purposeEn: string; requested: number; approved: number; stage: GrantStage; status: string; appliedOn: string; fiscalYear: string; ucSubmitted: boolean }
const purposes: [string, string][] = [['ভবন সংস্কার', 'Building renovation'], ['অজুখানা নির্মাণ', 'Ablution facility'], ['সীমানা প্রাচীর', 'Boundary wall'], ['সৌর বিদ্যুৎ', 'Solar power'], ['পানীয় জল', 'Drinking water'], ['ছাদ মেরামত', 'Roof repair'], ['শিক্ষা উপকরণ', 'Educational materials'], ['প্রাকৃতিক দুর্যোগ ক্ষতি', 'Disaster damage']]
export const grants: Grant[] = Array.from({ length: 64 }, (_, i) => {
  const inst = pick(institutions)
  const [pb, pe] = pick(purposes)
  const requested = int(5, 60) * 10000
  const stage = pick(grantStages)
  const si = grantStages.indexOf(stage)
  const rejected = si >= 2 && R() < 0.1
  const approved = si >= 3 && !rejected ? Math.round(requested * (0.5 + R() * 0.5) / 10000) * 10000 : 0
  return {
    id: `GRT-2026-${pad(i + 1, 5)}`, institution: inst, purposeBn: pb, purposeEn: pe, requested, approved, stage,
    status: rejected ? 'Rejected' : si === 0 ? 'Pending' : si <= 2 ? 'Under Review' : si <= 4 ? 'Approved' : si === 5 ? 'Disbursed' : 'Utilized',
    appliedOn: dateIn(2026, 1, 9), fiscalYear: '2026-27', ucSubmitted: si >= 6,
  }
})

// ---------- Inspections ----------
export type Inspection = { id: string; institution: Institution; officer: string; date: string; status: 'Completed' | 'Scheduled' | 'Follow-up Required' | 'Overdue'; score: number; issues: string[]; gps: string; photos: number }
const officers = ['মোঃ সাইফুল ইসলাম (উপজেলা কর্মকর্তা)', 'ফারহানা আক্তার (ফিল্ড অফিসার)', 'মোঃ তারিকুল ইসলাম (পরিদর্শক)', 'সুমন চন্দ্র বর্মণ (ফিল্ড অফিসার)', 'নাসরিন সুলতানা (উপজেলা কর্মকর্তা)', 'মোঃ আরিফ হোসেন (পরিদর্শক)']
const issuePool = ['ছাদে ফাটল', 'অজুখানা অকার্যকর', 'হিসাব খাতা অসম্পূর্ণ', 'কমিটি মেয়াদোত্তীর্ণ', 'অগ্নি নিরাপত্তা নেই', 'অনুদান UC জমা হয়নি', 'বিদ্যুৎ বিল বকেয়া', 'সীমানা বিরোধ']
export const inspections: Inspection[] = Array.from({ length: 58 }, (_, i) => {
  const st = pick(['Completed', 'Completed', 'Completed', 'Scheduled', 'Follow-up Required', 'Overdue'] as const)
  const nIssues = st === 'Completed' ? int(0, 2) : st === 'Scheduled' ? 0 : int(1, 4)
  return {
    id: `INS-2026-${pad(i + 1, 5)}`, institution: pick(institutions), officer: pick(officers), date: dateIn(2026, 3, 10), status: st,
    score: st === 'Scheduled' ? 0 : int(48, 98), issues: Array.from(new Set(Array.from({ length: nIssues }, () => pick(issuePool)))), gps: `${(23 + R() * 3).toFixed(5)}, ${(88.5 + R() * 3.5).toFixed(5)}`, photos: st === 'Scheduled' ? 0 : int(2, 9),
  }
})

// ---------- Hajj ----------
export type Agency = { id: string; name: string; licence: string; quota: number; registered: number; rating: number; status: 'Active' | 'Suspended' | 'Under Review'; complaints: number }
const agencyNames = ['আল-হেরা ট্রাভেলস', 'মদিনা এয়ার ট্রাভেলস', 'সাউদিয়া ইন্টারন্যাশনাল', 'রাবেয়া ট্রাভেলস', 'হিজাজ ট্রাভেলস', 'মক্কা ট্যুরস', 'কাবা ইন্টারন্যাশনাল', 'নূর ট্রাভেলস', 'জমজম ট্রাভেলস', 'তাকওয়া হজ সার্ভিস', 'আরাফাত ট্রাভেলস', 'মিনা ট্যুরস', 'ইসলামিক ট্রাভেলস', 'বায়তুল্লাহ ট্রাভেলস', 'হারামাইন সার্ভিস', 'সাফা-মারওয়া ট্রাভেলস']
export const agencies: Agency[] = agencyNames.map((n, i) => {
  const quota = int(150, 900)
  return { id: `AGN-${pad(101 + i, 4)}`, name: n, licence: `HL-${pad(int(100, 999), 4)}`, quota, registered: Math.round(quota * (0.4 + R() * 0.6)), rating: +(3 + R() * 2).toFixed(1), status: R() < 0.85 ? 'Active' : R() < 0.5 ? 'Under Review' : 'Suspended', complaints: int(0, 14) }
})

export type Pilgrim = { id: string; name: string; nid: string; age: number; gender: 'M' | 'F'; district: string; agency: Agency | null; pkg: 'Government' | 'Private A' | 'Private B'; paid: number; total: number; payment: 'Paid' | 'Partial' | 'Due'; medical: 'Fit' | 'Review' | 'Pending'; training: 'Completed' | 'Scheduled' | 'Not Started'; flight: string | null; status: string; mahram?: string }
const pilgrimNames = ['মোঃ আবুল কালাম', 'রোকেয়া বেগম', 'মোঃ সিরাজুল ইসলাম', 'হাসিনা খাতুন', 'মোঃ নূরুল আমিন', 'ফাতেমা বেগম', 'মোঃ আব্দুর রশিদ', 'সালমা আক্তার', 'মোঃ মোস্তফা কামাল', 'জাহানারা বেগম', 'মোঃ ইব্রাহিম খলিল', 'আয়েশা সিদ্দিকা', 'মোঃ গোলাম মোস্তফা', 'রাবেয়া খাতুন', 'মোঃ লুৎফর রহমান', 'মরিয়ম বেগম']
export const flights = Array.from({ length: 14 }, (_, i) => ({ id: `BG-${3001 + i}`, carrier: pick(['Biman Bangladesh', 'Saudia', 'Flynas']), route: i % 2 ? 'DAC → MED' : 'DAC → JED', date: `2026-05-${pad(10 + i, 2)}`, time: `${pad(int(1, 23), 2)}:${pick(['00', '30', '45'])}`, seats: 419, boarded: 0, status: i < 5 ? 'Departed' : i < 8 ? 'Boarding' : 'Scheduled' }))
export const pilgrims: Pilgrim[] = Array.from({ length: 96 }, (_, i) => {
  const pkg = pick(['Government', 'Private A', 'Private A', 'Private B', 'Private B'] as const)
  const total = pkg === 'Government' ? 583000 : pkg === 'Private A' ? 640000 : 745000
  const payment = pick(['Paid', 'Paid', 'Paid', 'Partial', 'Due'] as const)
  const paid = payment === 'Paid' ? total : payment === 'Partial' ? Math.round(total * (0.3 + R() * 0.6)) : 0
  const gender = R() < 0.62 ? 'M' : 'F'
  const training = pick(['Completed', 'Completed', 'Scheduled', 'Not Started'] as const)
  const fl = payment === 'Paid' && R() < 0.75 ? pick(flights) : null
  return {
    id: `PLG-2026-${pad(i + 1, 6)}`, name: pilgrimNames[(i * 7 + int(0, 3)) % pilgrimNames.length], nid: `${int(1000000000, 9999999999)}`, age: int(24, 78), gender, district: pick(pick(divisions).districts).bn,
    agency: pkg === 'Government' ? null : pick(agencies), pkg, paid, total, payment, medical: pick(['Fit', 'Fit', 'Fit', 'Review', 'Pending'] as const), training, flight: fl?.id ?? null,
    status: fl && fl.status === 'Departed' ? 'In Saudi Arabia' : fl ? 'Flight Assigned' : payment === 'Paid' ? 'Confirmed' : 'Registered', mahram: gender === 'F' && R() < 0.4 ? pick(pilgrimNames) : undefined,
  }
})
flights.forEach((f) => { f.boarded = f.status === 'Scheduled' ? 0 : Math.min(f.seats, pilgrims.filter((p) => p.flight === f.id).length * 24 + int(200, 380)) })

export const hajjSummary = { quota: 127198, registered: 83452, govt: 4318, priv: 79134, paidFull: 61208, medicalCleared: 57990, trained: 44810, departed: 12561, femalePct: 38 }

export type TrainingBatch = { id: string; centre: string; district: string; startDate: string; participants: number; capacity: number; attendancePct: number; trainer: string; status: 'Completed' | 'Ongoing' | 'Scheduled'; certificates: number }
export const trainingBatches: TrainingBatch[] = Array.from({ length: 22 }, (_, i) => {
  const cap = pick([60, 80, 100, 120])
  const st = i < 10 ? 'Completed' : i < 14 ? 'Ongoing' : 'Scheduled'
  const parts = st === 'Scheduled' ? int(20, cap) : int(Math.round(cap * 0.7), cap)
  return { id: `HTB-2026-${pad(i + 1, 3)}`, centre: pick(['আশকোনা হজ ক্যাম্প', 'ইসলামিক ফাউন্ডেশন কেন্দ্র', 'জেলা মডেল মসজিদ', 'ইমাম প্রশিক্ষণ একাডেমি']), district: pick(pick(divisions).districts).bn, startDate: `2026-${pad(int(2, 5), 2)}-${pad(int(1, 28), 2)}`, participants: parts, capacity: cap, attendancePct: st === 'Scheduled' ? 0 : int(72, 99), trainer: pick(officers), status: st, certificates: st === 'Completed' ? Math.round(parts * (0.85 + R() * 0.15)) : 0 }
})

export type Complaint = { id: string; category: string; pilgrim: string; agency: string | null; channel: 'App' | 'Hotline' | 'Web' | 'Walk-in'; priority: 'High' | 'Medium' | 'Low'; assignedTo: string; status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed' | 'Escalated'; openedOn: string; slaHours: number; ageHours: number; summary: string }
export const complaintCategories = ['Accommodation', 'Transportation', 'Food', 'Agency', 'Flight', 'Lost documents', 'Medical', 'Other']
const complaintSummaries: Record<string, string> = { Accommodation: 'হোটেলে বরাদ্দকৃত কক্ষে এসি কাজ করছে না', Transportation: 'মিনা থেকে আরাফাত বাস নির্ধারিত সময়ে আসেনি', Food: 'খাবারের মান ও পরিমাণ নিয়ে অভিযোগ', Agency: 'এজেন্সি প্রতিশ্রুত প্যাকেজ সুবিধা দেয়নি', Flight: 'ফ্লাইট বিলম্ব সম্পর্কে কোনো তথ্য জানানো হয়নি', 'Lost documents': 'পাসপোর্ট হারিয়ে গেছে – জরুরি সহায়তা', Medical: 'ডায়াবেটিস রোগীর জন্য ওষুধ প্রয়োজন', Other: 'সিম কার্ড সক্রিয় হচ্ছে না' }
export const complaints: Complaint[] = Array.from({ length: 48 }, (_, i) => {
  const cat = pick(complaintCategories)
  const status = pick(['Open', 'Assigned', 'In Progress', 'Resolved', 'Resolved', 'Closed', 'Escalated'] as const)
  return { id: `HCT-${pad(20260 + i, 6)}`, category: cat, pilgrim: pick(pilgrims).name, agency: R() < 0.7 ? pick(agencies).name : null, channel: pick(['App', 'App', 'Hotline', 'Web', 'Walk-in']), priority: cat === 'Medical' || cat === 'Lost documents' ? 'High' : pick(['High', 'Medium', 'Medium', 'Low']), assignedTo: pick(['হজ অফিস মক্কা', 'হজ অফিস মদিনা', 'আশকোনা হজ অফিস', 'মেডিকেল টিম', 'এজেন্সি মনিটরিং সেল']), status, openedOn: `2026-05-${pad(int(8, 28), 2)}`, slaHours: cat === 'Medical' ? 4 : cat === 'Lost documents' ? 12 : 48, ageHours: int(1, 96), summary: complaintSummaries[cat] }
})

// ---------- Waqf ----------
export type WaqfProperty = { id: string; nameBn: string; nameEn: string; district: District; divisionId: string; kind: 'Land' | 'Commercial Building' | 'Residential' | 'Shop Complex' | 'Agricultural' | 'Pond'; landDecimal: number; deedNo: string; waqifName: string; currentUse: string; legalStatus: 'Clear' | 'Disputed' | 'Under Litigation' | 'Encroached'; lat: number; lon: number; estValue: number; leased: boolean }
const waqfKinds = ['Land', 'Commercial Building', 'Residential', 'Shop Complex', 'Agricultural', 'Pond'] as const
export const waqfProperties: WaqfProperty[] = Array.from({ length: 52 }, (_, i) => {
  const div = pick(divisions), dist = pick(div.districts)
  const kind = pick(waqfKinds)
  const names: Record<string, [string, string]> = { Land: ['ওয়াক্‌ফ এস্টেট জমি', 'Waqf Estate Land'], 'Commercial Building': ['ওয়াক্‌ফ বাণিজ্যিক ভবন', 'Waqf Commercial Building'], Residential: ['ওয়াক্‌ফ আবাসিক ভবন', 'Waqf Residential Block'], 'Shop Complex': ['ওয়াক্‌ফ মার্কেট', 'Waqf Market Complex'], Agricultural: ['ওয়াক্‌ফ কৃষি জমি', 'Waqf Agricultural Land'], Pond: ['ওয়াক্‌ফ পুকুর', 'Waqf Pond'] }
  return { id: `WQF-${div.id}-${pad(i + 1, 5)}`, nameBn: `${names[kind][0]}, ${dist.bn}`, nameEn: `${names[kind][1]}, ${dist.en}`, district: dist, divisionId: div.id, kind, landDecimal: int(8, 900), deedNo: `${int(1000, 9999)}/${int(1950, 2015)}`, waqifName: pick(['হাজী মোহাম্মদ মহসিন', 'নবাব সলিমুল্লাহ', 'হাজী আব্দুল গণি', 'বেগম রোকেয়া ওয়াক্‌ফ', 'মুন্সী আব্দুল লতিফ', 'খান বাহাদুর আহছানউল্লা']), currentUse: pick(['মসজিদ ও মার্কেট', 'দোকান ভাড়া', 'কৃষি চাষ', 'আবাসিক ভাড়া', 'খালি/অব্যবহৃত', 'মাদ্রাসা', 'মাছ চাষ']), legalStatus: pick(['Clear', 'Clear', 'Clear', 'Clear', 'Disputed', 'Under Litigation', 'Encroached']), ...scatter(dist), estValue: int(20, 900) * 100000, leased: R() < 0.65 }
})
export type Lease = { id: string; property: WaqfProperty; tenant: string; agreementNo: string; start: string; end: string; monthlyRent: number; paidMonths: number; dueMonths: number; status: 'Active' | 'Expiring' | 'Expired' | 'Arrear' }
export const leases: Lease[] = waqfProperties.filter((p) => p.leased).map((p, i) => {
  const rent = int(5, 250) * 1000
  const end = pick(['2026-10-31', '2026-11-30', '2027-03-31', '2027-12-31', '2028-06-30', '2026-06-30', '2029-01-31'])
  const due = pick([0, 0, 0, 1, 2, 4, 7])
  const status = end < '2026-09-22' ? 'Expired' : due >= 3 ? 'Arrear' : end < '2027-01-01' ? 'Expiring' : 'Active'
  return { id: `LSE-2026-${pad(i + 1, 4)}`, property: p, tenant: pick(['মেসার্স করিম এন্টারপ্রাইজ', 'হাজী ট্রেডার্স', 'মোঃ সোলায়মান মিয়া', 'নিউ মদিনা স্টোর', 'রহমান ব্রাদার্স', 'মেসার্স আল-আমিন', 'সিটি ফার্মেসি', 'মোঃ জসিম উদ্দিন']), agreementNo: `WQ-AG-${int(1000, 9999)}`, start: pick(['2022-01-01', '2023-07-01', '2024-01-01', '2021-04-01', '2025-01-01']), end, monthlyRent: rent, paidMonths: 12 - due, dueMonths: due, status }
})
export const waqfSummary = { totalRegistered: 18432, digitised: 11208, leased: 6104, disputed: 1462, annualRevenue: 1_84_50_00_000, arrear: 12_60_00_000 }

// ---------- Education ----------
export type Course = { id: string; nameBn: string; nameEn: string; centre: string; batches: number; students: number; teachers: number; passRate: number; certificates: number; status: 'Ongoing' | 'Completed' | 'Planned' }
export const courses: Course[] = [
  ['ইমাম প্রশিক্ষণ কোর্স (৪৫ দিন)', 'Imam Training Course (45 days)', 'ইমাম প্রশিক্ষণ একাডেমি, ঢাকা', 'Ongoing'],
  ['মসজিদভিত্তিক শিশু ও গণশিক্ষা', 'Mosque-based Child & Mass Education', 'ইসলামিক ফাউন্ডেশন', 'Ongoing'],
  ['মন্দিরভিত্তিক শিশু ও গণশিক্ষা', 'Temple-based Child & Mass Education', 'হিন্দু ধর্মীয় কল্যাণ ট্রাস্ট', 'Ongoing'],
  ['প্যাগোডাভিত্তিক প্রাক-প্রাথমিক শিক্ষা', 'Pagoda-based Pre-primary Education', 'বৌদ্ধ ধর্মীয় কল্যাণ ট্রাস্ট', 'Ongoing'],
  ['গির্জাভিত্তিক শিক্ষা কার্যক্রম', 'Church-based Education Program', 'খ্রিস্টান ধর্মীয় কল্যাণ ট্রাস্ট', 'Completed'],
  ['পুরোহিত ও সেবাইত প্রশিক্ষণ', 'Purohit & Sebait Training', 'হিন্দু ধর্মীয় কল্যাণ ট্রাস্ট', 'Completed'],
  ['হাফেজ ও ক্বারী দক্ষতা উন্নয়ন', 'Hafez & Qari Skill Development', 'ইসলামিক ফাউন্ডেশন', 'Planned'],
  ['আন্তঃধর্মীয় সম্প্রীতি ওরিয়েন্টেশন', 'Interfaith Harmony Orientation', 'ধর্ম বিষয়ক মন্ত্রণালয়', 'Planned'],
].map(([bn, en, c, st], i) => {
  const b = int(4, 60), s = b * int(25, 40)
  return { id: `EDU-${pad(i + 1, 3)}`, nameBn: bn, nameEn: en, centre: c, batches: b, students: s, teachers: Math.round(b * 1.3), passRate: st === 'Planned' ? 0 : int(78, 97), certificates: st === 'Planned' ? 0 : Math.round(s * 0.8), status: st as Course['status'] }
})

// ---------- Personnel ----------
export type Personnel = { id: string; name: string; role: 'Imam' | 'Khatib' | 'Muazzin' | 'Purohit' | 'Priest' | 'Bhikkhu' | 'Instructor'; institution: Institution; qualification: string; trainings: number; appointedOn: string; mobile: string; status: 'Active' | 'Retired' | 'Transferred' }
export const personnel: Personnel[] = Array.from({ length: 70 }, (_, i) => {
  const inst = pick(institutions)
  const role: Personnel['role'] = inst.type === 'temple' ? 'Purohit' : inst.type === 'church' ? 'Priest' : inst.type === 'buddhist' ? 'Bhikkhu' : inst.type === 'madrasa' ? 'Instructor' : pick(['Imam', 'Khatib', 'Muazzin'])
  return { id: `RP-${pad(10001 + i, 6)}`, name: pick(firstNames), role, institution: inst, qualification: pick(['কামিল', 'দাওরায়ে হাদীস', 'ফাজিল', 'আলিম', 'সংস্কৃত তীর্থ', 'ব্যাচেলর অব ডিভিনিটি', 'পালি বিদ্যাবিশারদ', 'স্নাতকোত্তর']), trainings: int(0, 5), appointedOn: dateIn(int(2005, 2025), 1, 12), mobile: `01${int(3, 9)}${pad(int(0, 99999999), 8)}`, status: pick(['Active', 'Active', 'Active', 'Active', 'Retired', 'Transferred']) }
})

// ---------- HR ----------
export type Employee = { id: string; name: string; designation: string; office: string; grade: number; joined: string; status: 'Present' | 'Absent' | 'Late' | 'Leave' | 'Tour'; checkIn: string | null; gps: boolean; leaveBalance: number }
const designations = ['সহকারী পরিচালক', 'উপ-পরিচালক', 'উপজেলা ধর্ম কর্মকর্তা', 'ফিল্ড সুপারভাইজার', 'প্রশাসনিক কর্মকর্তা', 'হিসাবরক্ষক', 'কম্পিউটার অপারেটর', 'অফিস সহায়ক', 'সিনিয়র সহকারী সচিব', 'পরিদর্শক']
const offices = ['মন্ত্রণালয় সচিবালয়', 'ইসলামিক ফাউন্ডেশন', 'ওয়াক্‌ফ প্রশাসকের কার্যালয়', 'হজ অফিস, আশকোনা', 'হিন্দু ধর্মীয় কল্যাণ ট্রাস্ট', 'বৌদ্ধ ধর্মীয় কল্যাণ ট্রাস্ট', 'খ্রিস্টান ধর্মীয় কল্যাণ ট্রাস্ট', 'জেলা কার্যালয়, চট্টগ্রাম', 'জেলা কার্যালয়, রাজশাহী']
export const employees: Employee[] = Array.from({ length: 60 }, (_, i) => {
  const st = pick(['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Late', 'Absent', 'Leave', 'Tour'] as const)
  return { id: `EMP-${pad(2001 + i, 5)}`, name: pick(firstNames), designation: pick(designations), office: pick(offices), grade: int(3, 16), joined: dateIn(int(2000, 2024), 1, 12), status: st, checkIn: st === 'Present' ? `0${int(8, 9)}:${pad(int(0, 59), 2)}` : st === 'Late' ? `${pad(int(9, 11), 2)}:${pad(int(0, 59), 2)}` : null, gps: st === 'Present' || st === 'Late' || st === 'Tour', leaveBalance: int(2, 30) }
})
export const hrSummary = { totalEmployees: 4218, present: 3701, late: 142, absent: 88, leave: 201, tour: 86, pendingLeave: 57, pendingTransfer: 12, retiringThisYear: 34 }

// ---------- Events ----------
export type Event = { id: string; nameBn: string; nameEn: string; venue: string; date: string; participants: number; budget: number; spent: number; status: 'Planned' | 'Ongoing' | 'Completed' | 'Draft'; organizer: string }
export const events: Event[] = [
  ['পবিত্র ঈদ-ই-মিলাদুন্নবী (সাঃ) জাতীয় কর্মসূচি', 'Eid-e-Miladunnabi National Program', 'বায়তুল মোকাররম, ঢাকা', '2026-09-05', 'Completed'],
  ['জাতীয় শারদীয় দুর্গাপূজা সমন্বয় সভা', 'National Durga Puja Coordination Meeting', 'ঢাকেশ্বরী মন্দির, ঢাকা', '2026-10-02', 'Planned'],
  ['হজ ২০২৭ প্রাক-নিবন্ধন উদ্বোধন', 'Hajj 2027 Pre-registration Launch', 'আশকোনা হজ ক্যাম্প', '2026-10-15', 'Planned'],
  ['প্রবারণা পূর্ণিমা উদযাপন', 'Prabarana Purnima Celebration', 'কমলাপুর বৌদ্ধ বিহার', '2026-10-06', 'Planned'],
  ['বড়দিন শুভেচ্ছা ও সম্প্রীতি অনুষ্ঠান', 'Christmas Greetings & Harmony Program', 'সেন্ট মেরিস ক্যাথেড্রাল', '2026-12-24', 'Draft'],
  ['জাতীয় ইমাম সম্মেলন ২০২৬', 'National Imam Conference 2026', 'ওসমানী স্মৃতি মিলনায়তন', '2026-11-12', 'Planned'],
  ['আন্তঃধর্মীয় সম্প্রীতি সংলাপ', 'Interfaith Harmony Dialogue', 'আন্তর্জাতিক সম্মেলন কেন্দ্র', '2026-09-20', 'Ongoing'],
  ['পবিত্র আশুরা আলোচনা সভা', 'Ashura Discussion Program', 'ইসলামিক ফাউন্ডেশন মিলনায়তন', '2026-06-26', 'Completed'],
].map(([bn, en, v, d, st], i) => {
  const budget = int(5, 120) * 100000
  return { id: `EVT-2026-${pad(i + 1, 3)}`, nameBn: bn, nameEn: en, venue: v, date: d, participants: int(150, 12000), budget, spent: st === 'Completed' ? Math.round(budget * (0.7 + R() * 0.28)) : st === 'Ongoing' ? Math.round(budget * 0.45) : 0, status: st as Event['status'], organizer: pick(offices) }
})

// ---------- Assistance ----------
export type Assistance = { id: string; scheme: string; applicant: string; district: string; amount: number; stage: 'Application' | 'Verification' | 'Approval' | 'Disbursement' | 'Monitoring'; status: string; appliedOn: string }
const schemes = ['দুস্থ ইমাম-মুয়াজ্জিন কল্যাণ সহায়তা', 'ধর্মীয় প্রতিষ্ঠান জরুরি মেরামত', 'অসুস্থ ধর্মীয় নেতা চিকিৎসা সহায়তা', 'সংখ্যালঘু ধর্মীয় উৎসব অনুদান', 'হজযাত্রী কল্যাণ তহবিল', 'পুরোহিত/সেবাইত কল্যাণ ভাতা']
export const assistance: Assistance[] = Array.from({ length: 40 }, (_, i) => {
  const stage = pick(['Application', 'Verification', 'Approval', 'Disbursement', 'Disbursement', 'Monitoring'] as const)
  return { id: `AST-2026-${pad(i + 1, 5)}`, scheme: pick(schemes), applicant: pick(firstNames), district: pick(pick(divisions).districts).bn, amount: int(1, 30) * 5000, stage, status: stage === 'Application' ? 'Pending' : stage === 'Verification' ? 'Under Review' : stage === 'Approval' ? 'Approved' : stage === 'Disbursement' ? 'Disbursed' : 'Completed', appliedOn: dateIn(2026, 2, 9) }
})

// ---------- Time series for dashboard ----------
export const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
export const monthLabelsBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলাই', 'আগ', 'সেপ্টে']
export const registrationTrend = monthLabels.map((m, i) => ({ m, i, institutions: 6200 + i * 1450 + int(-300, 600), grants: 420 + i * 95 + int(-40, 80), inspections: 1150 + i * 210 + int(-90, 140) }))
export const grantByDivision = divisions.map((d) => ({ division: d, applied: int(600, 2400), approved: 0 })).map((r) => ({ ...r, approved: Math.round(r.applied * (0.55 + R() * 0.3)) }))
export const hajjPipeline = [
  { stage: 'Pre-registered', bn: 'প্রাক-নিবন্ধিত', value: 127198 }, { stage: 'Registered', bn: 'নিবন্ধিত', value: 83452 }, { stage: 'Payment complete', bn: 'পেমেন্ট সম্পন্ন', value: 61208 },
  { stage: 'Medical cleared', bn: 'মেডিকেল ক্লিয়ার', value: 57990 }, { stage: 'Trained', bn: 'প্রশিক্ষিত', value: 44810 }, { stage: 'Visa issued', bn: 'ভিসা প্রাপ্ত', value: 31240 }, { stage: 'Departed', bn: 'গমন করেছেন', value: 12561 },
]
export const waqfRevenueTrend = monthLabels.map((m, i) => ({ m, i, collected: 12.4 + i * 0.9 + R() * 2, target: 15 + i * 0.6 }))
export const complaintTrend = Array.from({ length: 14 }, (_, i) => ({ d: `${10 + i} May`, opened: int(8, 40), resolved: int(6, 38) }))
