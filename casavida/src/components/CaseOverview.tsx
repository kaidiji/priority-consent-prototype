import React, { useState, useMemo } from 'react';
import { 
  Upload, 
  Cloud, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight, 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Megaphone, 
  Edit3, 
  Filter, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { CaseItem } from '../types';
import { StatusIndicator } from './StatusIndicator';
import { calculateGreenPrescriptionMetrics } from '../utils/greenPrescriptionMetrics';

// 「設定專家建議」：與 WaCare 分頁共用 localStorage，以專家帳號為單位。
// - 優先授權：民眾追蹤專家並關閉打招呼視窗後，是否自動帶出數據授權頁（預設關閉）。
// - 建議健康數據：勾選的項目會出現在民眾端數據授權頁的「專家建議」裡。
const PRIORITY_AUTH_KEY = 'wacare-casavida-priority-auth-v2';
const EXPERT_ADVICE_KEY = 'wacare-casavida-expert-advice-v2';
const PRIORITY_AUTH_EXPERT_ID = 'aimee';

const ADVICE_OPTIONS = [
  '空汙', '血壓', '就醫紀錄', '血糖', '筆記', '回診', '氣象', '活動量', '男性健康', '體重',
  '偏頭痛', '頑固型血壓', '巴金森氏症', '中風', '問卷', '檢驗', '用藥', '數位社會處方', '風險預測', '飲食',
];
// 預設勾選：與 WaCare 授權頁「專家建議」原本打勾的項目一致。
const ADVICE_DEFAULT = ['血糖', '筆記', '氣象', '男性健康', '回診'];

const readStore = (key: string): Record<string, unknown> => {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
};

const readPriorityAuth = (): boolean => readStore(PRIORITY_AUTH_KEY)[PRIORITY_AUTH_EXPERT_ID] === true;

const readExpertAdvice = (): string[] => {
  const saved = readStore(EXPERT_ADVICE_KEY)[PRIORITY_AUTH_EXPERT_ID];
  return Array.isArray(saved) ? (saved as string[]) : ADVICE_DEFAULT;
};

const AdviceCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
    {checked ? (
      <>
        <rect x="2.33" y="2.33" width="23.33" height="23.33" rx="2.9" fill="#F08327" />
        <path d="M22.86 9.22 12.29 21.11 5.14 13.96l2.48-2.47 4.52 4.52 8.1-9.12 2.62 2.33Z" fill="white" />
      </>
    ) : (
      <rect x="2.9" y="2.9" width="22.2" height="22.2" rx="2.3" stroke="#898989" strokeWidth="1.17" />
    )}
  </svg>
);

interface CaseOverviewProps {
  cases: CaseItem[];
  onSelectCaseForPrescription: (caseItem: CaseItem) => void;
  onOpenEditNote: (caseItem: CaseItem) => void;
  onImportData: () => void;
  onConnectData: () => void;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({
  cases,
  onSelectCaseForPrescription,
  onOpenEditNote,
  onImportData,
  onConnectData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('全部');
  const [activationStatus, setActivationStatus] = useState('已開通');
  const [collectionCategory, setCollectionCategory] = useState('全部');
  const [sortOrder, setSortOrder] = useState('個案關注(舊-新)');
  const [currentDate, setCurrentDate] = useState('2026年8月19日 (星期三)');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    '血壓',
    '活動量',
    '體重',
    '空污',
    '就醫紀錄',
    '筆記',
    '回診',
    '氣象',
    '血糖',
    '當週衛教',
    '頑固型血壓',
    '偏頭痛',
    '巴金森氏症',
    '中風',
    '問卷',
    '檢驗',
    '用藥',
    '數位社會處方',
    '風險預測',
    '飲食'
  ]);
  const [showColumnEditor, setShowColumnEditor] = useState(false);
  const [showExpertAdviseModal, setShowExpertAdviseModal] = useState(false);
  const [adviceDraft, setAdviceDraft] = useState<string[]>([]);
  const [priorityDraft, setPriorityDraft] = useState(false);
  const [adviceSaved, setAdviceSaved] = useState(false);

