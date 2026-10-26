import { useState, useEffect } from 'react';
import { StoreProvider } from './store';
import { NavCtx } from './nav';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PresentationMode } from './components/PresentationMode';
import type { PageId } from './types';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { BoatDetailPage } from './pages/BoatDetailPage';
import { BookingPage } from './pages/BookingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { RenterOnboardingPage } from './pages/RenterOnboardingPage';
import { ProjectPage } from './pages/ProjectPage';
import { CommissionPage } from './pages/CommissionPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { OwnerBoatsPage } from './pages/OwnerBoatsPage';
import { OwnerRequestsPage } from './pages/OwnerRequestsPage';
import { RentalFlowPage } from './pages/RentalFlowPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  const [page, setPage] = useState<PageId>('home');
  const [param, setParam] = useState<string | undefined>(undefined);
  const [presentation, setPresentation] = useState<boolean>(false);

  const go = (p: PageId, paramValue?: string) => {
    setPage(p);
    setParam(paramValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Restore presentation preference
    try {
      const stored = localStorage.getItem('pns_presentation');
      if (stored === 'true') setPresentation(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pns_presentation', String(presentation));
    } catch {
      // ignore
    }
  }, [presentation]);

  const isLogin = page === 'login';
  const showChrome = !isLogin;

  return (
    <StoreProvider>
      <NavCtx.Provider value={{ page, param, go, presentation, setPresentation }}>
        <div className="flex min-h-screen flex-col">
          {showChrome && <Navbar />}
          <main className="flex-1">
            <PageRouter page={page} param={param} />
          </main>
          {showChrome && <Footer />}
          {presentation && <PresentationMode />}
        </div>
      </NavCtx.Provider>
    </StoreProvider>
  );
}

function PageRouter({ page, param }: { page: PageId; param?: string }) {
  switch (page) {
    case 'home':
      return <HomePage />;
    case 'catalog':
      return <CatalogPage />;
    case 'boat':
      return param ? <BoatDetailPage boatId={param} /> : <CatalogPage />;
    case 'booking':
      return param ? <BookingPage params={param} /> : <CatalogPage />;
    case 'booking-confirm':
      return <CatalogPage />;
    case 'how-it-works':
      return <HowItWorksPage />;
    case 'renter-onboarding':
      return <RenterOnboardingPage />;
    case 'project':
      return <ProjectPage />;
    case 'commission':
      return <CommissionPage />;
    case 'owner-dashboard':
      return <OwnerDashboardPage />;
    case 'owner-boats':
      return <OwnerBoatsPage />;
    case 'owner-requests':
      return <OwnerRequestsPage />;
    case 'rental-flow':
      return <RentalFlowPage />;
    case 'admin':
      return <AdminPage />;
    case 'login':
      return <LoginPage />;
    default:
      return <HomePage />;
  }
}

export default App;
