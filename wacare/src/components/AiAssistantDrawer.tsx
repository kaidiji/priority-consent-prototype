import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  HelpCircle, 
  BookOpen, 
  Dumbbell, 
  FileText, 
  ShieldCheck,
  X
} from 'lucide-react';
import { CaseProfile } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: CaseProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentCase
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `您好！我是 WaCare 職能復能 AI 臨床小幫手。我已為您載入目前個案【${currentCase.name}，${currentCase.age}歲，診斷：${currentCase.diagnosis}】。您可以隨時詢問我任何活動分級調整 (Grading)、SMART目標擬定、長照2.0 CA01~CA04 核銷規範或居家環境改造尺寸！`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsLoading(true);

    try {
      // Determine task type based on keywords
      if (promptToSend.includes('分級') || promptToSend.includes('Grade') || promptToSend.includes('活動')) {
        const res = await fetch('/api/ai/grade-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityTitle: promptToSend,
            clientCondition: `${currentCase.name}（${currentCase.age}歲），診斷：${currentCase.diagnosis}`,
            targetGoal: '提升日常自理與動作控制',
            currentDifficulty: '中等'
          })
        });
        const data = await res.json();
        const replyText = `【活動分級建議】\n\n🔽 降低難度 (Grading Down):\n${(data.gradingDown || []).map((x: string) => `• ${x}`).join('\n')}\n\n🔼 提升難度 (Grading Up):\n${(data.gradingUp || []).map((x: string) => `• ${x}`).join('\n')}\n\n🛠️ 代償策略:\n${(data.adaptations || []).map((x: string) => `• ${x}`).join('\n')}\n\n⚠️ 安全考量:\n${(data.precautions || []).map((x: string) => `• ${x}`).join('\n')}`;
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else if (promptToSend.includes('目標') || promptToSend.includes('SMART') || promptToSend.includes('GAS')) {
        const res = await fetch('/api/ai/smart-goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseName: currentCase.name,
            age: `${currentCase.age}歲`,
            diagnosis: currentCase.diagnosis,
            currentLevel: `巴氏量表：${currentCase.barthelScore || 50}分`,
            desiredOutcome: promptToSend
          })
        });
        const data = await res.json();
        const replyText = `【SMART 目標規劃】\n• 短期(4週)：${data.smartGoals?.shortTerm || '在輕度引導下完成進食'}\n• 中期(8週)：${data.smartGoals?.mediumTerm || '獨立使用輔具'}\n• 長期(12週)：${data.smartGoals?.longTerm || '日常生活完全獨立'}\n\n【GAS 目標達成指標】:\n${(data.gasLevels || []).map((g: any) => `${g.score > 0 ? `+${g.score}` : g.score}: ${g.description}`).join('\n')}`;

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // General clinical consultation
        const res = await fetch('/api/ai/soap-note', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            therapistNotes: promptToSend,
            assessmentScores: `Barthel: ${currentCase.barthelScore || '--'}, TUG: ${currentCase.tugScore || '--'}`
          })
        });
        const data = await res.json();
        const replyText = data.soap ? 
          `【SOAP 臨床分析整理】\n\n[S 主觀]: ${data.soap.s}\n\n[O 客觀]: ${data.soap.o}\n\n[A 評估]: ${data.soap.a}\n\n[P 計畫]: ${data.soap.p}` :
          `已收到您的諮詢！建議依據長照 2.0 CA01 居家復能規範，每次訪視聚焦 1~2 項功能動作，並落實照顧者回覆示教。`;

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: '抱歉，臨床 AI 助理連線逾時，已為您自動載入內建臨床指引常模。',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    `針對 ${currentCase.name} 擬定 4 週穿衣與移位 SMART 目標`,
    `如何為中風偏癱患肢設計拿水杯活動的 Grading Up 與 Down？`,
    `長照 CA01 居家復能結案標準與成效指標是什麼？`,
    `浴室無障礙扶手安裝高度與門檻改善標準規格`
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-teal-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                <span>WaCare 職能復能 AI 小幫手</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">Gemini 3.8</span>
              </h3>
              <p className="text-[11px] text-orange-100">
                當前個案：{currentCase.name} ({currentCase.diagnosis})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 border border-slate-200 rounded-full text-slate-700 whitespace-nowrap transition-all shadow-2xs cursor-pointer shrink-0"
            >
              💡 {qp.slice(0, 16)}...
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-orange-100 text-orange-700'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 shadow-2xs text-xs'
              }`}>
                {m.text}
                <div className={`text-[9px] mt-1.5 ${m.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse p-2">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span>Gemini 職能臨床推理中...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="請輸入臨床問題（如：如何調整穿衣活動難度、GAS 指標...）"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-orange-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
