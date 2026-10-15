import React from 'react';
import { 
  BookOpen, 
  ClipboardCheck, 
  Dumbbell, 
  UserCheck, 
  Printer, 
  Sparkles, 
  HeartHandshake,
  Activity,
  Layers
} from 'lucide-react';
import { TabType, CaseProfile } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  cases: CaseProfile[];
  currentCaseId: string;
  onSelectCase: (caseId: string) => void;
  onOpenAiAssistant: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cases,
  currentCaseId,
  onSelectCase,
  onOpenAiAssistant,
  searchQuery,
  setSearchQuery
}) => {
  const currentCase = cases.find(c => c.id === currentCaseId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span className="text-orange-600 font-extrabold">WaCare</span>
                  <span className="text-slate-800">職能復能雲</span>
                </span>
                <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  KM · OT
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                職能治療數位知識庫與臨床復能協作平台
              </p>
            </div>
          </div>

          {/* Quick Global Search */}
          <div className="hidden md:flex flex-1 max-w-md items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋臨床指引、巴氏量表、活動教案、長照CA代碼、輔具規格..."
              aria-label="搜尋臨床指引、評估量表與活動教案"
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-slate-400"
            />
            <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Active Case Selector & AI Tool Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Case Quick Dropdown */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 rounded-lg p-1 border border-slate-200 text-xs">
              <span className="text-slate-500 px-2 font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                當前個案:
              </span>
              <select
                value={currentCaseId}
                onChange={(e) => onSelectCase(e.target.value)}
                aria-label="選擇當前個案"
                className="bg-white font-medium text-slate-800 rounded px-2.5 py-1 border border-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.age}歲 / CMS {c.cmsLevel}級)
                  </option>
                ))}
              </select>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs hover:shadow-md hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white/30" />
              <span>AI 臨床復能助理</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-100 overflow-x-auto py-2 scrollbar-none text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'knowledge'
                ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>臨床指引與長照規準</span>
          </button>

          <button
            onClick={() => setActiveTab('assessments')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'assessments'
                ? 'bg-teal-50 text-teal-700 font-semibold border border-teal-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-teal-600" />
            <span>標準量表箱 (Barthel / IADL / TUG)</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-blue-600" />
            <span>活動分析與教案庫 (Grading)</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'cases'
                ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>個案復能計畫 (SMART / GAS / SOAP)</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'education'
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>衛教單張與圖解指引</span>
          </button>
        </div>
      </div>
    </header>
  );
};
