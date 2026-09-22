import { useState } from 'react'
import { BookOpen, Users, UserCheck, Award, Plus } from 'lucide-react'
import { useLang, fmtNum } from '../i18n'
import { PageHeader, Card, CardHeader, StatTile, Table, Badge, Progress, Modal, KV, Stepper, type Column } from '../components/ui'
import { courses, type Course } from '../data/mock'

export default function Education() {
  const { t, L, lang } = useLang()
  const [sel, setSel] = useState<Course | null>(null)
  const students = courses.reduce((a, c) => a + c.students, 0)
  const teachers = courses.reduce((a, c) => a + c.teachers, 0)
  const certs = courses.reduce((a, c) => a + c.certificates, 0)
  const cols: Column<Course>[] = [
    { key: 'id', header: 'Course ID', render: (r) => <span className="mono-id">{r.id}</span> },
    { key: 'name', header: L('কোর্স / কার্যক্রম', 'Course / program'), render: (r) => <div><div className="font-medium bn">{L(r.nameBn, r.nameEn)}</div><div className="text-xs text-slate-500 bn">{r.centre}</div></div> },
    { key: 'batches', header: L('ব্যাচ', 'Batches'), align: 'right', render: (r) => fmtNum(r.batches, lang) },
    { key: 'students', header: L('শিক্ষার্থী', 'Students'), align: 'right', render: (r) => fmtNum(r.students, lang) },
    { key: 'teachers', header: L('শিক্ষক', 'Teachers'), align: 'right', render: (r) => fmtNum(r.teachers, lang) },
    { key: 'pass', header: L('পাসের হার', 'Pass rate'), render: (r) => r.passRate ? <div className="w-24"><div className="text-[11px] tabular-nums font-semibold mb-1">{fmtNum(r.passRate, lang)}%</div><Progress value={r.passRate} target={85} /></div> : '—' },
    { key: 'cert', header: L('সনদ', 'Certificates'), align: 'right', render: (r) => fmtNum(r.certificates, lang) },
    { key: 'status', header: t('status'), render: (r) => <Badge>{r.status}</Badge> },
  ]
  return (
    <div>
      <PageHeader kicker={L('মডিউল ১১ · ধর্মীয় শিক্ষা ব্যবস্থাপনা', 'MODULE 11 · RELIGIOUS EDUCATION MANAGEMENT')} title={t('education')}
        subtitle={L('শিক্ষক ও শিক্ষার্থী নিবন্ধন → কেন্দ্র → কোর্স → ব্যাচ → উপস্থিতি → পরীক্ষা → ফলাফল → সনদ', 'Teacher & student registration → Centre → Course → Batch → Attendance → Exam → Result → Certificate')}
        actions={<button className="btn-primary"><Plus size={15} /> {L('নতুন কোর্স', 'New course')}</button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label={L('সক্রিয় কোর্স / কার্যক্রম', 'Active courses / programs')} value={courses.filter((c) => c.status === 'Ongoing').length} icon={BookOpen} hint={`${courses.length} ${L('মোট', 'total')}`} />
        <StatTile label={L('নিবন্ধিত শিক্ষার্থী', 'Registered students')} value={students} icon={Users} tone="sky" />
        <StatTile label={L('নিবন্ধিত শিক্ষক', 'Registered teachers')} value={teachers} icon={UserCheck} tone="emerald" />
        <StatTile label={L('ডিজিটাল সনদ', 'Digital certificates')} value={certs} icon={Award} tone="violet" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card padded={false} className="lg:col-span-2"><Table columns={cols} rows={courses} onRowClick={setSel} /></Card>
        <Card>
          <CardHeader title={L('কার্যক্রম পরিচালনাকারী সংস্থা', 'Implementing agencies')} />
          {[['ইসলামিক ফাউন্ডেশন', 'Islamic Foundation', 2], ['হিন্দু ধর্মীয় কল্যাণ ট্রাস্ট', 'Hindu Religious Welfare Trust', 2], ['বৌদ্ধ ধর্মীয় কল্যাণ ট্রাস্ট', 'Buddhist Religious Welfare Trust', 1], ['খ্রিস্টান ধর্মীয় কল্যাণ ট্রাস্ট', 'Christian Religious Welfare Trust', 1], ['ইমাম প্রশিক্ষণ একাডেমি', 'Imam Training Academy', 1], ['ধর্ম বিষয়ক মন্ত্রণালয়', 'Ministry of Religious Affairs', 1]].map(([bn, en, n]) => <div key={en as string} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm"><span className="bn">{L(bn as string, en as string)}</span><span className="badge bg-slate-100 text-slate-700 tabular-nums">{fmtNum(n as number, lang)}</span></div>)}
          <div className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-800 bn">{L('মসজিদ/মন্দির/প্যাগোডা/গির্জাভিত্তিক শিশু ও গণশিক্ষা কার্যক্রমের প্রতিটি কেন্দ্র Institution ID-এর সাথে সংযুক্ত থাকবে।', 'Every mosque/temple/pagoda/church-based education centre is linked to its Institution ID.')}</div>
        </Card>
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} title={<span className="bn">{sel && L(sel.nameBn, sel.nameEn)}</span>} footer={<button className="btn-secondary" onClick={() => setSel(null)}>{t('close')}</button>}>
        {sel && (<div>
          <div className="mb-4 overflow-x-auto"><Stepper steps={[L('নিবন্ধন', 'Registration'), L('কেন্দ্র', 'Centre'), L('ব্যাচ', 'Batch'), L('উপস্থিতি', 'Attendance'), L('পরীক্ষা', 'Exam'), L('ফলাফল', 'Result'), L('সনদ', 'Certificate')]} current={sel.status === 'Completed' ? 6 : sel.status === 'Ongoing' ? 3 : 1} /></div>
          <KV k="Course ID" v={sel.id} mono /><KV k={L('পরিচালনাকারী', 'Centre')} v={<span className="bn">{sel.centre}</span>} /><KV k={L('ব্যাচ', 'Batches')} v={fmtNum(sel.batches, lang)} /><KV k={L('শিক্ষার্থী', 'Students')} v={fmtNum(sel.students, lang)} /><KV k={L('শিক্ষক', 'Teachers')} v={fmtNum(sel.teachers, lang)} /><KV k={L('পাসের হার', 'Pass rate')} v={sel.passRate ? `${fmtNum(sel.passRate, lang)}%` : '—'} /><KV k={L('সনদ', 'Certificates')} v={fmtNum(sel.certificates, lang)} /><KV k={t('status')} v={<Badge>{sel.status}</Badge>} />
        </div>)}
      </Modal>
    </div>
  )
}
