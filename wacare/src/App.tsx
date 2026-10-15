/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, CaseProfile } from './types';
import { INITIAL_CASES } from './data/sampleCases';
import { Navbar } from './components/Navbar';
import { KnowledgeBaseTab } from './components/KnowledgeBaseTab';
import { AssessmentToolsTab } from './components/AssessmentToolsTab';
import { ActivityLibraryTab } from './components/ActivityLibraryTab';
import { CasePlanTab } from './components/CasePlanTab';
import { EducationHandoutsTab } from './components/EducationHandoutsTab';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { 
  HeartHandshake, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  ClipboardCheck,
  Dumbbell
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('knowledge');
  const [cases, setCases] = useState<CaseProfile[]>(INITIAL_CASES);
  const [currentCaseId, setCurrentCaseId] = useState<string>(INITIAL_CASES[0]?.id || 'case-001');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  const currentCase = cases.find(c => c.id === currentCaseId) || cases[0];

  const handleUpdateCase = (updated: CaseProfile) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleCreateCase = (newCase: CaseProfile) => {
    setCases(prev => [newCase, ...prev]);
    setCurrentCaseId(newCase.id);
    setActiveTab('cases');
  };

  const handleUpdateCaseScore = (caseId: string, scores: { barthel?: number; iadl?: number; tug?: number }) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        ...(scores.barthel !== undefined ? { barthelScore: scores.barthel } : {}),
        ...(scores.iadl !== undefined ? { iadlScore: scores.iadl } : {}),
        ...(scores.tug !== undefined ? { tugScore: scores.tug } : {}),
      };
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cases={cases}
        currentCaseId={currentCaseId}
        onSelectCase={setCurrentCaseId}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'knowledge' && (
          <KnowledgeBaseTab 
            searchQuery={searchQuery} 
            onOpenAiWithPrompt={(p) => {
              setIsAiDrawerOpen(true);
            }} 
          />
        )}

        {activeTab === 'assessments' && (
          <AssessmentToolsTab
            currentCase={currentCase}
            onUpdateCaseScore={handleUpdateCaseScore}
          />
        )}

        {activeTab === 'activities' && (
          <ActivityLibraryTab
            currentCase={currentCase}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'cases' && (
          <CasePlanTab
            cases={cases}
            currentCase={currentCase}
            onSelectCase={setCurrentCaseId}
            onUpdateCase={handleUpdateCase}
            onCreateNewCase={handleCreateCase}
          />
        )}

        {activeTab === 'education' && (
          <EducationHandoutsTab
            currentCase={currentCase}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* AI Assistant Slide-over Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        currentCase={currentCase}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
              W
            </div>
            <span className="font-bold text-slate-700">
              WaCare 職能治療數位知識管理平台 (KM - Occupational Therapy)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>遵循臺灣衛生福利部長照 2.0 專業服務規範 (CA01~CA04)</span>
            <span>·</span>
            <span>臺灣職能治療學會 (TOTA) 實務準則</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