  const openExpertAdvice = () => {
    setAdviceDraft(readExpertAdvice());
    setPriorityDraft(readPriorityAuth());
    setAdviceSaved(false);
    setShowExpertAdviseModal(true);
  };

  const toggleAdviceItem = (item: string) => {
    setAdviceSaved(false);
    setAdviceDraft((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  };

  const saveExpertAdvice = () => {
    try {
      const advice = readStore(EXPERT_ADVICE_KEY);
      const priority = readStore(PRIORITY_AUTH_KEY);
      localStorage.setItem(
        EXPERT_ADVICE_KEY,
        JSON.stringify({ ...advice, [PRIORITY_AUTH_EXPERT_ID]: ADVICE_OPTIONS.filter((x) => adviceDraft.includes(x)) }),
      );
      localStorage.setItem(PRIORITY_AUTH_KEY, JSON.stringify({ ...priority, [PRIORITY_AUTH_EXPERT_ID]: priorityDraft }));
    } catch {
      // localStorage 不可用時僅維持畫面狀態
    }
    setAdviceSaved(true);
  };

  // Filtered and Sorted Cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.notes.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (selectedFilter === '需關注') {
        return c.bloodPressure.status === 'concern' || c.activity.status === 'concern';
      }

      return true;
    });
  }, [cases, searchQuery, selectedFilter]);

  return (
    <div id="case-overview-view" className="w-full space-y-4">
      {/* Top Pagination Bar matching attachment */}
      <div className="flex items-center justify-center gap-1.5 py-1">
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentPage === pageNum
                ? 'bg-[#f08327] text-white shadow-xs'
                : 'bg-white text-[#f08327] border border-[#f08327] hover:bg-orange-50'
            }`}
          >
            {pageNum}
          </button>
        ))}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:text-[#f08327] cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-[#f08327] cursor-pointer">
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          id="import-case-data-btn"
          type="button"
          onClick={onImportData}
          className="flex items-center gap-2 px-4 py-2 bg-[#f08327] hover:bg-[#d96e19] text-white font-bold text-sm rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>匯入個案資料</span>
        </button>

        <button
          id="connect-data-btn"
          type="button"
          onClick={onConnectData}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-orange-50 border border-[#f08327] text-[#f08327] font-bold text-sm rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
        >
          <Cloud className="w-4 h-4" />
          <span>串接資料</span>
        </button>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent pt-1">
        {/* Date Navigator */}
        <div className="flex items-center gap-2 text-zinc-800 font-bold text-sm sm:text-base">
          <button
            onClick={() => setCurrentDate('2026年8月18日 (星期二)')}
            className="p-1 hover:text-[#f08327] rounded-md transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-[#f08327]" />
          </button>
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-zinc-200 shadow-2xs">
            <span className="font-semibold">{currentDate}</span>
          </div>
          <button
            onClick={() => setCurrentDate('2026年8月20日 (星期四)')}
            className="p-1 hover:text-[#f08327] rounded-md transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-[#f08327]" />
          </button>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Search Box */}
          <div className="relative">
            <input
              id="search-cases-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋個案 (姓名/代碼/註記)"
              className="w-48 sm:w-56 pl-3 pr-8 py-2 bg-white rounded-lg border border-zinc-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f08327]"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <button
            title="系統使用指南"
            className="p-2 text-zinc-400 hover:text-zinc-700 bg-white rounded-lg border border-zinc-300 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* 篩選 */}
          <div className="flex flex-col">
            <select
              id="filter-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 bg-white rounded-lg border border-zinc-300 text-xs sm:text-sm font-medium text-zinc-700 cursor-pointer focus:ring-2 focus:ring-[#f08327]"
            >
              <option value="全部">篩選：全部</option>
              <option value="需關注">篩選：需高度關注</option>
            </select>
          </div>

          {/* 開通狀態 */}
          <div className="flex flex-col">
            <select
              id="activation-select"
              value={activationStatus}
              onChange={(e) => setActivationStatus(e.target.value)}
              className="px-3 py-2 bg-white rounded-lg border border-zinc-300 text-xs sm:text-sm font-medium text-zinc-700 cursor-pointer focus:ring-2 focus:ring-[#f08327]"
            >
              <option value="已開通">開通狀態：已開通</option>
              <option value="全部">開通狀態：全部</option>
              <option value="待開通">開通狀態：待開通</option>
            </select>
          </div>

          {/* 收集類別 */}
          <div className="flex flex-col">
            <select
              id="collection-select"
              value={collectionCategory}
              onChange={(e) => setCollectionCategory(e.target.value)}
              className="px-3 py-2 bg-white rounded-lg border border-zinc-300 text-xs sm:text-sm font-medium text-zinc-700 cursor-pointer focus:ring-2 focus:ring-[#f08327]"
            >
              <option value="全部">收案類別：全部</option>
              <option value="全人計畫">收案類別：全人計畫</option>
              <option value="長照整合">收案類別：長照整合</option>
            </select>
          </div>

          {/* 排序 */}
          <div className="flex flex-col">
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-white rounded-lg border border-zinc-300 text-xs sm:text-sm font-medium text-zinc-700 cursor-pointer focus:ring-2 focus:ring-[#f08327]"
            >
              <option value="個案關注(舊-新)">排序：個案關注(舊-新)</option>
              <option value="個案關注(新-舊)">排序：個案關注(新-舊)</option>
              <option value="處方達成率">排序：處方達成率 (高-低)</option>
              <option value="活動量">排序：活動量 (高-低)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden">
        {/* Table Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900">個案狀態管理</h2>
            <button
              id="btn-expert-advise"
              type="button"
              onClick={openExpertAdvice}
              className="text-xs text-white bg-[#f08327] hover:bg-[#d96e19] rounded-full px-3 py-1 font-bold cursor-pointer transition-colors shadow-2xs"
            >
              設定專家建議
            </button>
            <button
              id="btn-edit-columns"
              type="button"
              onClick={() => setShowColumnEditor(!showColumnEditor)}
              className="text-xs text-white bg-[#f08327] hover:bg-[#d96e19] rounded-full px-3 py-1 font-bold cursor-pointer transition-colors shadow-2xs"
            >
              編輯欄位
            </button>
          </div>

          {/* Status Legends matching attachment */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 font-semibold mt-2 sm:mt-0">
            <div className="flex items-center gap-1">
              <StatusIndicator level="concern" size={20} />
              <span>關注</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusIndicator level="attention" size={20} />
              <span>注意</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusIndicator level="normal" size={20} />
              <span>正常</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusIndicator level="good" size={20} />
              <span>良好</span>
            </div>
            <div className="flex items-center gap-1">
              <StatusIndicator level="none" size={20} />
              <span>無狀態</span>
            </div>
          </div>
        </div>

        {/* Column editor drawer toggle */}
        {showColumnEditor && (
          <div className="p-4 bg-amber-50/70 border-b border-amber-200 text-xs">
            <div className="font-bold text-amber-900 mb-2 flex items-center gap-1">
              <SlidersHorizontal className="w-4 h-4 text-[#f08327]" />
              <span>勾選欲顯示之生理與處方欄位：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['血壓', '活動量', '體重', '空污', '就醫紀錄', '筆記', '回診', '氣象', '血糖', '當週衛教', '頑固型血壓', '偏頭痛', '巴金森氏症', '中風', '問卷', '檢驗', '用藥', '數位社會處方', '風險預測', '飲食'].map((col) => {
                const isChecked = visibleColumns.includes(col);
                return (
                  <label key={col} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-amber-300 text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setVisibleColumns([...visibleColumns, col]);
                        } else {
                          setVisibleColumns(visibleColumns.filter((c) => c !== col));
                        }
                      }}
                      className="rounded text-[#f08327] focus:ring-[#f08327]"
                    />
                    <span>{col}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-zinc-200 text-zinc-700 text-xs font-bold uppercase">
                <th className="py-3 px-4 min-w-[200px] sticky left-0 bg-[#F6F8FA] z-10 shadow-r">
                  姓名 / 代碼
                </th>
                {visibleColumns.includes('血壓') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[100px]">血壓</th>
                )}
                {visibleColumns.includes('活動量') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">活動量</th>
                )}
                
                {visibleColumns.includes('體重') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[100px]">體重</th>
                )}
                {visibleColumns.includes('空污') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">空污</th>
                )}
                {visibleColumns.includes('就醫紀錄') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">就醫紀錄</th>
                )}
                {visibleColumns.includes('筆記') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">筆記</th>
                )}
                {visibleColumns.includes('回診') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">回診</th>
                )}
                {visibleColumns.includes('氣象') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">氣象</th>
                )}
                {visibleColumns.includes('血糖') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[100px]">血糖</th>
                )}
                {visibleColumns.includes('當週衛教') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">當週衛教</th>
                )}
                {visibleColumns.includes('頑固型血壓') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">頑固型血壓</th>
                )}
                {visibleColumns.includes('偏頭痛') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">偏頭痛</th>
                )}
                {visibleColumns.includes('巴金森氏症') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">巴金森氏症</th>
                )}
                {visibleColumns.includes('中風') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">中風</th>
                )}
                {visibleColumns.includes('問卷') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">問卷</th>
                )}
                {visibleColumns.includes('檢驗') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">檢驗</th>
                )}
                {visibleColumns.includes('用藥') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">用藥</th>
                )}
                {visibleColumns.includes('數位社會處方') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[100px]">數位社會處方</th>
                )}
                {visibleColumns.includes('風險預測') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">風險預測</th>
                )}
                {visibleColumns.includes('飲食') && (
                  <th className="py-3 px-3 text-center whitespace-nowrap min-w-[80px]">飲食</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/80 bg-white">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={24} className="text-center py-12 text-zinc-400">
                    查無符合條件之個案資料
                  </td>
                </tr>
              ) : (
                filteredCases.map((caseItem) => {
                  const prescriptionMetrics = calculateGreenPrescriptionMetrics(caseItem);
                  return (
                  <tr
                    key={caseItem.id}
                    className="hover:bg-amber-50/40 transition-colors group"
                  >
                    {/* Patient Profile Column (Sticky) */}
                    <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-amber-50/60 z-10 shadow-r">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center overflow-hidden">
                            {/* Illustration matching WaCare attachment */}
                            <svg viewBox="0 0 80 80" className="w-full h-full">
                              <rect width="80" height="80" fill="#E2E8F0" />
                              <circle cx="40" cy="30" r="16" fill="#F08327" />
                              <path d="M20 70C20 54 30 46 40 46C50 46 60 54 60 70" fill="#CBD5E1" />
                              <circle cx="34" cy="28" r="2" fill="white" />
                              <circle cx="46" cy="28" r="2" fill="white" />
                              <path d="M36 34Q40 38 44 34" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </svg>
                          </div>
                        </div>

                        {/* Name & Quick Action Icons */}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span 
                              onClick={() => onSelectCaseForPrescription(caseItem)}
                              className="font-bold text-zinc-800 hover:text-[#f08327] cursor-pointer text-base"
                            >
                              {caseItem.nickname || caseItem.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              #{caseItem.code.slice(0, 6)}
                            </span>
                          </div>

                          {/* Action Buttons (Message & Megaphone) */}
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              title="傳送專屬訊息"
                              onClick={() => alert(`即時傳送衛教與叮嚀訊息至 ${caseItem.name} 的 WaCare App`)}
                              className="p-1 text-zinc-400 hover:text-[#f08327] hover:bg-orange-50 rounded transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="發送緊急推播與健康廣播"
                              onClick={() => alert(`發送即時推播給 ${caseItem.name}`)}
                              className="p-1 text-zinc-400 hover:text-[#f08327] hover:bg-orange-50 rounded transition-colors"
                            >
                              <Megaphone className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="編輯個案註記"
                              onClick={() => onOpenEditNote(caseItem)}
                              className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-[#f08327] px-1 py-0.5 rounded hover:bg-orange-50 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>註記</span>
                            </button>
                          </div>

                          {caseItem.notes && (
                            <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-[150px] mt-0.5">
                              {caseItem.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 血壓 */}
                    {visibleColumns.includes('血壓') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <StatusIndicator level={caseItem.bloodPressure.status} size={22} />
                          <span className="text-[10px] text-zinc-400 font-medium mt-0.5">收縮/舒張</span>
                          <span className="text-xs font-bold text-zinc-800">
                            {caseItem.bloodPressure.systolic 
                              ? `${caseItem.bloodPressure.systolic}/${caseItem.bloodPressure.diastolic}` 
                              : '-/-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 活動量 (步數) */}
                    {visibleColumns.includes('活動量') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <StatusIndicator level={caseItem.activity.status} size={22} />
                          <span className="text-[10px] text-zinc-400 font-medium mt-0.5">步數</span>
                          <span className="text-xs font-bold text-zinc-800">
                            {caseItem.activity.steps ? `${caseItem.activity.steps.toLocaleString()}` : '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 體重 */}
                    {visibleColumns.includes('體重') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <StatusIndicator level={caseItem.bodyMetrics.status} size={22} />
                          <span className="text-[10px] text-zinc-400 font-medium mt-0.5">體重(kg)</span>
                          <span className="text-xs font-bold text-zinc-800">
                            {caseItem.bodyMetrics.weightKg || '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 空污 */}
                    {visibleColumns.includes('空污') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <StatusIndicator level={caseItem.airPollution.status} size={22} />
                          <span className="text-[10px] text-zinc-400 font-medium mt-0.5">AQI</span>
                          <span className="text-xs font-bold text-zinc-800">
                            {caseItem.airPollution.aqi || '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 就醫紀錄 */}
                    {visibleColumns.includes('就醫紀錄') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <StatusIndicator level={caseItem.medicalRecord.status} size={22} />
                          <span className="text-xs text-zinc-600 font-medium mt-1">
                            {caseItem.medicalRecord.count ? `${caseItem.medicalRecord.count} 次` : '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 筆記 */}
                    {visibleColumns.includes('筆記') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center max-w-[100px]">
                          <span className="text-xs text-zinc-700 truncate" title={caseItem.userNotes}>
                            {caseItem.userNotes || '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 回診 */}
                    {visibleColumns.includes('回診') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <StatusIndicator level={caseItem.followUp.status} size={22} />
                          <span className="text-[11px] text-zinc-800 font-bold mt-1">
                            {caseItem.followUp.date?.slice(5) || '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 氣象 */}
                    {visibleColumns.includes('氣象') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-xs text-zinc-700 font-medium">
                            {caseItem.weather.summary || '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 血糖 */}
                    {visibleColumns.includes('血糖') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <StatusIndicator level={caseItem.bloodSugar.status} size={22} />
                          <span className="text-xs font-bold text-zinc-800 mt-1">
                            {caseItem.bloodSugar.value ? `${caseItem.bloodSugar.value}` : '-'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 當週衛教 */}
                    {visibleColumns.includes('當週衛教') && (
                      <td className="py-2 px-2 text-center align-middle hover:bg-[#ffe5d0]/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            caseItem.education.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                          }`}>
                            {caseItem.education.completed ? '已完成' : '無/未讀'}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 頑固型血壓 */}
                    {visibleColumns.includes('頑固型血壓') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.chronicHypertension || '-'}
                      </td>
                    )}

                    {/* 偏頭痛 */}
                    {visibleColumns.includes('偏頭痛') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.migraine || '-'}
                      </td>
                    )}

                    {/* 巴金森氏症 */}
                    {visibleColumns.includes('巴金森氏症') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.parkinsons || '-'}
                      </td>
                    )}

                    {/* 中風 */}
                    {visibleColumns.includes('中風') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.stroke || '-'}
                      </td>
                    )}

                    {/* 問卷 */}
                    {visibleColumns.includes('問卷') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.surveyStatus || '-'}
                      </td>
                    )}

                    {/* 檢驗 */}
                    {visibleColumns.includes('檢驗') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.labTestStatus || '-'}
                      </td>
                    )}

                    {/* 用藥 */}
                    {visibleColumns.includes('用藥') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.medicationStatus || '-'}
                      </td>
                    )}

                    {/* 數位社會處方 */}
                    {visibleColumns.includes('數位社會處方') && (
                      <td className="py-2 px-2 text-center text-xs">
                        <button
                          onClick={() => onSelectCaseForPrescription(caseItem)}
                          className="px-2 py-1 text-xs rounded bg-orange-50 text-[#f08327] hover:bg-[#f08327] hover:text-white transition-colors font-bold cursor-pointer"
                        >
                          處方總覽 →
                        </button>
                      </td>
                    )}

                    {/* 風險預測 */}
                    {visibleColumns.includes('風險預測') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.riskPrediction || '-'}
                      </td>
                    )}

                    {/* 飲食 */}
                    {visibleColumns.includes('飲食') && (
                      <td className="py-2 px-2 text-center text-xs text-zinc-600">
                        {caseItem.dietStatus || '-'}
                      </td>
                    )}
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expert Advice Modal：建議關注者提供健康數據 + 優先授權 */}
      {showExpertAdviseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="關閉"
                onClick={() => setShowExpertAdviseModal(false)}
                className="w-8 h-8 text-xl text-zinc-500 hover:text-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 pt-0">
              <p className="text-[#f08327] font-bold text-center text-2xl sm:text-[28px]">建議關注者提供健康數據</p>
              <div className="grid grid-cols-2 gap-y-2 mt-4 mx-auto w-full sm:w-3/4">
                {ADVICE_OPTIONS.map((item) => (
                  <label key={item} className="flex items-center ml-6 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      aria-label={item}
                      checked={adviceDraft.includes(item)}
                      onChange={() => toggleAdviceItem(item)}
                    />
                    <AdviceCheckbox checked={adviceDraft.includes(item)} />
                    <span className="text-base text-black whitespace-nowrap ml-1">{item}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 border-t border-zinc-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-bold text-zinc-900">優先授權</span>
                  <button
                    id="btn-priority-auth"
                    type="button"
                    role="switch"
                    aria-checked={priorityDraft}
                    aria-label="優先授權"
                    onClick={() => {
                      setAdviceSaved(false);
                      setPriorityDraft((prev) => !prev);
                    }}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className={`relative inline-block w-10 h-[22px] rounded-full transition-colors ${priorityDraft ? 'bg-[#f08327]' : 'bg-zinc-300'}`}>
                      <span className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${priorityDraft ? 'translate-x-[18px]' : ''}`} />
                    </span>
                    <span className={`text-sm font-bold ${priorityDraft ? 'text-[#f08327]' : 'text-zinc-500'}`}>{priorityDraft ? '開啟' : '關閉'}</span>
                  </button>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  開啟後，民眾追蹤此專家並關閉打招呼視窗時，會自動跳出數據授權頁。
                </p>
              </div>

              <button
                id="advice-save"
                type="button"
                onClick={saveExpertAdvice}
                className="block bg-[#f08327] text-white rounded-full text-center w-[40%] py-2 mt-6 mx-auto font-bold cursor-pointer"
              >
                儲存
              </button>
              {adviceSaved && <p className="w-full text-center text-red-600 mt-1">儲存成功!!</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
