import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Timer, 
  Brain, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Share2, 
  UserCheck, 
  Check, 
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { BARTHEL_ITEMS, IADL_ITEMS, interpretBarthel, interpretTUG } from '../data/assessmentData';
import { CaseProfile } from '../types';

interface AssessmentToolsTabProps {
  currentCase: CaseProfile;
  onUpdateCaseScore: (caseId: string, scores: { barthel?: number; iadl?: number; tug?: number }) => void;
}

export const AssessmentToolsTab: React.FC<AssessmentToolsTabProps> = ({
  currentCase,
  onUpdateCaseScore
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'barthel' | 'iadl' | 'tug' | 'mmse'>('barthel');

  // Barthel Index State (default preloaded from current case if available)
  const [barthelScores, setBarthelScores] = useState<Record<string, number>>({
    feeding: 5,
    transfer: 10,
    grooming: 5,
    toilet: 5,
    bathing: 5,
    mobility: 10,
    stairs: 5,
    dressing: 5,
    bowel: 5,
    bladder: 5
  });

  // IADL State
  const [iadlGender, setIadlGender] = useState<'all' | 'female_only'>('all');
  const [iadlScores, setIadlScores] = useState<Record<string, number>>({
    phone: 1,
    shopping: 0,
    food_prep: 0,
    housekeeping: 0,
    laundry: 0,
    transport: 0,
    medication: 1,
    finances: 0
  });

  // TUG Stopwatch State
  const [tugTime, setTugTime] = useState<number>(currentCase.tugScore || 22.4);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [manualTugInput, setManualTugInput] = useState<string>((currentCase.tugScore || 22.4).toString());

  // Save notification toast
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Compute Barthel Total
  const barthelTotal = Object.values(barthelScores).reduce((a, b) => a + b, 0);
  const barthelResult = interpretBarthel(barthelTotal);

  // Compute IADL Total
  const applicableIadlItems = IADL_ITEMS.filter(item => {
    if (iadlGender === 'female_only') return true;
    return true;
  });
  const iadlTotal = Object.entries(iadlScores).reduce((acc, [key, val]) => acc + val, 0);

  // Compute TUG Result
  const tugResult = interpretTUG(tugTime);

  // TUG Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTugTime(prev => parseFloat((prev + 0.1).toFixed(1)));
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStartStopTug = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTug = () => {
    setIsTimerRunning(false);
    setTugTime(0);
    setManualTugInput('0');
  };

  const handleManualTugChange = (val: string) => {
    setManualTugInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setTugTime(parsed);
    }
  };

  const handleSaveBarthelToCase = () => {
    onUpdateCaseScore(currentCase.id, { barthel: barthelTotal });
    setSaveSuccess('巴氏量表分數已同步更新至個案檔案！');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveIadlToCase = () => {
    onUpdateCaseScore(currentCase.id, { iadl: iadlTotal });
    setSaveSuccess('IADL 分數已同步更新至個案檔案！');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveTugToCase = () => {
    onUpdateCaseScore(currentCase.id, { tug: tugTime });
    setSaveSuccess('TUG 計時測量數據已同步更新至個案檔案！');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">

      {/* Top Notification Toast */}
      {saveSuccess && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess(null)} className="text-teal-600 hover:text-teal-900 font-bold">✕</button>
        </div>
      )}

      {/* Active Case Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{currentCase.name}</span>
              <span className="text-xs text-slate-500 font-normal">({currentCase.gender === 'male' ? '男' : '女'} / {currentCase.age}歲)</span>
              <span className="bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-200">
                長照 CMS {currentCase.cmsLevel} 級
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{currentCase.diagnosis}</p>
          </div>
        </div>

        {/* Current scores summary */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">
            <span className="text-slate-400 block text-[10px]">巴氏量表</span>
            <span className="font-bold text-slate-800">{currentCase.barthelScore ?? '--'} / 100</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">
            <span className="text-slate-400 block text-[10px]">IADL</span>
            <span className="font-bold text-slate-800">{currentCase.iadlScore ?? '--'} / 8</span>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-center">
            <span className="text-slate-400 block text-[10px]">TUG 計時</span>
            <span className="font-bold text-slate-800">{currentCase.tugScore ? `${currentCase.tugScore}秒` : '--'}</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('barthel')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'barthel'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>巴氏量表 (Barthel ADL)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('iadl')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'iadl'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>工具性生活自理 (Lawton IADL)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tug')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'tug'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>計時起走測試 (TUG 碼表)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mmse')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'mmse'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>MMSE 心智認知速查</span>
        </button>
      </div>

      {/* --- SUBTAB 1: BARTHEL INDEX --- */}
      {activeSubTab === 'barthel' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Question List (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">請依個案最近一週「實際生活表現」勾選（非僅評估其潛能）：</span>
              <button
                onClick={() => setBarthelScores({
                  feeding: 10, transfer: 15, grooming: 5, toilet: 10,
                  bathing: 5, mobility: 15, stairs: 10, dressing: 10,
                  bowel: 10, bladder: 10
                })}
                className="text-orange-600 hover:text-orange-800 font-semibold"
              >
                全部重設為滿分
              </button>
            </div>

            {BARTHEL_ITEMS.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    目前: {barthelScores[item.id] ?? 0} 分
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {item.options.map((opt) => {
                    const isSelected = barthelScores[item.id] === opt.score;
                    return (
                      <button
                        key={opt.score}
                        onClick={() => setBarthelScores(prev => ({ ...prev, [item.id]: opt.score }))}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-orange-50/80 border-orange-500 text-orange-950 ring-1 ring-orange-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{opt.text}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isSelected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {opt.score} 分
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {opt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Summary Card (Right 1 col) */}
          <div className="space-y-4">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">即時算分結果</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${barthelResult.badgeColor}`}>
                  {barthelResult.disabilityGrade}
                </span>
              </div>

              {/* Big Score Number */}
              <div className="text-center py-2">
                <div className="text-5xl font-black text-slate-900 tracking-tight">
                  {barthelTotal}
                  <span className="text-lg font-normal text-slate-400 ml-1">/ 100</span>
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  分級：{barthelResult.level}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    barthelTotal <= 20 ? 'bg-red-500' :
                    barthelTotal <= 60 ? 'bg-amber-500' :
                    barthelTotal <= 90 ? 'bg-blue-500' : 'bg-teal-500'
                  }`}
                  style={{ width: `${barthelTotal}%` }}
                />
              </div>

              {/* LTC & Clinical Reablement Implication */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-orange-600" />
                    長照政策給付與審查建議：
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {barthelResult.ltcImplication}
                  </p>
                </div>

                <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200">
                  <div className="font-bold text-orange-900 mb-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                    職能治療復能介入重點：
                  </div>
                  <p className="text-orange-950 leading-relaxed">
                    {barthelResult.reablementFocus}
                  </p>
                </div>
              </div>

              {/* Apply to Case Action Button */}
              <button
                onClick={handleSaveBarthelToCase}
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>存入目前個案 ({currentCase.name})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: IADL --- */}
      {activeSubTab === 'iadl' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">評估工具性日常生活活動（IADL，購物、用藥、交通、備餐等能力）：</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">適用指標:</span>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  全 8 項指標
                </span>
              </div>
            </div>

            {applicableIadlItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    iadlScores[item.id] === 1 ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {iadlScores[item.id] === 1 ? '獨立 (1分)' : '依賴/需人協助 (0分)'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {item.options.map((opt, idx) => {
                    const isSelected = iadlScores[item.id] === opt.score;
                    return (
                      <button
                        key={idx}
                        onClick={() => setIadlScores(prev => ({ ...prev, [item.id]: opt.score }))}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold ring-1 ring-teal-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt.text}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${opt.score === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {opt.score} 分
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* IADL Summary Card */}
          <div>
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">IADL 評定結果</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  {iadlTotal >= 6 ? '生活自理佳' : iadlTotal >= 4 ? '輕中度依賴' : '重度工具性依賴'}
                </span>
              </div>

              <div className="text-center py-2">
                <div className="text-5xl font-black text-slate-900 tracking-tight">
                  {iadlTotal}
                  <span className="text-lg font-normal text-slate-400 ml-1">/ 8</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  （女性標準滿分 8 分，男性標準滿分 5~8 分）
                </div>
              </div>

              {/* Items requiring support */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">目前需他人協助項目：</span>
                <ul className="space-y-1 text-slate-600">
                  {applicableIadlItems.filter(item => iadlScores[item.id] === 0).map(item => (
                    <li key={item.id} className="flex items-center gap-1.5 text-amber-800 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item.name}</span>
                    </li>
                  ))}
                  {applicableIadlItems.filter(item => iadlScores[item.id] === 0).length === 0 && (
                    <li className="text-teal-700 font-semibold">所有 IADL 項目皆可獨立完成！</li>
                  )}
                </ul>
              </div>

              <button
                onClick={handleSaveIadlToCase}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>存入個案檔案 ({currentCase.name})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: TUG (TIMED UP AND GO) WITH DIGITAL STOPWATCH --- */}
      {activeSubTab === 'tug' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Interactive Stopwatch */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                標準化 3 公尺計時起走 (TUG)
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                數位臨床測試碼表
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                從扶手椅站起 → 正常步伐向前走 3 公尺 → 繞過標誌物轉身走回 → 坐回原椅。
              </p>
            </div>

            {/* Huge Timer Display */}
            <div className="w-64 h-64 rounded-full border-8 border-blue-500/20 bg-blue-50/50 flex flex-col items-center justify-center shadow-inner relative">
              <span className="text-6xl font-black text-slate-900 font-mono tracking-tight">
                {tugTime.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                SECONDS 秒
              </span>

              {isTimerRunning && (
                <div className="absolute top-4 flex items-center gap-1 text-[11px] font-semibold text-blue-600 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  計時中...
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartStopTug}
                className={`px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{isTimerRunning ? '暫停計時' : '開始計時'}</span>
              </button>

              <button
                onClick={handleResetTug}
                className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>歸零</span>
              </button>
            </div>

            {/* Manual Edit Fallback */}
            <div className="pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-3 text-xs text-slate-600">
              <span>或直接手動輸入秒數:</span>
              <input
                type="number"
                step="0.1"
                min="0"
                value={manualTugInput}
                onChange={(e) => handleManualTugChange(e.target.value)}
                className="w-20 px-2 py-1 border border-slate-300 rounded font-bold text-center focus:outline-blue-500"
              />
              <span>秒</span>
            </div>
          </div>

          {/* TUG Clinical Interpretation */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">跌倒風險評級</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tugResult.badgeColor}`}>
                  {tugResult.riskLevel}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">行動能力診斷：</span>
                <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {tugResult.mobilityStatus}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">防跌處方與長照建議：</span>
                <p className="text-xs sm:text-sm text-slate-800 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-amber-950 leading-relaxed">
                  {tugResult.recommendation}
                </p>
              </div>

              {/* Reference Norms */}
              <div className="pt-2 text-xs space-y-2 border-t border-slate-100">
                <span className="font-bold text-slate-700 block">臨床常模對照 (Podsiadlo & Richardson, 1991)：</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-100 text-emerald-900">
                    &lt; 10 秒：正常行動獨立
                  </div>
                  <div className="p-2 rounded bg-blue-50 border border-blue-100 text-blue-900">
                    10 - 20 秒：輕微受限
                  </div>
                  <div className="p-2 rounded bg-amber-50 border border-amber-100 text-amber-900">
                    20 - 30 秒：中度跌倒高危
                  </div>
                  <div className="p-2 rounded bg-red-50 border border-red-100 text-red-900">
                    &gt; 30 秒：極高危險/需人扶持
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveTugToCase}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>將 TUG ({tugTime}秒) 存入個案檔案</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: MMSE OVERVIEW --- */}
      {activeSubTab === 'mmse' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-600" />
              簡易心智量表 (MMSE) 認知功能評分架構與失智分期對照
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              總分 30 分，評估定向感、記憶登記、注意力與計算、回憶及語言/結構能力。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">24 ~ 30 分</span>
              <h3 className="text-sm font-bold text-emerald-700">認知功能正常 / 輕微</h3>
              <p className="text-xs text-slate-600">日常起居正常，可獨立管理藥物及財務，維持社交與嗜好活動。</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">18 ~ 23 分</span>
              <h3 className="text-sm font-bold text-amber-700">輕度認知障礙 / 輕度失智</h3>
              <p className="text-xs text-slate-600">近期記憶減退，出門可能迷路，需視覺提示卡與環境結構化安排。</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">10 ~ 17 分</span>
              <h3 className="text-sm font-bold text-orange-700">中度失智 (Moderate)</h3>
              <p className="text-xs text-slate-600">日夜作息紊亂，穿衣、沐浴需他人提示協助，好發 BPSD 黃昏症候群。</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500">0 ~ 9 分</span>
              <h3 className="text-sm font-bold text-red-700">重度失智 (Severe)</h3>
              <p className="text-xs text-slate-600">語言溝通極度受限，大小便失禁，生活全面依賴照護者全時看顧。</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
