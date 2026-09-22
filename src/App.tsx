import { Routes, Route, Navigate } from 'react-router-dom'
import Shell from './components/Shell'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Institutions from './pages/Institutions'
import InstitutionProfile from './pages/InstitutionProfile'
import Grants from './pages/Grants'
import Inspections from './pages/Inspections'
import GisMap from './pages/GisMap'
import Hajj from './pages/Hajj'
import HajjOperations from './pages/HajjOperations'
import HajjTraining from './pages/HajjTraining'
import Complaints from './pages/Complaints'
import Waqf from './pages/Waqf'
import WaqfLeases from './pages/WaqfLeases'
import Education from './pages/Education'
import Personnel from './pages/Personnel'
import Hrms from './pages/Hrms'
import Events from './pages/Events'
import Assistance from './pages/Assistance'
import Analytics from './pages/Analytics'
import Roadmap from './pages/Roadmap'
import CitizenPortal from './pages/CitizenPortal'

function Office({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/portal/*" element={<CitizenPortal />} />
      <Route path="/" element={<Office><Dashboard /></Office>} />
      <Route path="/institutions" element={<Office><Institutions /></Office>} />
      <Route path="/institutions/:id" element={<Office><InstitutionProfile /></Office>} />
      <Route path="/grants" element={<Office><Grants /></Office>} />
      <Route path="/inspections" element={<Office><Inspections /></Office>} />
      <Route path="/gis" element={<Office><GisMap /></Office>} />
      <Route path="/hajj" element={<Office><Hajj /></Office>} />
      <Route path="/hajj/operations" element={<Office><HajjOperations /></Office>} />
      <Route path="/hajj/training" element={<Office><HajjTraining /></Office>} />
      <Route path="/complaints" element={<Office><Complaints /></Office>} />
      <Route path="/waqf" element={<Office><Waqf /></Office>} />
      <Route path="/waqf/leases" element={<Office><WaqfLeases /></Office>} />
      <Route path="/education" element={<Office><Education /></Office>} />
      <Route path="/personnel" element={<Office><Personnel /></Office>} />
      <Route path="/hrms" element={<Office><Hrms /></Office>} />
      <Route path="/events" element={<Office><Events /></Office>} />
      <Route path="/assistance" element={<Office><Assistance /></Office>} />
      <Route path="/analytics" element={<Office><Analytics /></Office>} />
      <Route path="/roadmap" element={<Office><Roadmap /></Office>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
