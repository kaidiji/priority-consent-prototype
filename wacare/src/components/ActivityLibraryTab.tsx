import React, { useState, useMemo } from 'react';
import { 
  Dumbbell, 
  Search, 
  Sparkles, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wrench, 
  ShieldAlert, 
  Clock, 
  Users, 
  Plus, 
  Check, 
  Loader2, 
  Bookmark, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ACTIVITIES_DATABASE } from '../data/activitiesData';
import { ActivityCard, CaseProfile, ClinicalDomain } from '../types';

interface ActivityLibraryTabProps {
  currentCase: CaseProfile;
  searchQuery: string;
}

export const ActivityLibraryTab: React.FC<ActivityLibraryTabProps> = ({
  currentCase,
  searchQuery
}) => {
  const [activities, setActivities] = useState<ActivityCard[]>(ACTIVITIES_DATABASE);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(activities[0]?.id || null);
  
  // AI Activity Grader Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiTargetActivity, setAiTargetActivity] = useState<string>('桌上型手部抓握與疊杯訓練');
  const [aiClientCondition, setAiClientCondition] = useState<string>(
    `${currentCase.name}，${currentCase.age}歲，診斷：${currentCase.diagnosis}。現況：${currentCase.notes}`
  );
  const [aiTargetGoal, setAiTargetGoal] = useState<string>('提升患側手部伸展抓取穩定度，能獨立拿取水杯喝水');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiGradingResult, setAiGradingResult] = useState<{
    gradingDown: string[];
    gradingUp: string[];
    adaptations: string[];
    precautions: string[];
  } | null>(null);

  // New Custom Activity Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDomain, setNewDomain] = useState<ClinicalDomain>('physical');
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newMaterials, setNewMaterials] = useState<string>('');
  const [newGradingDown, setNewGradingDown] = useState<string>('');
  const [newGradingUp, setNewGradingUp] = useState<string>('');

  const domains = [
    { id: 'all', label: '全部領域教案' },
    { id: 'physical', label: '生理神經復健' },
    { id: 'pediatric', label: '小兒與感覺統合' },
    { id: 'psychosocial', label: '精神與生活重建' },
    { id: 'community', label: '長照與社區自理' }
  ];

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchDomain = selectedDomain === 'all' || act.domain === selectedDomain;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchDomain;

      const matchText = 
        act.title.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q) ||
        act.focusSkills.some(s => s.toLowerCase().includes(q)) ||
        act.targetPopulation.toLowerCase().includes(q);

      return matchDomain && matchText;
    });
  }, [activities, selectedDomain, searchQuery]);

  const handleOpenAiGraderForActivity = (act: ActivityCard) => {
    setAiTargetActivity(act.title);
    setAiClientCondition(`${currentCase.name}（${currentCase.age}歲），診斷：${currentCase.diagnosis}`);
    setAiTargetGoal(`增進日常生活功能自理，改善受限技能（${act.focusSkills.join('、')}）`);
    setIsAiModalOpen(true);
    setAiGradingResult(null);
  };

  const handleRunAiGrader = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/grade-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityTitle: aiTargetActivity,
          clientCondition: aiClientCondition,
          targetGoal: aiTargetGoal,
          currentDifficulty: '中等'
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiGradingResult({
          gradingDown: data.gradingDown || [],
          gradingUp: data.gradingUp || [],
          adaptations: data.adaptations || [],
          precautions: data.precautions || []
        });
      }
    } catch (err) {
      console.error('Error running AI grader:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAiResultAsCustomActivity = () => {
    if (!aiGradingResult) return;
    const newCard: ActivityCard = {
      id: `custom-ai-${Date.now()}`,
      title: `[個案專屬] ${aiTargetActivity} (${currentCase.name})`,
      domain: currentCase.domain,
      focusSkills: ['功能性自理', '個人化分級', '動作控制'],
      targetPopulation: `${currentCase.name} - ${currentCase.diagnosis}`,
      durationMinutes: 30,
      materials: ['專屬輔具', '環境調適器材'],
      setting: '居家或機構訓練環境',
      description: `針對 ${currentCase.name} 臨床狀況設計之個人化活動分級方案。目標：${aiTargetGoal}`,
      gradingDown: aiGradingResult.gradingDown,
      gradingUp: aiGradingResult.gradingUp,
      adaptations: aiGradingResult.adaptations,
      safetyPrecautions: aiGradingResult.precautions,
      isCustom: true
    };
    setActivities(prev => [newCard, ...prev]);
    setIsAiModalOpen(false);
    setExpandedCardId(newCard.id);
  };

  const handleCreateCustomActivity = () => {
    if (!newTitle.trim()) return;
    const newCard: ActivityCard = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      domain: newDomain,
      focusSkills: ['自訂復能訓練'],
      targetPopulation: '長照與醫療復健個案',
      durationMinutes: newDuration,
      materials: newMaterials ? newMaterials.split(/[,，\n]/).map(s => s.trim()).filter(Boolean) : ['常備訓練器材'],
      setting: '治療室或居家客廳',
      description: newDescription || '職能治療師自訂設計之臨床活動教案。',
      gradingDown: newGradingDown ? newGradingDown.split('\n').filter(Boolean) : ['簡化操作步驟'],
      gradingUp: newGradingUp ? newGradingUp.split('\n').filter(Boolean) : ['增加操作複雜度'],
      adaptations: ['調整桌椅高度與環境防滑'],
      safetyPrecautions: ['監控疲勞與生命徵象'],
      isCustom: true
    };
    setActivities(prev => [newCard, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setExpandedCardId(newCard.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            活動分析學 (Activity Analysis) · 難度分級 (Grading Up / Down)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            臨床復能活動設計庫與難度分級引擎
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-blue-100 leading-relaxed">
            職能治療的精髓在於「恰好挑戰 (Just-Right Challenge)」。透過調整材料質地、空間位置、動作阻力與步驟分解，讓個案在能力臨界點獲得最大功能進步。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAiTargetActivity('前開襟單手穿衣扣鈕扣活動');
              setAiClientCondition(`${currentCase.name}（${currentCase.age}歲），診斷：${currentCase.diagnosis}`);
              setAiTargetGoal('在 4 週內提升患側上肢主動輔助能力，達成上半身自立穿衣');
              setIsAiModalOpen(true);
              setAiGradingResult(null);
            }}
            className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>AI 智能活動分級器</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-700/80 hover:bg-blue-800 text-white rounded-xl text-xs font-bold border border-blue-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增教案</span>
          </button>
        </div>
      </div>

      {/* Domain Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm">
        {domains.map(dom => (
          <button
            key={dom.id}
            onClick={() => setSelectedDomain(dom.id)}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              selectedDomain === dom.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {dom.label}
          </button>
        ))}
      </div>

      {/* Activity Cards List */}
      <div className="space-y-4">
        {filteredActivities.map(act => {
          const isExpanded = expandedCardId === act.id;
          return (
            <div
              key={act.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Card Header Row */}
              <div 
                onClick={() => setExpandedCardId(isExpanded ? null : act.id)}
                className="p-5 flex flex-wrap items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      act.domain === 'physical' ? 'bg-orange-100 text-orange-800' :
                      act.domain === 'pediatric' ? 'bg-pink-100 text-pink-800' :
                      act.domain === 'psychosocial' ? 'bg-purple-100 text-purple-800' :
                      'bg-teal-100 text-teal-800'
                    }`}>
                      {act.domain === 'physical' ? '生理神經復健' :
                       act.domain === 'pediatric' ? '小兒與感覺統合' :
                       act.domain === 'psychosocial' ? '精神心理職能' : '長照居家自理'}
                    </span>
                    {act.isCustom && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        治療師自訂/AI 生成
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      約 {act.durationMinutes} 分鐘
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {act.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {act.description}
                  </p>

                  {/* Focus skills */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {act.focusSkills.map((sk, idx) => (
                      <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAiGraderForActivity(act);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>AI 為目前個案分級</span>
                  </button>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Activity Analysis & Grading Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in duration-200">
                  
                  {/* Meta Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-500 block">適用族群：</span>
                      <span className="text-slate-800 font-medium">{act.targetPopulation}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 block">所需器材與材料：</span>
                      <span className="text-slate-800 font-medium">{act.materials.join('、')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500 block">環境與姿勢設定：</span>
                      <span className="text-slate-800 font-medium">{act.setting}</span>
                    </div>
                  </div>

                  {/* Grading Up & Down 2 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Grading Down (降低難度方案) */}
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        <ArrowDownCircle className="w-4 h-4 text-emerald-600" />
                        Grading Down 降低難度方案 (當個案感到挫折/張力過高時)
                      </div>
                      <ul className="space-y-1.5 text-xs text-emerald-950">
                        {act.gradingDown.map((gd, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-emerald-600 shrink-0">•</span>
                            <span>{gd}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Grading Up (提高難度方案) */}
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                        <ArrowUpCircle className="w-4 h-4 text-amber-600" />
                        Grading Up 提升難度方案 (當個案輕鬆完成/尋求突破時)
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-950">
                        {act.gradingUp.map((gu, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-amber-600 shrink-0">•</span>
                            <span>{gu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Adaptations & Precautions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Adaptations */}
                    <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider">
                        <Wrench className="w-4 h-4 text-blue-600" />
                        環境調適與代償策略 (Adaptations & Assistive Devices)
                      </div>
                      <ul className="space-y-1.5 text-xs text-blue-950">
                        {act.adaptations.map((ad, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-blue-600 shrink-0">•</span>
                            <span>{ad}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Safety Precautions */}
                    <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        安全防範與臨床禁忌症 (Precautions & Contraindications)
                      </div>
                      <ul className="space-y-1.5 text-xs text-rose-950">
                        {act.safetyPrecautions.map((sp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-rose-600 shrink-0">⚠️</span>
                            <span>{sp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- AI ACTIVITY GRADER MODAL --- */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-base">WaCare AI 智能活動分級調整引擎</h3>
              </div>
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">目標訓練活動：</label>
                <input
                  type="text"
                  value={aiTargetActivity}
                  onChange={(e) => setAiTargetActivity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-orange-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">個案現況與生理/認知受損描述：</label>
                <textarea
                  rows={2}
                  value={aiClientCondition}
                  onChange={(e) => setAiClientCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-orange-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">預期達成的復能目標：</label>
                <input
                  type="text"
                  value={aiTargetGoal}
                  onChange={(e) => setAiTargetGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-orange-500 text-xs sm:text-sm"
                />
              </div>

              <button
                onClick={handleRunAiGrader}
                disabled={aiLoading}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini 職能臨床推理分析中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>生成個案專屬活動分級 (Grading Up / Down / Adapt)</span>
                  </>
                )}
              </button>

              {/* AI Result Card */}
              {aiGradingResult && (
                <div className="space-y-4 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                      <Check className="w-4 h-4" /> AI 臨床分級處方已產出：
                    </span>
                    <button
                      onClick={handleSaveAiResultAsCustomActivity}
                      className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>儲存至教案庫</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-800 block mb-1">🔽 降低難度 (Grading Down)：</span>
                      <ul className="space-y-1 text-emerald-950">
                        {aiGradingResult.gradingDown.map((g, i) => (
                          <li key={i}>• {g}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <span className="font-bold text-amber-800 block mb-1">🔼 提高難度 (Grading Up)：</span>
                      <ul className="space-y-1 text-amber-950">
                        {aiGradingResult.gradingUp.map((g, i) => (
                          <li key={i}>• {g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="font-bold text-blue-800 block mb-1">🛠️ 環境代償 (Adaptations)：</span>
                      <ul className="space-y-1 text-blue-950">
                        {aiGradingResult.adaptations.map((a, i) => (
                          <li key={i}>• {a}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                      <span className="font-bold text-rose-800 block mb-1">⚠️ 安全考量 (Precautions)：</span>
                      <ul className="space-y-1 text-rose-950">
                        {aiGradingResult.precautions.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE CUSTOM ACTIVITY MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">新增自訂職能復能教案</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">活動名稱：</label>
                <input
                  type="text"
                  placeholder="例如：彩繪陀螺指尖旋轉肌群誘發訓練"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">臨床領域：</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as ClinicalDomain)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500 bg-white"
                  >
                    <option value="physical">生理神經復健</option>
                    <option value="pediatric">小兒與感覺統合</option>
                    <option value="psychosocial">精神心理職能</option>
                    <option value="community">長照與社區自理</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">建議時間 (分鐘)：</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">活動簡要描述與臨床目的：</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="描述操作過程與訓練之神經肌力重點..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Grading Down 降低難度方案 (換行分隔)：</label>
                <textarea
                  rows={2}
                  value={newGradingDown}
                  onChange={(e) => setNewGradingDown(e.target.value)}
                  placeholder="如：放大手柄、消除重力、減少操作次數..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Grading Up 提升難度方案 (換行分隔)：</label>
                <textarea
                  rows={2}
                  value={newGradingUp}
                  onChange={(e) => setNewGradingUp(e.target.value)}
                  placeholder="如：增加配重、限制時間、站立不平穩軟墊..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                取消
              </button>
              <button
                onClick={handleCreateCustomActivity}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                儲存教案
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
