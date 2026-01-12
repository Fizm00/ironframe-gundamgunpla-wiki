import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ComparisonProvider } from './context/ComparisonContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { GunplaListPage } from './pages/GunplaListPage';
import { GunplaDetailPage } from './pages/GunplaDetailPage';
import { MobileSuitListPage } from './pages/MobileSuitListPage';
import { MobileSuitDetailPage } from './pages/MobileSuitDetailPage';
import { ComparePage } from './pages/ComparePage';
import Pilots from './pages/Pilots';
import PilotDetail from './pages/PilotDetail';
import { Factions } from './pages/Factions';
import { FactionDetail } from './pages/FactionDetail';
import { RelationshipGraphPage } from './pages/RelationshipGraphPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { LoreList } from './pages/admin/LoreList';
import { LoreEditor } from './pages/admin/LoreEditor';
import { GunplaList } from './pages/admin/GunplaList';
import { GunplaEditor } from './pages/admin/GunplaEditor';
import { AdminRoute } from './components/auth/AdminRoute';
import { MobileSuitList } from './pages/admin/MobileSuitList';
import { MobileSuitEditor } from './pages/admin/MobileSuitEditor';
import { PilotList } from './pages/admin/PilotList';
import { PilotEditor } from './pages/admin/PilotEditor';
import { FactionList } from './pages/admin/FactionList';
import { FactionEditor } from './pages/admin/FactionEditor';
import { TimelineList } from './pages/admin/TimelineList';
import { TimelineEditor } from './pages/admin/TimelineEditor';
import { UserList } from './pages/admin/UserList';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicTimelineList } from './pages/public/timeline/TimelineList';
import { PublicTimelineDetail } from './pages/public/timeline/TimelineDetail';
import { HaroChat } from './components/haro/HaroChat';

function App() {
  return (
    <ComparisonProvider>
      <AppShell>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/gunpla" element={<GunplaListPage />} />
          <Route path="/gunpla/:id" element={<GunplaDetailPage />} />

          <Route path="/mobile-suits" element={<MobileSuitListPage />} />
          <Route path="/mobile-suits/:id" element={<MobileSuitDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />

          <Route path="/pilots" element={<Pilots />} />
          <Route path="/pilots/:id" element={<PilotDetail />} />

          <Route path="/factions" element={<Factions />} />
          <Route path="/factions/:id" element={<FactionDetail />} />

          <Route path="/relationships" element={<RelationshipGraphPage />} />

          <Route path="/timeline" element={<PublicTimelineList />} />
          <Route path="/timeline/:id" element={<PublicTimelineDetail />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminOverview />} />

              <Route path="timeline" element={<TimelineList />} />
              <Route path="timeline/new" element={<TimelineEditor />} />
              <Route path="timeline/:id/edit" element={<TimelineEditor />} />

              <Route path="factions" element={<FactionList />} />
              <Route path="factions/new" element={<FactionEditor />} />
              <Route path="factions/:id/edit" element={<FactionEditor />} />

              <Route path="pilots" element={<PilotList />} />
              <Route path="pilots/new" element={<PilotEditor />} />
              <Route path="pilots/:id/edit" element={<PilotEditor />} />

              <Route path="lore" element={<LoreList />} />
              <Route path="lore/new" element={<LoreEditor />} />
              <Route path="lore/:id/edit" element={<LoreEditor />} />

              <Route path="mobile-suits" element={<MobileSuitList />} />
              <Route path="mobile-suits/new" element={<MobileSuitEditor />} />
              <Route path="mobile-suits/:id/edit" element={<MobileSuitEditor />} />

              <Route path="gunpla" element={<GunplaList />} />
              <Route path="gunpla/new" element={<GunplaEditor />} />
              <Route path="gunpla/:id/edit" element={<GunplaEditor />} />

              <Route path="users" element={<UserList />} />

              <Route path="analytics" element={<Analytics />} />

              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
        <HaroChat />
      </AppShell>
    </ComparisonProvider>
  );
}

export default App;
