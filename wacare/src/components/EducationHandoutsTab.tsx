import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Download, 
  ExternalLink,
  ChevronRight,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react';
import { EDUCATION_HANDOUTS } from '../data/educationData';
import { EducationHandout, CaseProfile } from '../types';

interface EducationHandoutsTabProps {
  currentCase: CaseProfile;
  searchQuery: string;
}

export const EducationHandoutsTab: React.FC<EducationHandoutsTabProps> = ({
  currentCase,
  searchQuery
}) => {
  const [selectedHandout, setSelectedHandout] = useState<EducationHandout>(EDUCATION_HANDOUTS[0]);
  const [isPrintPreview, setIsPrintPreview] = useState<boolean>(false);

  const filteredHandouts = EDUCATION_HANDOUTS.filter(h => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      h.title.toLowerCase().includes(q) ||
      h.summary.toLowerCase().includes(q) ||
      h.targetAudience.toLowerCase().includes(q)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <Printer className="w-3.5 h-3.5" />
            衛生福利部規範 · 標準長照居家衛教格式
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            長照個案與家庭照護者衛教指引圖解庫
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            職能治療強調「授人以漁」。提供家屬與外籍看護清晰、圖文對照的日常良肢位擺位、安全轉移位、防跌自檢與進食防嗆指南，支援一鍵列印紙本帶回家落實。
          </p>
        </div>

        <button
          onClick={() => setIsPrintPreview(true)}
          className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Printer className="w-4 h-4 text-emerald-700" />
          <span>開啟衛教單張列印版</span>
        </button>
      </div>

      {/* Main Grid: Left selector, Right detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Handout List (Left 1 col) */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            衛教主題清單 ({filteredHandouts.length})
          </span>

          <div className="space-y-2">
            {filteredHandouts.map(h => {
              const isSelected = selectedHandout.id === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHandout(h)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {h.category === 'stroke' ? '中風偏癱' :
                       h.category === 'fall-prevention' ? '防跌安全' :
                       h.category === 'transfer' ? '安全移位' : '安全進食'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {h.steps.length} 步驟
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {h.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    適用：{h.targetAudience}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Handout Full Preview (Right 2 cols) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  面向：{selectedHandout.targetAudience}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1.5">
                  {selectedHandout.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedHandout.summary}
                </p>
              </div>

              <button
                onClick={() => setIsPrintPreview(true)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>列印此單張</span>
              </button>
            </div>

            {/* Step-by-step guidance */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                核心操作步驟與圖解要領：
              </span>

              <div className="space-y-3">
                {selectedHandout.steps.map((st, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 pl-8 leading-relaxed">
                      {st.description}
                    </p>

                    {st.caution && (
                      <div className="ml-8 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span><strong>注意禁忌：</strong>{st.caution}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Caregiver Tips */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-teal-600 fill-teal-600/30" />
                職能治療師溫馨小叮嚀 (Caregiver Tips)
              </h4>
              <ul className="space-y-1.5 text-xs text-teal-950">
                {selectedHandout.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold shrink-0">✔</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

      {/* --- PRINT PREVIEW MODAL --- */}
      {isPrintPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            
            {/* Top Bar for Modal */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm text-slate-800">衛教單張列印預覽模式</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>列印 / 存為 PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintPreview(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100"
                >
                  關閉
                </button>
              </div>
            </div>

            {/* Printable Document Content (Clean Taiwan Clinical Document Layout) */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0 print:m-0">
              
              {/* Document Header */}
              <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-end">
                <div>
                  <div className="text-xs font-bold text-slate-500 tracking-wider">
                    WaCare 遠距健康與長照復能指導衛教單
                  </div>
                  <h1 className="text-2xl font-black text-slate-950 mt-1">
                    {selectedHandout.title}
                  </h1>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>個案姓名：<strong>{currentCase.name}</strong></div>
                  <div>病歷/身分證號：F22****123</div>
                  <div>衛教日期：{new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              {/* Summary */}
              <div className="text-xs text-slate-700 leading-relaxed border-l-4 border-emerald-600 pl-3 py-1 bg-slate-50">
                {selectedHandout.summary}
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  【步驟與操作要領】
                </div>
                <div className="space-y-3 text-xs">
                  {selectedHandout.steps.map((st, i) => (
                    <div key={i} className="space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="h-4 w-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                          {i + 1}
                        </span>
                        <span>{st.title}</span>
                      </div>
                      <p className="text-slate-700 pl-5 leading-relaxed">{st.description}</p>
                      {st.caution && (
                        <p className="text-rose-700 pl-5 text-[11px] font-semibold">⚠️ 禁忌提醒：{st.caution}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="border-t border-slate-200 pt-3 text-xs space-y-1 text-slate-700">
                <div className="font-bold text-slate-900 mb-1">【家庭居家照護叮嚀】：</div>
                {selectedHandout.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span>□</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>

              {/* Signatures */}
              <div className="border-t-2 border-slate-300 pt-6 grid grid-cols-2 gap-8 text-xs text-slate-600">
                <div>
                  <div className="mb-8">指導職能治療師簽章：____________________</div>
                  <div>醫療/長照機構：WaCare 職能復能團隊</div>
                </div>
                <div>
                  <div className="mb-8">個案或主要家屬簽章：____________________</div>
                  <div>諮詢電話：(02) 2345-6789</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
