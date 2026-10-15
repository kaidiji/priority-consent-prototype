import { KnowledgeArticle } from '../types';

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  // --- 1. 生理職能治療 (Physical OT) ---
  {
    id: 'phys-stroke-rehab',
    title: '腦中風偏癱上肢功能復能與動作控制臨床指引',
    category: 'clinical-domain',
    domain: 'physical',
    subtitle: 'Brunnstrom 分期介入策略、近端穩定與遠端分離動作誘發',
    summary: '腦中風後上肢與手部功能障礙是日常自理 (ADL) 受限的主因。本指引依據 Brunnstrom 恢復分期 (Stages I~VI) 及神經可塑性 (Neuroplasticity) 原則，結合任務導向訓練 (Task-Oriented Training) 與限制誘發動作療法 (CIMT)，協助個案重獲生活自主。',
    keyPoints: [
      'Brunnstrom Stage I~II (弛緩期至痙攣初現)：首重良肢位擺位預防肩關節半脫位 (Subluxation)，被動關節運動維持軟組織延展性。',
      'Brunnstrom Stage III (痙攣最高峰，出現協同動作)：利用屈曲/伸直協同動作進行功能性抓握，強化本體感覺刺激。',
      'Brunnstrom Stage IV~V (分離動作開始出現)：打破共同屈曲/伸直模式，重點訓練手肘伸直下的前臂旋後 (Supination) 與個別指屈伸。',
      'Brunnstrom Stage VI (協調動作近乎正常)：進行高難度雙手協調與速度、靈活度日常工作任務訓練。'
    ],
    protocolSteps: [
      '1. 初始評估：測量上肢關節活動度 (A/PROM)、手指握力 (Grip strength)、肩關節垂直指距脫位程度 (Finger-breadth test)。',
      '2. 擺位與保護：坐姿時提供患側手臂支撐板 (Arm trough) 或肩帶 (Sling) 保護關節囊；平躺時患肩前挺並外旋微屈。',
      '3. 任務導向訓練：依個案有意義之目標（如持水杯、洗臉、穿脫衣物）設計分級操作步驟。',
      '4. 感覺誘發與鏡像治療 (Mirror Therapy)：每日執行20-30分鐘視覺鏡像動作觀察，活化大腦感覺運動皮質。'
    ],
    precautions: [
      '嚴禁拉扯患側手臂進行移位或抬高，以防造成旋轉肌袖撕裂與複雜性局部疼痛症候群 (CRPS)。',
      '若有肩關節疼痛（VAS > 4分），應先確認肩胛肱骨節律 (Scapulohumeral rhythm) 並放鬆胸大肌與肩胛下肌。'
    ],
    references: '臺灣職能治療學會中風復健臨床指引 (2023); American Stroke Association Stroke Rehab Guidelines (2021)',
    tags: ['腦中風', 'Brunnstrom', '偏癱上肢', '任務導向訓練', '肩關節半脫位', '日常生活自理']
  },
  {
    id: 'phys-sarcopenia',
    title: '高齡肌少症與衰弱長者日常活動肌耐力強化計畫',
    category: 'clinical-domain',
    domain: 'physical',
    subtitle: '功能性阻抗訓練、防跌重心轉移與能量保留技巧 (Energy Conservation)',
    summary: '針對長照機構與社區中高齡肌少症 (Sarcopenia) 及衰弱 (Frailty) 長輩，透過職能活動整合漸進式阻抗運動、日常起居重心轉移，結合能量保留與呼吸節奏指引，改善衰退循環。',
    keyPoints: [
      '肌少症三大診斷要素：肌力下降（男性握力<28kg，女性<18kg）、肌肉質量減少、體能表現不佳（步速<1.0 m/s 或 5次坐站>12秒）。',
      '功能性阻力活動設計：結合彈力帶、日常生活重物（如米袋、保特瓶水）進行坐到站 (STS) 及階梯跨步。',
      '能量保留技巧 (Energy Conservation Technique)：採坐姿操作、物品置於腰胸之間高度、利用推車減少搬運耗能。'
    ],
    protocolSteps: [
      '1. 衰弱篩檢 (SOF Index / Fried Criteria) 與 5次坐站測試評定。',
      '2. 大肌群核心及下肢強化：雙側股四頭肌抗重力踢腿、站立後抬腿、微蹲練習（以雙手扶椅背輔助）。',
      '3. 上肢日常功能阻力：坐姿滑輪拉力訓練、毛巾擰乾阻力動作、模擬晾衣服過頭伸展。',
      '4. 蛋白質營養與水分補充跨專業衛教追蹤。'
    ],
    precautions: [
      '訓練時隨時確認個案無頭暈、胸悶或過度氣喘；患有心律不整或未受控高血壓者避免長時間等長閉氣用力 (Valsalva)。'
    ],
    references: 'AWGS 亞洲肌少症共識 (2019); 國民健康署長者衰弱評估手冊',
    tags: ['肌少症', '衰弱評估', '防跌平衡', '坐到站', '能量保留技巧']
  },

  // --- 2. 小兒職能治療 (Pediatric OT) ---
  {
    id: 'ped-sensory-integration',
    title: '兒童感覺統合 (Sensory Integration) 臨床評估與調節介入',
    category: 'clinical-domain',
    domain: 'pediatric',
    subtitle: '前庭覺、本體覺、觸覺防禦與動作計畫能力 (Praxis) 介入模式',
    summary: '感覺統合失調常見於注意力不集中 (ADHD)、自閉症類群 (ASD) 及發展遲緩兒童。本指南介紹艾爾斯感覺統合 (Ayres Sensory Integration, ASI®) 核心架構，如何透過有目的之遊戲活動達到最佳神經警醒度 (Arousal level)。',
    keyPoints: [
      '三大多元基石感覺：觸覺 (Tactile)、前庭覺 (Vestibular)、本體覺 (Proprioceptive)。',
      '前庭調節異常：前庭過度反應（重力不安全感 Gravitational Insecurity） vs 前庭尋求（尋求搖晃與旋轉刺激）。',
      '本體覺為神經調節器：重壓刺激（Deep pressure）、重工作（Heavy work）能有效降低過度亢奮或焦慮情緒。',
      '動作計畫障礙 (Dyspraxia)：在概念發想 (Ideation)、動作計畫 (Planning) 或執行 (Execution) 環節受阻。'
    ],
    protocolSteps: [
      '1. 感覺問卷 (Sensory Profile 2) 與動作臨床觀察 (Clinical Observations of Motor Skills)。',
      '2. 環境準備：吊床、抗力球、大滾筒、跳床與加重毯 (Weighted blanket)。',
      '3. 「重工作」活動介入：攀爬肋木架、推推大抗力球、推動裝滿沙包的滑車。',
      '4. 動作計畫挑戰：設定多步驟體能闖關障礙賽（過平衡木、鑽地道、投球進籃）。'
    ],
    precautions: [
      '前庭旋轉刺激必須嚴格控制：每次旋轉不得超過連續10圈，且需換向；隨時注意兒童眼球震顫 (Nystagmus)、面色蒼白或噁心反胃。'
    ],
    references: 'Ayres Sensory Integration (ASI®) Fidelity Measure; Bundick Sensory Integration Guide (2022)',
    tags: ['感覺統合', '本體覺', '前庭覺', '觸覺防禦', 'ADHD', 'ASD', '兒童動作計畫']
  },
  {
    id: 'ped-fine-motor-writing',
    title: '學齡前與低年級學童手部精細動作與握筆書寫發展',
    category: 'clinical-domain',
    domain: 'pediatric',
    subtitle: '手拱建立、指間分離、雙側協調與視知覺動作整合 (VMI)',
    summary: '兒童書寫困難 (Dysgraphia) 常源於手部內在肌力不足、掌拱扁平、手腕背屈無力或手眼協調不良。透過循序漸進的遊戲化活動，輔以適配握筆器，奠定清晰運筆能力。',
    keyPoints: [
      '握筆成熟發展里程碑：手掌抓握 (Palmar) → 數位抓握 (Digital pronate) → 四指捏握 (Quadrupod) → 動態三指握筆 (Dynamic tripod grasp，約4.5~6歲)。',
      '手部解剖基礎：近端肩胛與手腕背屈 20-30 度提供穩定支點，橈側三指負責操作，尺側兩指負責穩定支撐。',
      '手部內在肌群 (Intrinsic muscles)：骨間肌與蚓狀肌決定了手拱 (Hand arches) 的深度與耐力。'
    ],
    protocolSteps: [
      '1. 手掌內翻硬幣/串珠移位遊戲 (In-hand manipulation: translation, shift, complex rotation)。',
      '2. 黏土抗阻捏小球 (Theraputty pinching) 強化拇指指間關節與食指指腹對捏。',
      '3. 垂直傾斜板書寫 (Slant board)：強迫手腕自然背屈，避免勾腕運筆。',
      '4. 運筆輔具選配：短蠟筆、三角筆、海豚/梨形握筆器。'
    ],
    precautions: [
      '避免在手掌小肌肉尚未發育成熟（未滿4歲）前強迫孩子使用成人三指握筆寫字，易導致代償性緊繃手指變形。'
    ],
    references: 'Occupational Therapy for Children and Adolescents (Case-Smith); 臺灣兒科發展醫學會',
    tags: ['精細動作', '握筆書寫', '手部內在肌', '三指捏握', '視動整合']
  },

  // --- 3. 精神職能治療 (Psychosocial OT) ---
  {
    id: 'psych-social-skills',
    title: '精神障礙與情緒疾患之社交技巧訓練 (SST) 與生活角色重塑',
    category: 'clinical-domain',
    domain: 'psychosocial',
    subtitle: '思覺失調症、雙極性情感障礙之日常作息結構化與支持性就業準備',
    summary: '精神職能治療核心在於賦權 (Empowerment) 與復元 (Recovery) 導向。透過結構化日常生活作息安排、社交技巧訓練 (Social Skills Training, SST)、壓力管理與職業陶冶活動，促進社區融合與自我價值感。',
    keyPoints: [
      '復元理念 (Recovery Model)：跳脫僅以病徵消除為目標，重視個人希望、自主掌控與生活重拾目標。',
      '社交技巧四大核心訓練階段：暖身 → 技能示範與說明 (Modeling) → 角色扮演與演練 (Role-play) → 正向回饋與課後家庭作業。',
      '作息平衡 (Occupational Balance)：工作/生產力、休閒嗜好、日常自理與睡眠休息之健康節奏調節。'
    ],
    protocolSteps: [
      '1. 職能表現評估：加拿大職能表現測驗 (COPM) 及生活活動日誌 (Activity Configuration)。',
      '2. 團體動力引導：設定結構化團體主題（例如：超市購物溝通、職場應徵應對、拒絕不合理要求）。',
      '3. 認知行為應變演練：辨識觸發焦慮的情境與自動化負面思考，學習腹式呼吸與接地法 (Grounding 5-4-3-2-1)。',
      '4. 社區據點與庇護性工坊職業陶冶對接。'
    ],
    precautions: [
      '注意抗精神病藥物引起的錐體外症候群 (EPS)，如手抖、靜坐不能 (Akathisia) 或低血壓暈眩，適時調整活動姿勢。'
    ],
    references: 'Social Skills Training for Schizophrenia (Bellack et al.); MOHO 人類職能模式理論',
    tags: ['精神職能', '社交技巧', '思覺失調', '作息平衡', '支持性就業', 'COPM']
  },

  // --- 4. 社區與長照 2.0 復能 (Community & Eldercare OT) ---
  {
    id: 'comm-dementia-bpsd',
    title: '失智症非藥物活動介入與 BPSD 精神行為症狀之環境適應',
    category: 'clinical-domain',
    domain: 'community',
    subtitle: '蒙特梭利式失智照護 (Montessori-based Care)、懷舊治療與防遊走環境設置',
    summary: '失智症患者常因環境壓力、感官負荷過重或未被滿足之心理需求產生徘徊、攻擊、焦慮等 BPSD。職能治療師利用剩餘認知能力，透過無挫折原則 (Errorless learning) 與程序性記憶，維持尊嚴與生活功能。',
    keyPoints: [
      '蒙特梭利失智照護核心：從簡單到複雜、步驟分解、自我修正、符合個人過去生活史 (Life-story)。',
      'BPSD 溝通策略 (Validation)：同理接納長輩感受，不直接爭辯或糾正，運用轉移注意力與有意義活動代換。',
      '防遊走與導引環境：清晰的對比色標誌（如廁所門貼上真實馬桶照片）、大門加裝布簾或同色偽裝降低外出衝動。'
    ],
    protocolSteps: [
      '1. 了解個案生命史：過去職業、喜好嗜好、重要家庭成員與日常習慣。',
      '2. 感官懷舊刺激：撥放老歌金曲、觸摸早期農具/布料、嗅聞檜木精油或傳統茶香。',
      '3. 手部程序記憶活動：摺衣服毛巾、洗菜剝豆子、澆花種盆栽、拼貼老照片。',
      '4. 照顧者陪伴技巧衛教：說話速度放慢、眼神平視接觸、給予二選一單純選項。'
    ],
    precautions: [
      '黃昏症候群 (Sundowning) 好發於傍晚時分，應於下午4點前增加室內光照度，並安排緩和放鬆音樂。'
    ],
    references: 'Montessori for Dementia and Aging; 衛生福利部長照失智症照護工作手冊',
    tags: ['失智症', 'BPSD', '蒙特梭利照護', '懷舊治療', '環境標示', '照顧者衛教']
  },

  // --- 5. 長照 2.0 復能給付代碼專題 (LTC 2.0 Codes) ---
  {
    id: 'ltc-ca01',
    title: '長照 2.0 給付代碼 CA01：居家復能照護（身體功能/日常生活功能）',
    category: 'ltc2-code',
    ltcCode: 'CA01',
    paymentPoints: 1500,
    subtitle: '以「個案為中心」與「指導照護者」為核心的短期密集式復能服務',
    summary: 'CA01 是長照2.0專業服務中最核心之復能代碼。每案以 3~6 個月為一期，每週至多安排 1~2 次，總次數原則上不超過 12 次。職能治療師著重在引導個案發揮現有潛能，教導照顧者學會「放手」與「輔助」，而非被動式徒手復健。',
    keyPoints: [
      '給付點數：每次 1,500 元（自負額依福利身分：一般戶 16%，中低收 5%，低收 0%）。',
      '服務目標：必須訂定明確的 SMART 目標（如：3週內長輩能自行從床緣坐起到站立上廁所）。',
      '服務本質：重在「賦能指導」而非單純物理治療式被動關節牽拉；治療師需於現場觀察並指導主要照顧者操作。',
      '結案指標：目標達成、個案自立功能穩定、或進入自主維護期。'
    ],
    protocolSteps: [
      '1. 首次訪視 (Initial Visit)：了解個案生活作息、照專照護計畫與家庭期待；評估環境與現有能力，擬定 GAS 目標。',
      '2. 介入階段 (Intervention 2~10次)：動作技巧拆解示範、環境微調、輔具試用、指導看護工安全轉移與自理步驟。',
      '3. 監測與微調：檢視照顧者回覆示教 (Teach-back) 正確性，逐步減少治療師介入強度。',
      '4. 結案訪視 (Final Visit)：完成後測評估 (Barthel/IADL/GAS)，撰寫長照結案報告，交棒家屬居家自主執行。'
    ],
    precautions: [
      '切勿以「復健做電療/拉脖子」觀念向長輩宣導；必須強調是「練日常身手與獨立生活」。',
      '長照專業服務核銷須附上簽到單、前後測評估數據與目標達成紀錄。'
    ],
    references: '衛生福利部長期照顧給付及支付基準 (2024最新修正版); 長照復能服務實務指引',
    tags: ['長照2.0', 'CA01', '居家復能', '專業服務', 'SMART目標', 'GAS評估']
  },
  {
    id: 'ltc-ca03',
    title: '長照 2.0 給付代碼 CA03：居家環境安全評估與輔具配置指導',
    category: 'ltc2-code',
    ltcCode: 'CA03',
    paymentPoints: 1500,
    subtitle: '專業職能治療師到府量測、動線無障礙評估與輔具補助報告書開立',
    summary: '長照2.0中 CA03 為專業居家環境安全評估服務。職能治療師親赴長者家中，實地量測長輩人體尺寸與動線障礙（如門檻、樓梯、衛浴防滑、採光），並提供輔具配置與施工改造圖說建議。',
    keyPoints: [
      '給付點數：每次 1,500 元。通常一案以評估 1~2 次為原則。',
      '評估範圍：出入口動線、客廳、臥室起臥動線、廚房與衛浴沐浴如廁動線。',
      '串聯輔具補助：若長者需申請政府長照輔具補助（如輪椅、電動床、氣墊床、便盆椅、扶手），由職能治療師開立「評估報告書」。'
    ],
    protocolSteps: [
      '1. 到府前準備：調閱個案病歷、長照等級 (CMS) 及主要輔具需求。',
      '2. 實地量測與訪談：使用雷射捲尺量測門檻高度、通道寬度、馬桶及床墊高度，觀察長輩實際行走轉位動線。',
      '3. 提出環境改善方案：扶手型式（一字/L型/折疊扶手）、防滑係數標註、夜間感應照明設置。',
      '4. 填報全國長期照顧輔具暨居家無障礙環境改善評估報告書。'
    ],
    precautions: [
      '扶手固定螺絲必須打在結構實心牆或有角料之木骨架上，空心輕隔間或薄夾板切勿直接固定。'
    ],
    references: '衛生福利部輔具資源入口網; 住宅無障礙設施設計規範',
    tags: ['長照2.0', 'CA03', '居家環境評估', '輔具補助', '無障礙改造', '防跌扶手']
  },

  // --- 6. 輔具與居家無障礙改造指引 (Assistive Tech & Home Mod) ---
  {
    id: 'assist-home-spec',
    title: '居家環境無障礙改造設計規格與標準施工尺寸速查',
    category: 'home-mod',
    subtitle: '斜坡道 1:12 坡度、浴室防滑扶手高度、門檻去平化與門淨寬規範',
    summary: '環境改造能大幅降低跌倒風險達 60% 以上。本篇彙整臺灣建築技術規則與職能治療人體工學標準，提供第一線治療師在出訪時最實用的量測尺寸基準。',
    keyPoints: [
      '門檻消除：門檻應盡量去除或改為斜坡過渡；高差在 0.5~3cm 內應做 1:2 斜角；高差大於 3cm 應設置斜坡道。',
      '門淨寬度：輪椅通行淨寬至少需 80 公分（理想為 85-90 公分），避免把手占用淨空。',
      '斜坡道坡度比：室內標準為 1:12（即高差 10 公分需 120 公分坡長）；若為活動式攜帶斜坡板極限不得陡於 1:6。',
      '浴室扶手高度：馬桶側邊扶手建議離地面 70~75 公分，長度約 60~70 公分；面盆兩側扶手與面盆邊緣齊平。'
    ],
    protocolSteps: [
      '1. 量測個案坐姿人體尺寸：個案坐於輪椅時之眼睛高度、大腿高度、肘部高度與膝蓋寬度。',
      '2. 檢查地坪防滑係數：浴室地板潮濕狀態下防滑係數 (C.S.R) 應大於 0.55。',
      '3. 動線旋轉半徑檢核：輪椅迴轉直徑需預留至少 120~150 公分圓形空間。',
      '4. 夜間動線引導：床邊至廁所路徑加裝離地 30 公分之溫暖色系 (3000K) 自動人體感應小夜燈。'
    ],
    precautions: [
      '塑膠吸盤式扶手僅能作為臨時測試用，絕不可當作長照長期乘重扶手，吸盤易漏氣脫落造成嚴重跌倒骨折。'
    ],
    references: '內政部建築研究所住宅無障礙設計指引; 臺灣職能治療學會居家環境改造小組',
    tags: ['無障礙規格', '斜坡道1:12', '扶手高度', '門檻消除', '防滑評估', '居家安全']
  },
  {
    id: 'assist-wheelchair-fit',
    title: '手動與電動輪椅臨床人體工學量測與適配 (Wheelchair Fitting)',
    category: 'assistive-tech',
    subtitle: '座寬、座深、座高、腳踏板長度與減壓坐墊 (Cushion) 選配指引',
    summary: '不合身的輪椅易引發骨盆後傾 (Pelvic posterior tilt)、脊椎側彎、甚至薦骨/坐骨壓瘡。職能治療師透過系統化九大身體部位測量，選定最佳輪椅幾何與減壓坐墊。',
    keyPoints: [
      '座寬 (Seat Width)：個案臀部最寬處 + 兩側各留 1 指幅（約 2.5~5 公分空間），避免過窄壓迫或過寬導致軀幹傾斜。',
      '座深 (Seat Depth)：個案臀部最後端至膝膕窩 (Popliteal fossa) 長度扣除 2~3 指幅（約 5 公分），防壓迫膝後血管神經。',
      '座高 (Seat Height)：若需雙腳著地自主助行，腳底至膝後高度需剛好著地；若置於踏板，應維持髖膝關節 90 度。',
      '減壓坐墊分級：一般海綿（低危險） → 輪廓成型泡棉 (Contour foam) → 凝膠混合液體墊 → 氣囊分區充氣減壓墊（高危險/脊損傷者）。'
    ],
    protocolSteps: [
      '1. 墊上評估 (Mat Assessment)：平躺與坐姿檢查骨盆傾斜、旋轉及脊椎固定性側彎。',
      '2. 坐姿轉移測試：評估個案能否自行向前後左右傾斜減壓（每 15-30 分鐘需釋放坐骨壓力）。',
      '3. 輪椅配件微調：調整手推圈距離、扶手高度（自然垂肩肘屈 90 度）、防傾桿 (Anti-tipper) 角度。',
      '4. 照顧者操作衛教：下斜坡時輪椅需「倒退慢下」、上人行道落差時先踩踏後仰壓桿翹起前輪。'
    ],
    precautions: [
      '高風險壓瘡長輩使用氣墊坐墊時，每日必須以手指伸入坐骨結節下方檢測「沉入深度（Bottoming out）」，確保預留至少 1.5~2cm 氣隙。'
    ],
    references: 'RESNA Wheelchair Service Guidelines; 臺灣輔具資源整合中心臨床手冊',
    tags: ['輪椅適配', '減壓坐墊', '座寬座深', '壓瘡預防', '骨盆擺位', '人體工學']
  }
];
