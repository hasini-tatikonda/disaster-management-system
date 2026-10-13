import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { EmergencyBanner } from './components/EmergencyBanner';
import { SOSWizardModal } from './components/SOSWizardModal';
import { ActiveRescueStatusModal } from './components/ActiveRescueStatusModal';

// Citizen Pages
import { CitizenHome } from './pages/citizen/CitizenHome';
import { AlertsPage } from './pages/citizen/AlertsPage';
import { GuidesPage } from './pages/citizen/GuidesPage';
import { SafeGuideAIPage } from './pages/citizen/SafeGuideAIPage';
import { NearbyHelpPage } from './pages/citizen/NearbyHelpPage';
import { EmergencyKitPage } from './pages/citizen/EmergencyKitPage';
import { ContactsPage } from './pages/citizen/ContactsPage';
import { EvacuationPage } from './pages/citizen/EvacuationPage';
import { AboutPage } from './pages/citizen/AboutPage';

// Organizer Pages
import { ControlCenterLogin } from './pages/organizer/ControlCenterLogin';
import { ControlCenterDashboard } from './pages/organizer/ControlCenterDashboard';

// Responder Pages
import { ResponderLogin } from './pages/responder/ResponderLogin';
import { ResponderDashboard } from './pages/responder/ResponderDashboard';

// Donation Center Page
import { DonationCenterPage } from './pages/donation/DonationCenterPage';

const MainAppContent: React.FC = () => {
  const { userEnvironment, setUserEnvironment, organizerLoggedIn, responderSessionId, activeTheme } = useApp();

  const [activeCitizenTab, setActiveCitizenTab] = useState<string>('home');
  const [sosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [rescueStatusModalOpen, setRescueStatusModalOpen] = useState<boolean>(false);

  const handleNavigate = (page: string) => {
    if (page === 'donations') {
      setUserEnvironment('donation-center');
    } else {
      setActiveCitizenTab(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theme-dependent background styling for app root container
  const getThemeBgClass = () => {
    return activeTheme === 'dark'
      ? 'bg-slate-950 text-slate-100 dark'
      : 'bg-slate-100 text-slate-900';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${getThemeBgClass()}`}>
      
      {/* Top Header Navigation Bar */}
      <Header
        activeTab={activeCitizenTab}
        onNavigate={handleNavigate}
      />

      {/* Emergency Active Status Banner for Citizen */}
      {userEnvironment === 'citizen' && (
        <EmergencyBanner onViewStatus={() => setRescueStatusModalOpen(true)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* CITIZEN ENVIRONMENT */}
        {userEnvironment === 'citizen' && (
          <>
            {activeCitizenTab === 'home' && (
              <CitizenHome
                onOpenSOSModal={() => setSosModalOpen(true)}
                onOpenRescueStatusModal={() => setRescueStatusModalOpen(true)}
                onNavigate={handleNavigate}
              />
            )}
            {activeCitizenTab === 'alerts' && <AlertsPage />}
            {activeCitizenTab === 'guides' && <GuidesPage />}
            {activeCitizenTab === 'ai' && (
              <SafeGuideAIPage onOpenSOSModal={() => setSosModalOpen(true)} />
            )}
            {activeCitizenTab === 'nearby' && <NearbyHelpPage />}
            {activeCitizenTab === 'kit' && <EmergencyKitPage />}
            {activeCitizenTab === 'contacts' && <ContactsPage />}
            {activeCitizenTab === 'evacuation' && (
              <EvacuationPage onNavigate={handleNavigate} />
            )}
            {activeCitizenTab === 'about' && <AboutPage />}
          </>
        )}

        {/* CONTROL CENTER ENVIRONMENT */}
        {userEnvironment === 'control-center' && (
          <>
            {!organizerLoggedIn ? <ControlCenterLogin /> : <ControlCenterDashboard />}
          </>
        )}

        {/* RESPONDER PORTAL ENVIRONMENT */}
        {userEnvironment === 'responder' && (
          <>
            {!responderSessionId ? <ResponderLogin /> : <ResponderDashboard />}
          </>
        )}

        {/* DONATION CENTER ENVIRONMENT */}
        {userEnvironment === 'donation-center' && (
          <DonationCenterPage />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">
            🚨 ResQ — Smart India Hackathon (SIH) Emergency Response & Rescue System
          </p>
          <p>
            Operating with simulated demo records for testing. No live emergency signals are transmitted to government services.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation for Citizen */}
      <MobileNav
        activeTab={activeCitizenTab}
        onNavigate={handleNavigate}
        onOpenSOSModal={() => setSosModalOpen(true)}
      />

      {/* SOS Wizard Progressive Input Modal */}
      <SOSWizardModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        onIncidentCreated={() => {
          handleNavigate('home');
          setRescueStatusModalOpen(true);
        }}
      />

      {/* Active Rescue Dispatch Status Modal */}
      <ActiveRescueStatusModal
        isOpen={rescueStatusModalOpen}
        onClose={() => setRescueStatusModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
