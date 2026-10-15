import React, { useState } from 'react';

interface KmshBpPlanPageProps {
  onBack: () => void;
}

export const KmshBpPlanPage: React.FC<KmshBpPlanPageProps> = ({ onBack }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: "需要在指定時段上傳照片才可以嗎？補登可以嗎？",
      a: "全日時段上傳血壓數據，隔日即可抽百元禮券，一天一次抽獎機會喔！補登數據不列入當日抽獎。"
    },
    {
      q: "如何登錄血壓記錄？血壓照片要如何上傳？",
      a: "您可以透過以下步驟登錄血壓記錄並傳送照片：\n步驟 1：開啟 WaCare App\n步驟 2：在主選單選擇「健康數據」>「血壓」欄位點擊進入血壓登錄頁\n步驟 3：在血壓登錄頁點擊「照片上傳」按鈕，並選擇血壓量測記錄的照片\n步驟 4：當系統辨識完畢後，若數據正確則點擊「完成」即可存檔。"
    },
    {
      q: "量測血壓後，但出現警示訊息，我應該可以怎麼做呢？",
      a: "單筆血壓數據無法提供完整的健康評估。若仍有血壓相關的疑慮，建議您尋求附近診所進行健康諮詢，並與醫師進行討論並訂定治療方案。"
    },
    {
      q: "中獎後，優惠券該怎麼領呢？",
      a: "中獎的用戶會在計畫專屬訊息中收到中獎資訊。領獎步驟如下：\n前往課程首頁中左上角的圖示進入設定頁，找到「我的錢包」>「我的票夾」進行點擊，切換頁籤到合作頁面，選擇要兌換的優惠券。\n使用方法：複製代碼後打開網址進行兌換。\n注意：部分網頁瀏覽器可能無法正常領取，建議使用 Chrome 或 Safari 瀏覽器進行領取。"
    },
    {
      q: "為什麼我沒收到中獎通知？",
      a: "中獎的用戶會直接在聊天室中收到由專家傳送的中獎訊息。此外，如欲查詢中獎名單，可以直接於活動得獎公告上進行查詢。活動期間請勿任意退出關注專家或卸載 App，以免無法收到中獎訊息。"
    }
  ];

  return (
    <div className="absolute inset-0 z-50 bg-[#eaeaea] flex flex-col h-full w-full select-none overflow-y-auto font-sans text-[#111]">
      {/* Top App Header with Back Button */}
      <header className="h-[60px] bg-white flex justify-between items-center px-4 box-border sticky top-0 z-40 border-b border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
            title="返回聊天室"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="text-lg font-black tracking-tight text-slate-900">
            職場心健康
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700">
          <button onClick={() => scrollToSection('activity')} className="hover:text-orange-600 transition-colors cursor-pointer">活動說明</button>
          <button onClick={() => scrollToSection('progress')} className="hover:text-orange-600 transition-colors cursor-pointer">參加步驟</button>
          <button onClick={() => scrollToSection('prize')} className="hover:text-orange-600 transition-colors cursor-pointer">活動獎項</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-orange-600 transition-colors cursor-pointer">常見問題</button>
          <button
            onClick={() => setShowConsentModal(true)}
            className="bg-[#d04a25] hover:bg-[#b83e1d] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-sm transition-all cursor-pointer"
          >
            我要參加
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden w-9 h-9 rounded-lg bg-[#d04a25] hover:bg-[#b83e1d] flex items-center justify-center text-white cursor-pointer transition-colors shadow-xs"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="開啟選單"
        >
          <img src="/assets/kmshPlan/menu-icon.svg" alt="選單" className="w-5 h-5 invert" />
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-md sticky top-[60px] z-30 font-bold text-sm">
          <button onClick={() => scrollToSection('activity')} className="text-left py-1 text-slate-800 hover:text-orange-600">活動說明</button>
          <button onClick={() => scrollToSection('progress')} className="text-left py-1 text-slate-800 hover:text-orange-600">參加步驟</button>
          <button onClick={() => scrollToSection('prize')} className="text-left py-1 text-slate-800 hover:text-orange-600">活動獎項</button>
          <button onClick={() => scrollToSection('faq')} className="text-left py-1 text-slate-800 hover:text-orange-600">常見問題</button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setShowConsentModal(true);
            }}
            className="w-full bg-[#d04a25] text-white py-2 rounded-xl text-center font-black mt-1"
          >
            我要參加
          </button>
        </div>
      )}

      {/* Hero Banner Section (1:1 from hero-web.png) */}
      <section className="w-full bg-white relative">
        <picture>
          <source media="(max-width: 768px)" srcSet="/assets/kmshPlan/hero-web.png" />
          <img
            src="/assets/kmshPlan/hero-web.png"
            alt="職衛心健康"
            className="w-full h-auto block object-cover max-h-[360px] md:max-h-[480px]"
          />
        </picture>
      </section>

      {/* Content Container */}
      <div className="w-full max-w-[1200px] mx-auto px-4 py-8 space-y-12">
        {/* Section 1: 活動說明 */}
        <section id="activity" className="relative pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-black text-white text-xl md:text-2xl font-bold px-8 py-3 rounded-sm shadow-md">
              活動說明
            </div>
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[18px] border-t-black"></div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 border border-slate-200">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">參加資格</h3>
                <p className="text-base md:text-lg text-slate-700">在職的勞工朋友</p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">活動時間</h3>
                <p className="text-base md:text-lg text-slate-700">115 年 6 月 1 日至 115 年 12 月 31 日</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="bg-[#d04a25] hover:bg-[#b83e1d] text-white text-lg md:text-xl font-bold py-3.5 px-8 rounded-xl shadow-[4px_6px_0_#161273] active:translate-y-1 active:shadow-[1px_2px_0_#161273] transition-all cursor-pointer text-center"
                >
                  我要參加
                </button>
                <button
                  onClick={() => scrollToSection('prize')}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-lg md:text-xl font-bold py-3.5 px-8 rounded-xl shadow-[4px_6px_0_#161273] active:translate-y-1 active:shadow-[1px_2px_0_#161273] transition-all cursor-pointer text-center"
                >
                  查看活動獎項
                </button>
              </div>
            </div>

            <div className="w-full md:w-[360px] shrink-0 flex justify-center">
              <img
                src="/assets/kmshPlan/activity-illustration.png"
                alt="活動說明插圖"
                className="w-full max-w-[280px] md:max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Section: 重要公告 */}
        <section className="relative pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-black text-white text-xl md:text-2xl font-bold px-8 py-3 rounded-sm shadow-md">
              重要公告
            </div>
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[18px] border-t-black"></div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-4 text-slate-800 leading-relaxed">
            <h3 className="text-lg md:text-xl font-bold text-slate-900">抽獎活動中獎名單揭露與隱私聲明</h3>
            <p className="text-sm md:text-base text-slate-600">
              為了保障您的權益並確保活動順利進行，請於參加前詳閱以下聲明。當您參與本抽獎活動，即表示您已瞭解並同意以下事項：
            </p>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm md:text-base">中獎資訊公開揭露</h4>
              <p className="text-xs md:text-sm text-slate-600">
                為確保抽獎過程與結果之公平、公開與公正性，主辦單位將於活動結束後公布中獎名單。為兼顧名單核實與個人隱私保護，公布之中獎名單將僅揭露您在 WaCare 上的名稱（或部分遮蔽，如：陳Ｏ明）以及部分行動電話號碼（如：0912XXX678）。
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm md:text-base">個人資料使用目的</h4>
              <p className="text-xs md:text-sm text-slate-600">
                您於參與活動時所提供之個人資料，僅做為本次抽獎活動之身分確認、中獎通知、獎項發送及相關聯繫使用。主辦單位將嚴格遵守《個人資料保護法》之規定，絕不將您的個人資料挪作他用或未經授權外流。
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm md:text-base">參加者權益</h4>
              <p className="text-xs md:text-sm text-slate-600">
                凡參與本活動即視同同意本聲明之規範。若您不同意上述中獎資訊揭露方式或個人資料之蒐集與處理，請勿參與本次抽獎活動；若於活動期間提出撤回同意之請求，主辦單位將有權取消您的抽獎與中獎資格。
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: 達成條件很簡單 (參加步驟) */}
        <section id="progress" className="relative pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-black text-white text-lg md:text-2xl font-bold px-8 py-3 rounded-sm shadow-md flex items-center gap-2">
              <span className="text-sm md:text-lg font-normal">達成條件</span>
              <span>很簡單</span>
              <span className="text-sm md:text-lg font-normal">只需要</span>
            </div>
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[18px] border-t-black"></div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-8">
            <div className="text-center">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">跟隨下方指引開始參加活動吧！</h3>
            </div>

            {/* Step 1 */}
            <div className="border border-slate-200 rounded-xl p-4 md:p-6 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#d04a25] text-white flex items-center justify-center font-bold text-sm">1</span>
                <span className="text-base md:text-lg font-bold text-slate-900">填寫同意書</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step1-1.png" alt="查看同意書" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">01</span>查看同意書</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step1-2.png" alt="點擊「同意」" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">02</span>點擊「同意」</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="bg-[#d04a25] text-white font-bold text-sm py-2 px-6 rounded-full shadow-sm hover:bg-[#b83e1d] transition-colors"
                >
                  填寫同意書
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-200 rounded-xl p-4 md:p-6 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#d04a25] text-white flex items-center justify-center font-bold text-sm">2</span>
                <span className="text-base md:text-lg font-bold text-slate-900">跟專家打招呼</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step2-1.png" alt="向專家帳號打招呼" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">01</span>向「專家帳號」打招呼</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step2-2.png" alt="收到專家訊息" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">02</span>收到專家訊息</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step2-3.png" alt="分享個人數據" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">03</span>分享個人數據</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-200 rounded-xl p-4 md:p-6 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#d04a25] text-white flex items-center justify-center font-bold text-sm">3</span>
                <span className="text-base md:text-lg font-bold text-slate-900">填寫問卷</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step4-1.png" alt="點選問卷" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">01</span>點選「問卷」</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step4-2.png" alt="選擇職場問卷" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">02</span>選擇「職場問卷」</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step4-3.png" alt="填寫問卷並提交" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">03</span>填寫問卷並提交</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="border border-slate-200 rounded-xl p-4 md:p-6 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#d04a25] text-white flex items-center justify-center font-bold text-sm">4</span>
                <span className="text-base md:text-lg font-bold text-slate-900">填寫血壓測量</span>
              </div>
              <p className="text-xs text-orange-600 font-bold mb-4 pl-9">
                第二天開始只需完成此步驟即可每天參加抽獎！沒有時間限制，一整天任何時段都可以測量。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step5-1.png" alt="健康數據頁面" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">01</span>健康數據頁面點「紀錄血壓」</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step5-2.png" alt="點選任一方式紀錄血壓" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">02</span>點選任一方式紀錄血壓</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center">
                  <img src="/assets/kmshPlan/step5-3.png" alt="上傳成功" className="h-44 md:h-52 object-contain mb-2" />
                  <span className="text-xs font-bold text-slate-600"><span className="text-orange-600 mr-1">03</span>上傳成功</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: 活動獎項 */}
        <section id="prize" className="relative pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-black text-white text-xl md:text-2xl font-bold px-8 py-3 rounded-sm shadow-md">
              活動獎項
            </div>
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[18px] border-t-black"></div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="/assets/kmshPlan/gift-envelope.png"
                alt="禮券日日抽"
                className="w-full max-w-[280px] h-auto object-contain"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-xl md:text-2xl font-black text-[#c2410c]">禮券日日抽，獎項機會無限</h3>
              <p className="text-base md:text-lg text-slate-800 font-bold leading-relaxed">
                每日抽出兩名得獎民眾，獎項為 <span className="text-red-600 font-black text-xl">100 元</span> 超商禮券（兩名）！
              </p>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                只要每日量血壓，將能無限次參加，每人每日一次機會！還等什麼？趕快加入測血壓抽大獎！
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="bg-[#d04a25] hover:bg-[#b83e1d] text-white text-base font-bold py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  立即加入計畫
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: 常見問題 FAQ */}
        <section id="faq" className="relative pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-black text-white text-xl md:text-2xl font-bold px-8 py-3 rounded-sm shadow-md">
              常見問題
            </div>
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[18px] border-t-black"></div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 divide-y divide-slate-100">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left font-bold text-base md:text-lg text-slate-900 cursor-pointer gap-4 group"
                >
                  <span className="flex items-start gap-2">
                    <span className="text-orange-600 font-black">Q.</span>
                    <span className="group-hover:text-orange-600 transition-colors">{faq.q}</span>
                  </span>
                  <span className="text-xl text-slate-400 group-hover:text-orange-600 transition-transform duration-200">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="mt-3 pl-6 text-sm md:text-base text-slate-600 whitespace-pre-line leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 text-center text-slate-500 text-xs md:text-sm border-t border-slate-300/80 space-y-4">
          <div className="flex items-center justify-center gap-6">
            <img src="/assets/kmshPlan/host-logo-1.png" alt="小港醫院" className="h-10 w-auto object-contain" />
            <img src="/assets/kmshPlan/wacare-logo.png" alt="WaCare" className="h-7 w-auto object-contain" />
          </div>
          <p>主辦單位：吉樂健康資訊科技股份有限公司、高雄市立小港醫院</p>
          <p className="text-[11px] text-slate-400">© 2026 WaCare & Kaohsiung Municipal Siaogang Hospital. All rights reserved.</p>
        </footer>
      </div>

      {/* Floating Buttons (Right Bottom) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-white/95 rounded-full shadow-lg border border-slate-200 flex flex-col items-center justify-center p-1 cursor-pointer hover:bg-slate-50 transition-transform active:scale-95"
          title="回到頂部"
        >
          <img src="/assets/kmshPlan/floating-home-icon.png" alt="" className="w-5 h-5 object-contain" />
          <span className="text-[8px] font-bold text-slate-600">置頂</span>
        </button>
      </div>

      {/* Research Consent Modal (研究參與同意書) */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
              <h2 className="text-base md:text-lg font-bold text-slate-900">
                勞動者心血管健康世代研究：人工智慧與數位健康整合藍圖 參與同意書
              </h2>
              <button
                onClick={() => setShowConsentModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900">
                親愛的參與者您好：我們誠摯邀請您參加「勞動者心血管健康世代研究：人工智慧與數位健康整合藍圖」研究計畫。在您點擊同意前，請詳閱以下資訊：
              </p>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">一、為什麼我們要進行這項研究？</h4>
                <p>
                  心血管疾病是全球重要的健康議題。本研究旨在透過人工智慧、物聯網與即時檢測技術，評估勞動者的心血管風險，並提供個人化的健康管理建議，幫助您養成健康習慣並預防疾病。
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">二、我需要做什麼？</h4>
                <p>
                  若您同意參加，我們將邀請您配合以下事項：<br />
                  1. 問卷調查：填寫基本資料、工作壓力、肌少症與衰弱篩檢等量表。<br />
                  2. 生理數據測量：測量身高、體重、腰圍及規律紀錄血壓。<br />
                  3. 檢體採集：由專業醫護人員自指尖採集少量血液及尿液進行血糖、膽固醇等即時檢測（採檢前請空腹）。
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">三、參與的效益與風險</h4>
                <p>
                  預期效益：您可以更了解自身的血壓與代謝健康狀況，並提升個人健康管理技巧。<br />
                  可能風險：抽血過程可能會有短暫不適或輕微腫脹，其他問卷調查對日常生活並無顯著影響。
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">四、隱私與資料保護</h4>
                <p>
                  您的個人資訊將以代碼取代姓名，並保存於設有密碼鎖定的電腦中，嚴格保密。研究資料將依法保存與銷毀。
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">五、您的權利（完全自願）</h4>
                <p>
                  您可以自由決定是否參加，也可以在研究期間隨時退出，不需任何理由，且絕對不會影響您日後的醫療照護權益。
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">六、聯絡資訊</h4>
                <p>
                  若有任何疑問，歡迎隨時聯繫計畫主持人：楊鎮誠 醫師<br />
                  高雄市立小港醫院職業醫學科<br />
                  聯絡電話：07-803-6783
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>本人已詳細閱讀上述內容，並同意自願參與本項研究</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowConsentModal(false)}
                className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer text-sm"
              >
                不同意並返回
              </button>
              <button
                disabled={!consentAgreed}
                onClick={() => {
                  alert("感謝您同意參與！您已成功加入「職場心健康」研究計畫！");
                  setShowConsentModal(false);
                }}
                className={`px-6 py-2 rounded-xl text-white font-bold transition-all text-sm ${
                  consentAgreed
                    ? 'bg-[#d04a25] hover:bg-[#b83e1d] shadow-md cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                我同意
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
