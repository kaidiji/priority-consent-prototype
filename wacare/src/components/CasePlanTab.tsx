import React, { useState } from 'react';
import { 
  Layers, 
  Target, 
  FileText, 
  Sparkles, 
  Plus, 
  Check, 
  Copy, 
  Calendar, 
  UserCheck, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  Edit3, 
  Award, 
  Loader2,
  Trash2,
  Save,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { CaseProfile, CaseGoal, SoapRecord, GasLevel } from '../types';

interface CasePlanTabProps {
  cases: CaseProfile[];
  currentCase: CaseProfile;
  onSelectCase: (caseId: string) => void;
  onUpdateCase: (updatedCase: CaseProfile) => void;
  onCreateNewCase: (newCase: CaseProfile) => void;
}

export const CasePlanTab: React.FC<CasePlanTabProps> = ({
  cases,
  currentCase,
  onSelectCase,
  onUpdateCase,
  onCreateNewCase
}) => {
  const [activeSection, setActiveSection] = useState<'gas' | 'soap'>('gas');

  // AI SMART Goal Modal State
  const [isAiGoalModalOpen, setIsAiGoalModalOpen] = useState<boolean>(false);
  const [aiGoalTargetArea, setAiGoalTargetArea] = useState<string>('上肢穿脫衣物自理與扣鈕扣');
  const [aiGoalDesiredOutcome, setAiGoalDesiredOutcome] = useState<string>('希望個案能在 6 週內自己穿好前開襟外套');
  const [aiGoalLoading, setAiGoalLoading] = useState<boolean>(false);
  const [aiGoalResult, setAiGoalResult] = useState<{
    smartGoals: { shortTerm: string; mediumTerm: string; longTerm: string };
    gasLevels: { score: number; description: string }[];
    interventionPlan: string[];
  } | null>(null);

  // New SOAP Form State
  const [newSubjective, setNewSubjective] = useState<string>('');
  const [newObjective, setNewObjective] = useState<string>('');
  const [newAssessment, setNewAssessment] = useState<string>('');
  const [newPlan, setNewPlan] = useState<string>('');
  const [therapistName, setTherapistName] = useState<string>('陳品秀 職能治療師 (OTR/L)');
  const [soapAiLoading, setSoapAiLoading] = useState<boolean>(false);
  const [copiedSoapId, setCopiedSoapId] = useState<string | null>(null);

  // New Case Modal State
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState<boolean>(false);
  const [newCaseName, setNewCaseName] = useState<string>('');
  const [newCaseAge, setNewCaseAge] = useState<number>(75);
  const [newCaseDiagnosis, setNewCaseDiagnosis] = useState<string>('');
  const [newCaseCms, setNewCaseCms] = useState<number>(4);

  // Update GAS score for a goal
  const handleUpdateGasScore = (goalId: string, newScore: -2 | -1 | 0 | 1 | 2) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedGoals = currentCase.goals.map(g => {
      if (g.id !== goalId) return g;
      const history = [...g.gasHistory, { date: today, score: newScore }];
      return {
        ...g,
        currentGas: newScore,
        gasHistory: history
      };
    });

    onUpdateCase({
      ...currentCase,
      goals: updatedGoals
    });
  };

  // AI SMART Goal generation
  const handleRunAiSmartGoals = async () => {
    setAiGoalLoading(true);
    try {
      const res = await fetch('/api/ai/smart-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseName: currentCase.name,
          age: `${currentCase.age}歲`,
          diagnosis: currentCase.diagnosis,
          currentLevel: `巴氏量表：${currentCase.barthelScore || 50}分，現況：${currentCase.notes}`,
          desiredOutcome: aiGoalDesiredOutcome
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiGoalResult({
          smartGoals: data.smartGoals || { shortTerm: '', mediumTerm: '', longTerm: '' },
          gasLevels: data.gasLevels || [],
          interventionPlan: data.interventionPlan || []
        });
      }
    } catch (err) {
      console.error('Error generating AI goals:', err);
    } finally {
      setAiGoalLoading(false);
    }
  };

  // Apply AI Generated Goal to Case
  const handleApplyAiGoalToCase = () => {
    if (!aiGoalResult) return;
    const newGoal: CaseGoal = {
      id: `goal-${Date.now()}`,
      targetArea: aiGoalTargetArea,
      smartGoal: aiGoalResult.smartGoals.shortTerm || aiGoalResult.smartGoals.longTerm,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currentGas: -2,
      gasHistory: [{ date: new Date().toISOString().split('T')[0], score: -2 }],
      gasLevels: aiGoalResult.gasLevels.map(l => ({
        score: l.score as -2 | -1 | 0 | 1 | 2,
        label: l.score === -2 ? '目前基線' : l.score === -1 ? '少於預期' : l.score === 0 ? '預期目標 (Target)' : l.score === 1 ? '優於預期' : '大幅超越',
        description: l.description
      }))
    };

    onUpdateCase({
      ...currentCase,
      goals: [...currentCase.goals, newGoal]
    });
    setIsAiGoalModalOpen(false);
  };

  // AI SOAP Note Polisher
  const handleAiPolishSoap = async () => {
    setSoapAiLoading(true);
    try {
      const res = await fetch('/api/ai/soap-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionData: `針對 ${currentCase.name} 進行功能性訓練。現有目標：${currentCase.goals.map(g => g.targetArea).join('、')}`,
          therapistNotes: `主觀反饋：${newSubjective || '個案自覺動作進步'}。客觀動作：${newObjective || '完成移位與進食訓練'}。`,
          assessmentScores: `Barthel: ${currentCase.barthelScore || '--'}, TUG: ${currentCase.tugScore || '--'}秒`
        })
      });
      const data = await res.json();
      if (data.success && data.soap) {
        setNewSubjective(data.soap.s || newSubjective);
        setNewObjective(data.soap.o || newObjective);
        setNewAssessment(data.soap.a || newAssessment);
        setNewPlan(data.soap.p || newPlan);
      }
    } catch (err) {
      console.error('Error polishing SOAP note:', err);
    } finally {
      setSoapAiLoading(false);
    }
  };

  // Save new SOAP record
  const handleSaveNewSoap = () => {
    if (!newObjective.trim() && !newAssessment.trim()) return;

    const newRecord: SoapRecord = {
      id: `soap-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sessionNumber: (currentCase.soapRecords.length || 0) + 1,
      therapist: therapistName,
      subjective: newSubjective || '個案配合度高，積極詢問居家自主練習動作。',
      objective: newObjective || '於床緣坐姿下完成動作控制訓練，生命徵象穩定。',
      assessment: newAssessment || '功能控制微幅提升，目標達成進度符合預期。',
      plan: newPlan || '持續按計畫執行長照居家復能，衛教家屬防跌。'
    };

    onUpdateCase({
      ...currentCase,
      soapRecords: [newRecord, ...currentCase.soapRecords]
    });

    setNewSubjective('');
    setNewObjective('');
    setNewAssessment('');
    setNewPlan('');
  };

  const handleCopySoap = (record: SoapRecord) => {
    const text = `【職能治療臨床訪視紀錄 (SOAP)】\n個案: ${currentCase.name} (${currentCase.age}歲 / CMS ${currentCase.cmsLevel}級)\n日期: ${record.date} (第 ${record.sessionNumber} 次訪視)\n治療師: ${record.therapist}\n\n[S 主觀陳述]:\n${record.subjective}\n\n[O 客觀檢查與介入]:\n${record.objective}\n\n[A 臨床評估與推理]:\n${record.assessment}\n\n[P 後續治療計畫]:\n${record.plan}`;
    navigator.clipboard.writeText(text);
    setCopiedSoapId(record.id);
    setTimeout(() => setCopiedSoapId(null), 2000);
  };

  const handleCreateCase = () => {
    if (!newCaseName.trim()) return;
    const newCase: CaseProfile = {
      id: `case-${Date.now()}`,
      name: newCaseName,
      gender: 'female',
      age: newCaseAge,
      cmsLevel: newCaseCms,
      diagnosis: newCaseDiagnosis || '長照2.0居家復能受案長者',
      onsetDuration: '發病約 2 個月',
      primaryCaregiver: '同住家人',
      domain: 'physical',
      barthelScore: 60,
      iadlScore: 3,
      tugScore: 21.0,
      reablementStatus: 'active',
      goals: [],
      soapRecords: [],
      notes: '長照專業服務初評建檔。'
    };
    onCreateNewCase(newCase);
    setIsNewCaseModalOpen(false);
    setNewCaseName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Case Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 text-xl font-black">
            {currentCase.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{currentCase.name}</h2>
              <span className="text-xs text-slate-500">
                {currentCase.gender === 'male' ? '男性' : '女性'} · {currentCase.age} 歲
              </span>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded border border-orange-200">
                長照 CMS {currentCase.cmsLevel} 級
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              診斷：{currentCase.diagnosis} ({currentCase.onsetDuration})
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              主要照顧者：{currentCase.primaryCaregiver}
            </p>
          </div>
        </div>

        {/* Switch Case or Add Case */}
        <div className="flex items-center gap-2">
          <select
            value={currentCase.id}
            onChange={(e) => onSelectCase(e.target.value)}
            aria-label="切換個案檔案"
            className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-orange-500 cursor-pointer"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.diagnosis.slice(0, 12)}...)
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增個案</span>
          </button>
        </div>
      </div>

      {/* Tabs: GAS Goals vs SOAP Notes */}
      <div className="flex border-b border-slate-200 gap-4 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveSection('gas')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeSection === 'gas'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>SMART 復能目標與 GAS 達成量表 ({currentCase.goals.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('soap')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeSection === 'soap'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>SOAP 臨床訪視紀錄 ({currentCase.soapRecords.length})</span>
        </button>
      </div>

      {/* --- SECTION 1: GAS & SMART GOALS --- */}
      {activeSection === 'gas' && (
        <div className="space-y-6">
          
          {/* Action Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              個別化復能目標達成量表 (Goal Attainment Scaling)
            </span>
            <button
              onClick={() => {
                setAiGoalTargetArea('日常生活功能獨立自理');
                setAiGoalDesiredOutcome('提升患肢操作與動態平衡');
                setIsAiGoalModalOpen(true);
                setAiGoalResult(null);
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 輔助擬定 SMART / GAS 目標</span>
            </button>
          </div>

          {/* Goal Cards */}
          <div className="space-y-5">
            {currentCase.goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                
                {/* Goal Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      目標領域：{goal.targetArea}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">
                      {goal.smartGoal}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      預計達成：{goal.targetDate}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">目前進展</span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                        goal.currentGas >= 0 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        GAS: {goal.currentGas > 0 ? `+${goal.currentGas}` : goal.currentGas} 分
                      </span>
                    </div>
                  </div>
                </div>

                {/* GAS 5-Level Scale Selector */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    GAS 目標達成指標階梯（點擊切換當前進度評定）：
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {goal.gasLevels.map((lvl) => {
                      const isCurrent = goal.currentGas === lvl.score;
                      return (
                        <button
                          key={lvl.score}
                          onClick={() => handleUpdateGasScore(goal.id, lvl.score)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isCurrent
                              ? lvl.score >= 0 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500 shadow-xs'
                                : 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500 shadow-xs'
                              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-black ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                                {lvl.score > 0 ? `+${lvl.score}` : lvl.score}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500">{lvl.label}</span>
                            </div>
                            <p className="text-[11px] leading-tight text-slate-600">
                              {lvl.description}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-emerald-700 mt-2 flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> 當前進展點
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress History */}
                {goal.gasHistory && goal.gasHistory.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>歷次評定軌跡：</span>
                    {goal.gasHistory.map((h, idx) => (
                      <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                        {h.date}: <strong className={h.score >= 0 ? 'text-emerald-700' : 'text-amber-700'}>{h.score > 0 ? `+${h.score}` : h.score}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {currentCase.goals.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <Target className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-700 font-bold text-sm">此個案尚未擬定 GAS 復能目標</p>
                <p className="text-slate-400 text-xs mt-1">點擊上方「AI 輔助擬定 SMART / GAS 目標」按鈕，快速建立標準目標。</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SECTION 2: SOAP NOTES --- */}
      {activeSection === 'soap' && (
        <div className="space-y-6">
          
          {/* New SOAP Record Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-orange-600" />
                  填寫本次長照2.0 / 臨床訪視紀錄 (SOAP)
                </h3>
                <span className="text-xs text-slate-400">符合臺灣衛生福利部長照專業服務評鑑紀錄格式</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiPolishSoap}
                  disabled={soapAiLoading}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {soapAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>AI 臨床專業潤飾</span>
                </button>

                <button
                  onClick={handleSaveNewSoap}
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>儲存本次訪視病歷</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  S - 主觀陳述 (Subjective，個案自述/照顧者反應)：
                </label>
                <textarea
                  rows={3}
                  value={newSubjective}
                  onChange={(e) => setNewSubjective(e.target.value)}
                  placeholder="如：長輩表示右手比較肯用力，長女反應起床移位已不用兩人抱..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  O - 客觀檢查與介入操作 (Objective，量化活動度/肌力/步態/測試)：
                </label>
                <textarea
                  rows={3}
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="如：生命徵象穩定。進行移位五步驟演練 4 回，巴氏量表 55 分，TUG 22 秒..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  A - 臨床評估與推理 (Assessment，進展歸因/限制因子/潛能分析)：
                </label>
                <textarea
                  rows={3}
                  value={newAssessment}
                  onChange={(e) => setNewAssessment(e.target.value)}
                  placeholder="如：軀幹與下肢負重耐力提升，移位信心大增。患手遠端痙攣稍降，具備進食自理潛能..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  P - 治療計畫與照護者衛教 (Plan，後續排程/輔具建議/作業)：
                </label>
                <textarea
                  rows={3}
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  placeholder="如：1. 指導看護晨間轉位自立。2. 引入加粗握柄湯匙。3. 下次排定 9/27 訪視..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Past SOAP Records Timeline */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              過往臨床訪視紀錄歷程
            </span>

            {currentCase.soapRecords.map((rec) => (
              <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                      {rec.sessionNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      第 {rec.sessionNumber} 次復能訪視紀錄
                    </span>
                    <span className="text-xs text-slate-400">({rec.date})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">記錄者：{rec.therapist}</span>
                    <button
                      onClick={() => handleCopySoap(rec)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1"
                      title="複製此紀錄"
                    >
                      {copiedSoapId === rec.id ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-orange-700 block mb-1">S (Subjective 主觀陳述)：</strong>
                    <p className="text-slate-700 leading-relaxed">{rec.subjective}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-blue-700 block mb-1">O (Objective 客觀觀察)：</strong>
                    <p className="text-slate-700 leading-relaxed">{rec.objective}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-teal-700 block mb-1">A (Assessment 專業推理)：</strong>
                    <p className="text-slate-700 leading-relaxed">{rec.assessment}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong className="text-purple-700 block mb-1">P (Plan 後續計畫)：</strong>
                    <p className="text-slate-700 leading-relaxed">{rec.plan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- AI SMART GOAL MODAL --- */}
      {isAiGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-base">WaCare AI 復能目標 (SMART & GAS) 輔助擬定</h3>
              </div>
              <button onClick={() => setIsAiGoalModalOpen(false)} className="text-white/80 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">復能目標領域：</label>
                <input
                  type="text"
                  value={aiGoalTargetArea}
                  onChange={(e) => setAiGoalTargetArea(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">個案或家屬最深切的願望 / 期望成果：</label>
                <input
                  type="text"
                  value={aiGoalDesiredOutcome}
                  onChange={(e) => setAiGoalDesiredOutcome(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-orange-500"
                />
              </div>

              <button
                onClick={handleRunAiSmartGoals}
                disabled={aiGoalLoading}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {aiGoalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini 臨床推論生成 SMART 與 GAS 指標中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>一鍵生成 SMART 目標與 5 級 GAS 量表</span>
                  </>
                )}
              </button>

              {aiGoalResult && (
                <div className="space-y-4 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 space-y-2">
                    <span className="font-bold text-orange-900 block text-xs">🎯 SMART 短中長期目標建議：</span>
                    <div className="text-xs space-y-1.5 text-orange-950">
                      <div><strong>短期 (4週)：</strong>{aiGoalResult.smartGoals.shortTerm}</div>
                      <div><strong>中期 (8週)：</strong>{aiGoalResult.smartGoals.mediumTerm}</div>
                      <div><strong>長期 (12週)：</strong>{aiGoalResult.smartGoals.longTerm}</div>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block text-xs mb-2">📊 GAS 目標達成量表 (-2 到 +2)：</span>
                    <div className="space-y-1.5 text-xs">
                      {aiGoalResult.gasLevels.map((lvl) => (
                        <div key={lvl.score} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
                          <span className="font-bold text-slate-800 shrink-0 w-8">{lvl.score > 0 ? `+${lvl.score}` : lvl.score}:</span>
                          <span className="text-slate-700">{lvl.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleApplyAiGoalToCase}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>將此目標與 GAS 量表導入個案檔案 ({currentCase.name})</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsAiGoalModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW CASE MODAL --- */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">建立新復能個案檔案</h3>
              <button onClick={() => setIsNewCaseModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">個案姓名：</label>
                <input
                  type="text"
                  placeholder="如：王金水阿公"
                  value={newCaseName}
                  onChange={(e) => setNewCaseName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">年齡：</label>
                  <input
                    type="number"
                    value={newCaseAge}
                    onChange={(e) => setNewCaseAge(parseInt(e.target.value) || 75)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-orange-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">長照 CMS 等級：</label>
                  <select
                    value={newCaseCms}
                    onChange={(e) => setNewCaseCms(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-orange-500 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => (
                      <option key={lvl} value={lvl}>CMS {lvl} 級</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">主要臨床診斷：</label>
                <input
                  type="text"
                  placeholder="如：右側髖關節骨折術後、巴金森氏症..."
                  value={newCaseDiagnosis}
                  onChange={(e) => setNewCaseDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleCreateCase}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold"
              >
                建立檔案
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
