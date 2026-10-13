import React, { useState } from 'react';
import { SupportedLanguage, Grievance } from './types';
import { Header } from './components/Header';
import { ChatAssistant } from './components/ChatAssistant';
import { GrievanceTracker } from './components/GrievanceTracker';
import { DirectRegisterForm } from './components/DirectRegisterForm';
import { OfficerDashboard } from './components/OfficerDashboard';
import { CieArchitectureViva } from './components/CieArchitectureViva';
import { OfficialReceiptModal } from './components/OfficialReceiptModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'assistant' | 'track' | 'register' | 'officer' | 'cie'>('assistant');
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('GRV-2026-1042');
  const [receiptGrievance, setReceiptGrievance] = useState<Grievance | null>(null);

  const handleNavigateToTrack = (id: string) => {
    setSelectedTrackId(id);
    setActiveTab('track');
  };

  const handleOpenReceipt = (g: Grievance) => {
    setReceiptGrievance(g);
  };

  const handleRunTestScenario = (promptText: string) => {
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-10">
        {activeTab === 'assistant' && (
          <ChatAssistant
            language={language}
            onNavigateToTrack={handleNavigateToTrack}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'track' && (
          <GrievanceTracker
            language={language}
            initialId={selectedTrackId}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'register' && (
          <DirectRegisterForm
            language={language}
            onNavigateToTrack={handleNavigateToTrack}
            onOpenReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerDashboard
            onOpenReceipt={handleOpenReceipt}
            onInspectGrievance={handleNavigateToTrack}
          />
        )}

        {activeTab === 'cie' && (
          <CieArchitectureViva
            onRunTestScenario={handleRunTestScenario}
          />
        )}
      </main>

      {/* Official Printable Receipt Modal */}
      <OfficialReceiptModal
        grievance={receiptGrievance}
        onClose={() => setReceiptGrievance(null)}
      />
    </div>
  );
}
