import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Tag, 
  Copy, 
  Check, 
  Coins, 
  Scale, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { KNOWLEDGE_ARTICLES } from '../data/knowledgeData';
import { KnowledgeArticle } from '../types';

interface KnowledgeBaseTabProps {
  searchQuery: string;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const KnowledgeBaseTab: React.FC<KnowledgeBaseTabProps> = ({ 
  searchQuery,
  onOpenAiWithPrompt 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: '全部指引' },
    { id: 'clinical-domain', label: '四大臨床領域 (生理/小兒/精神/社區)' },
    { id: 'ltc2-code', label: '長照 2.0 復能給付規準 (CA代碼)' },
    { id: 'home-mod', label: '居家無障礙改造規格 (1:12/扶手/動線)' },
    { id: 'assistive-tech', label: '輔具評估與輪椅適配 (Seating/Cushion)' }
  ];

  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter(art => {
      const matchCategory = selectedCategory === 'all' || art.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText = 
        art.title.toLowerCase().includes(q) ||
        art.subtitle.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.tags.some(t => t.toLowerCase().includes(q)) ||
        (art.ltcCode && art.ltcCode.toLowerCase().includes(q));

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyText = (art: KnowledgeArticle) => {
    const text = `【${art.title}】\n${art.subtitle}\n\n[核心要點]:\n${art.keyPoints.join('\n')}\n\n[臨床處置步驟]:\n${art.protocolSteps.join('\n')}\n\n[安全注意事項]:\n${art.precautions.join('\n')}\n\n(資料來源: ${art.references})`;
    navigator.clipboard.writeText(text);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Header Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-teal-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            臺灣職能治療學會 & 長照 2.0 實務指引整合
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            職能治療臨床知識指引與長照復能法規庫
          </h1>
          <p className="mt-2 text-sm text-orange-50 leading-relaxed">
            彙整腦中風神經復健、高齡肌少衰弱、兒童感覺統合、失智非藥物 BPSD 介入、長照 2.0 CA01~CA04 給付點數及居家無障礙人體工學標準。
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <BookOpen className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map(art => (
          <div
            key={art.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5">
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  art.category === 'ltc2-code'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : art.category === 'home-mod'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : art.category === 'assistive-tech'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-orange-100 text-orange-800 border border-orange-200'
                }`}>
                  {art.category === 'ltc2-code' ? `長照給付代碼: ${art.ltcCode}` :
                   art.category === 'home-mod' ? '居家環境改造規格' :
                   art.category === 'assistive-tech' ? '輔具評估與輪椅適配' : '臨床專科指引'}
                </span>

                {art.paymentPoints && (
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    {art.paymentPoints} 元 / 次
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {art.title}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">
                {art.subtitle}
              </p>

              {/* Summary */}
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                {art.summary}
              </p>

              {/* Key points preview */}
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" />
                  臨床核心要素:
                </div>
                <ul className="text-xs text-slate-600 space-y-1">
                  {art.keyPoints.slice(0, 2).map((kp, idx) => (
                    <li key={idx} className="line-clamp-1 pl-2 border-l-2 border-orange-300">
                      {kp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {art.tags.slice(0, 4).map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopyText(art)}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                title="複製指引摘要"
              >
                {copiedId === art.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-teal-600">已複製</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製摘要</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedArticle(art)}
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>閱讀完整手冊</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium text-sm">找不到符合條件的臨床指引</p>
          <p className="text-slate-400 text-xs mt-1">請嘗試更換關鍵字或切換類別分類。</p>
        </div>
      )}

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                    {selectedArticle.category === 'ltc2-code' ? `長照給付代碼 ${selectedArticle.ltcCode}` :
                     selectedArticle.category === 'home-mod' ? '居家無障礙規格' :
                     selectedArticle.category === 'assistive-tech' ? '輔具評估標準' : '臨床指引'}
                  </span>
                  {selectedArticle.paymentPoints && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      每次 {selectedArticle.paymentPoints} 元
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {selectedArticle.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
              
              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-orange-600 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> 臨床摘要與背景
                </h4>
                <p className="text-xs sm:text-sm bg-orange-50/50 p-3.5 rounded-xl border border-orange-100 text-slate-800 leading-relaxed">
                  {selectedArticle.summary}
                </p>
              </div>

              {/* Key points */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-teal-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 核心臨床實務要點
                </h4>
                <ul className="space-y-2">
                  {selectedArticle.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Protocol steps */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> 標準化處置與評估步驟
                </h4>
                <div className="space-y-2">
                  {selectedArticle.protocolSteps.map((step, idx) => (
                    <div key={idx} className="text-xs sm:text-sm text-slate-700 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Precautions */}
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> 安全考量、禁忌症與防範措施
                </h4>
                <div className="space-y-1.5">
                  {selectedArticle.precautions.map((p, idx) => (
                    <div key={idx} className="text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      ⚠️ {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* References */}
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                <span className="font-semibold text-slate-600">學術文獻與法規依據：</span> {selectedArticle.references}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopyText(selectedArticle)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === selectedArticle.id ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === selectedArticle.id ? '已複製全文' : '複製臨床內容'}</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
              >
                關閉視窗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
