import { CaseProfile } from '../types';

export const INITIAL_CASES: CaseProfile[] = [
  {
    id: 'case-001',
    name: '林陳阿美',
    gender: 'female',
    age: 76,
    cmsLevel: 5,
    diagnosis: '缺血性腦中風 (Left MCA Infarction) 右側偏癱亞急性期',
    onsetDuration: '發病後 3 個月',
    primaryCaregiver: '同住長女與外籍印尼看護 (Siti)',
    domain: 'physical',
    barthelScore: 55,
    iadlScore: 2,
    tugScore: 22.4,
    reablementStatus: 'active',
    notes: '長照2.0居家復能 CA01 案（核定 8 次）。個案動機極佳，希望自己可以不用再包尿布，並能在女兒陪伴下下樓散步。',
    goals: [
      {
        id: 'goal-1',
        targetArea: '床椅移位與如廁自立 (Transfer & Toileting)',
        smartGoal: '在 4 週內，個案能在看護口頭提醒下，自行從床緣坐起轉移至便盆椅上，無需他人拉扯攙扶。',
        targetDate: '2026-10-15',
        currentGas: 0,
        gasHistory: [
          { date: '2026-09-01', score: -2 },
          { date: '2026-09-10', score: -1 },
          { date: '2026-09-20', score: 0 }
        ],
        gasLevels: [
          { score: -2, label: '目前基線', description: '需看護兩人合力抱扶移位，個案雙腳無法主動踩地支撐。' },
          { score: -1, label: '少於預期', description: '一人輕扶腰帶可勉強站立，但無法旋轉屁股對準便盆椅。' },
          { score: 0, label: '達到預期 (Target)', description: '健側手扶穩便盆椅把手，一人在旁監督口頭提示下安全轉位入座。' },
          { score: 1, label: '優於預期', description: '可完全自主完成移位，並能以健手拉下外褲如廁。' },
          { score: 2, label: '大幅超越', description: '不需便盆椅，能持四腳拐走到主臥衛浴馬桶獨立如廁。' }
        ]
      },
      {
        id: 'goal-2',
        targetArea: '上肢日常生活進食自立 (Feeding Reablement)',
        smartGoal: '在 6 週內，個案能使用粗握柄輔助湯匙與斜口防溢餐盤，獨立吃完半碗熱稀飯（不超過 30 分鐘）。',
        targetDate: '2026-10-30',
        currentGas: -1,
        gasHistory: [
          { date: '2026-09-01', score: -2 },
          { date: '2026-09-15', score: -1 }
        ],
        gasLevels: [
          { score: -2, label: '目前基線', description: '完全由看護餵食，右手無法持握餐具。' },
          { score: -1, label: '少於預期', description: '右手套上束帶湯匙，可由盤中舀起送口 2~3 口，其餘仍易掉落。' },
          { score: 0, label: '達到預期 (Target)', description: '在防溢盤輔助下，能獨立舀取並吃完半碗飯，食物掉落不超過 2 次。' },
          { score: 1, label: '優於預期', description: '能獨立吃完整碗飯菜，且能自己持水杯飲水無嗆咳。' },
          { score: 2, label: '大幅超越', description: '能改換一般普通瓷湯匙進食，且能自己拿餐巾紙擦嘴。' }
        ]
      }
    ],
    soapRecords: [
      {
        id: 'soap-101',
        date: '2026-09-20',
        sessionNumber: 3,
        therapist: '陳品秀 職能治療師 (OTR/L)',
        subjective: '個案面帶笑容表示：「我今天早上第一次自己坐在床邊穿外套，雖然拉鍊拉不上，但很開心！」外籍看護反映長輩移位時右腳比較願意踩地用力了。',
        objective: '生命徵象穩定 BP 128/78 mmHg, HR 74 bpm。坐姿平衡動態良好 (Good)。右側上肢 Brunnstrom Stage IV，肩屈曲可達 80 度，肘伸直主動受限約 15 度。於床邊指導移位五步驟演練 4 次，個案已能掌握「鼻子過腳趾」前傾重心轉移要領，由看護單手輕扶腰帶即順利完成床至輪椅移位。',
        assessment: '個案下肢負重耐力明顯進步，核心肌群控制提升。移位信心大幅增加，已達成 GAS = 0 預期目標。右側上肢遠端屈肌痙攣稍降（Modified Ashworth Scale 1+），下一步可著重精細進食輔具操作與穿衣代償。',
        plan: '1. 指導看護每日固定於晨間由長輩自主練習轉位，切勿直接抱抬。2. 引入加粗柄湯匙與單手穿衣扣鈕扣輔助器。3. 下次排定 9/27：訪視重點為廚房及餐廳動線輔具實操。'
      },
      {
        id: 'soap-102',
        date: '2026-09-10',
        sessionNumber: 2,
        therapist: '陳品秀 職能治療師 (OTR/L)',
        subjective: '長女表示個案情緒比上週開朗，願意配合做動作，但偶爾抱怨右肩膀痠痠的。',
        objective: '右側肩關節半脫位檢測約 1 指幅（Finger-breadth），無明顯發炎紅腫。施予肩胛骨活動度放鬆與三角肌前束等長神經誘發 (PNF)。坐姿下練習重心左右位移及骨盆前後傾。給予手臂吊帶（Arm sling）於站立時配戴。',
        assessment: '肩關節半脫位為偏癱早期典型代償問題，及時衛教擺位可避免進一步疼痛惡化。個案軀幹肌力佳，轉移位深具潛能。',
        plan: '1. 衛教外籍看護嚴禁拉扯患手手腕移位。2. 練習坐到站重心轉移。3. 建議床邊加裝床邊起身扶手。'
      }
    ]
  },
  {
    id: 'case-002',
    name: '張榮發阿公',
    gender: 'male',
    age: 82,
    cmsLevel: 4,
    diagnosis: '阿茲海默型失智症 (輕中度 CDR 1~2) 合併跌倒骨折病史',
    onsetDuration: '確診 2 年，右髖關節骨折術後 6 個月',
    primaryCaregiver: '配偶張奶奶 (79歲) 與居住附近的次子',
    domain: 'community',
    barthelScore: 70,
    iadlScore: 3,
    tugScore: 24.8,
    reablementStatus: 'active',
    notes: '長照2.0專業服務 CA03 居家環境安全評估與輔具配置。個案有黃昏症候群，傍晚常急著出門「要去上班」，曾於浴室滑倒兩次。',
    goals: [
      {
        id: 'goal-3',
        targetArea: '居家防跌與衛浴安全 (Bathroom Safety & Fall Prevention)',
        smartGoal: '在 3 週內，完成衛浴防滑扶手安裝與防滑塗料，個案能遵守「扶穩扶手再轉身」指令，沐浴時零跌倒。',
        targetDate: '2026-10-10',
        currentGas: 0,
        gasHistory: [
          { date: '2026-09-05', score: -2 },
          { date: '2026-09-18', score: 0 }
        ],
        gasLevels: [
          { score: -2, label: '目前基線', description: '浴室地面濕滑無扶手，曾於跨入淋浴門檻時跌倒滑坐在地。' },
          { score: -1, label: '少於預期', description: '已安裝扶手，但長輩習慣性忘記抓握，仍直接快步進入。' },
          { score: 0, label: '達到預期 (Target)', description: '門口貼顯眼對比提示，在奶奶口頭提醒下一手緊握扶手、安全坐於洗澡椅。' },
          { score: 1, label: '優於預期', description: '長輩能主動抓握扶手進出，且能自主使用長柄沐浴海綿擦洗背部與下肢。' },
          { score: 2, label: '大幅超越', description: '全家浴室動線完成無門檻去平化改造，長輩如廁與洗沐均能獨立安全進行。' }
        ]
      }
    ],
    soapRecords: [
      {
        id: 'soap-201',
        date: '2026-09-18',
        sessionNumber: 2,
        therapist: '黃志偉 職能治療師',
        subjective: '張奶奶：「自從你們幫忙裝了那個黃色防滑扶手跟洗澡椅，現在洗澡他比較肯坐著了，我也不用每次嚇得心臟快跳出來！」阿公表示水溫很舒服，洗澡椅很穩。',
        objective: '實地檢核 CA03 施工後衛浴環境：馬桶右側一字型扶手離地 72cm 穩固，淋浴間 L 型扶手離地 75-110cm。地坪塗佈奈米防滑劑後濕滑摩擦係數 C.S.R 達 0.62。現場請阿公模擬脫鞋進入浴室洗澡動線，阿公能依照門口黃黑警示條提示，伸手扶住橫向扶手並坐上洗澡椅。',
        assessment: '視覺提示與實體扶手有效降低認知障礙長輩之環境風險。TUG 由兩週前之 26.2 秒微幅進步至 24.8 秒，轉身時軀幹旋轉較為順暢。',
        plan: '1. 開立全國輔具補助核銷報告書 (CA03)。2. 衛教次子傍晚 4 點前將客廳照明全開，並播放阿公年輕時愛聽的台語老歌減緩黃昏症候群。3. 結案追蹤。'
      }
    ]
  },
  {
    id: 'case-003',
    name: '小宇 (化名)',
    gender: 'male',
    age: 6,
    cmsLevel: 0,
    diagnosis: '動作協調障礙 (DCD) 疑似合併注意力不足 (ADHD)',
    onsetDuration: '大班下學期，幼兒園導師轉介',
    primaryCaregiver: '母親',
    domain: 'pediatric',
    barthelScore: 90,
    iadlScore: 6,
    tugScore: 8.5,
    reablementStatus: 'active',
    notes: '國小入學前職能評估。家長主訴握筆姿勢歪斜、寫數字常左右顛倒（鏡像字），上課坐不住容易從椅子上滑落。',
    goals: [
      {
        id: 'goal-4',
        targetArea: '握筆姿勢與運筆耐力 (Pencil Grasp & Handwriting Endurance)',
        smartGoal: '在 8 週內，小宇能使用三角筆在動態三指握筆下，連續書寫注音符號與數字 10 分鐘，字體落在九宮格內無出格。',
        targetDate: '2026-11-20',
        currentGas: -1,
        gasHistory: [
          { date: '2026-09-12', score: -2 },
          { date: '2026-09-22', score: -1 }
        ],
        gasLevels: [
          { score: -2, label: '目前基線', description: '採拳頭抓握或五指包筆，手腕過度屈曲勾手，寫3分鐘便喊手痠甩手。' },
          { score: -1, label: '少於預期', description: '在海豚握筆器輔助下維持三指捏握，能寫 5 個大字，但偶爾仍會跑位。' },
          { score: 0, label: '達到預期 (Target)', description: '能以三指握筆獨立書寫 10 分鐘，手指關節不過度用力反折，字體大小適中。' },
          { score: 1, label: '優於預期', description: '不需特殊握筆器，使用一般鉛筆即可維持動態三指握法完成作業。' },
          { score: 2, label: '大幅超越', description: '運筆速度與手眼協調超越同儕平均，能穩定仿畫複雜幾何圖形。' }
        ]
      }
    ],
    soapRecords: [
      {
        id: 'soap-301',
        date: '2026-09-22',
        sessionNumber: 2,
        therapist: '廖書涵 職能治療師',
        subjective: '媽媽反饋這週在家玩黏土拔豆子，小宇很喜歡，但寫數字時還是會把 3 寫反成 E。小宇說：「老師，我今天有抓緊小怪獸（握筆器）喔！」',
        objective: '手部肌力：拇指食指側捏肌力 1.8kg，掌拱深度中等。進行垂直傾斜板 (Slant board 20度) 仿畫與連連看迷宮遊戲。使用 Theraputty 綠色中阻力黏土揉捏 15 顆小圓球，完成三指捏放。進行 10 分鐘注音符號描紅，握筆器維持動態三指機率達 75%。',
        assessment: '近端肩頸穩定度在傾斜板支撐下顯著改善，勾手代償減少。視知覺空間方向感（避免鏡像字）仍需透過觸覺砂紙字卡與大動作空中描字強化大腦記憶。',
        plan: '1. 請家長準備 20 度斜面書寫板供幼兒園及家中寫作業使用。2. 每日在家進行「小螃蟹夾曬衣夾」指尖肌力遊戲 5 分鐘。'
      }
    ]
  }
];
