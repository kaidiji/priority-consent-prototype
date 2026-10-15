import { BarthelItem, IADLItem } from '../types';

export const BARTHEL_ITEMS: BarthelItem[] = [
  {
    id: 'feeding',
    name: '1. 進食 (Feeding)',
    category: '自理能力',
    options: [
      { score: 0, text: '完全依賴', description: '完全由他人餵食，或依賴鼻胃管灌食且無法自行操作。' },
      { score: 5, text: '需要協助', description: '需他人協助切肉、塗奶油、夾菜或使用進食輔具。' },
      { score: 10, text: '完全獨立', description: '能自行在合理時間內（約20-30分鐘）以餐具完成進食。' },
    ]
  },
  {
    id: 'transfer',
    name: '2. 床椅移位 (Transfer)',
    category: '活動能力',
    options: [
      { score: 0, text: '完全依賴', description: '無法坐起，需兩人以上使用移位機或抱起。' },
      { score: 5, text: '大量協助', description: '能自行坐起，但轉位需一人全力扶持或兩人攙扶。' },
      { score: 10, text: '輕度協助', description: '需一人在旁輕扶或口頭監督提示確保安全。' },
      { score: 15, text: '完全獨立', description: '能安全獨立從床上移至輪椅或椅子，包含煞車與收放踏板。' },
    ]
  },
  {
    id: 'grooming',
    name: '3. 個人衛生 (Personal Grooming)',
    category: '自理能力',
    options: [
      { score: 0, text: '需人協助', description: '無法自行洗臉、刷牙、梳頭或刮鬍子。' },
      { score: 5, text: '完全獨立', description: '可自行完成洗臉、梳頭、刷牙及刮鬍子，可使用輔具。' },
    ]
  },
  {
    id: 'toilet',
    name: '4. 如廁 (Toilet Use)',
    category: '自理能力',
    options: [
      { score: 0, text: '完全依賴', description: '如廁全需他人代勞，或使用便盆、尿布無法自行清理。' },
      { score: 5, text: '需人協助', description: '需他人協助穿脫褲子、擦拭、或維持坐姿平衡。' },
      { score: 10, text: '完全獨立', description: '能自行進出廁所、穿脫衣物、擦拭屁股並沖水。' },
    ]
  },
  {
    id: 'bathing',
    name: '5. 洗澡 (Bathing)',
    category: '自理能力',
    options: [
      { score: 0, text: '需人協助', description: '洗澡全程需他人洗擦或移位進出浴缸/淋浴間。' },
      { score: 5, text: '完全獨立', description: '能自行洗身、抹肥皂、沖水與擦乾，可使用洗澡椅與長柄刷。' },
    ]
  },
  {
    id: 'mobility',
    name: '6. 平地走動 (Walking on level surface)',
    category: '活動能力',
    options: [
      { score: 0, text: '不能走動', description: '完全無法行走（若操作輪椅可獨立推行50公尺得5分）。' },
      { score: 5, text: '輪椅獨立', description: '雖無法行走，但能獨立操作輪椅推行50公尺以上。' },
      { score: 10, text: '需人扶持', description: '可持手杖或助行器行走50公尺，需一人在旁扶持或看顧。' },
      { score: 15, text: '完全獨立', description: '能獨立行走50公尺以上，可使用拐杖、助行架或支架。' },
    ]
  },
  {
    id: 'stairs',
    name: '7. 上下樓梯 (Stairs)',
    category: '活動能力',
    options: [
      { score: 0, text: '完全無法', description: '無法上下樓梯，需他人抱扶或使用爬梯機。' },
      { score: 5, text: '需人協助', description: '需他人扶持或監督，可扶扶手或持拐杖上下階梯。' },
      { score: 10, text: '完全獨立', description: '能安全獨立上下至少一層樓梯，可扶扶手或持拐杖。' },
    ]
  },
  {
    id: 'dressing',
    name: '8. 穿脫衣物 (Dressing)',
    category: '自理能力',
    options: [
      { score: 0, text: '完全依賴', description: '無法自行穿脫衣褲或鞋襪，需他人完全代勞。' },
      { score: 5, text: '需人協助', description: '能穿上一部分，但扣鈕扣、拉拉鍊或穿鞋襪需他人幫忙。' },
      { score: 10, text: '完全獨立', description: '能自行穿脫所有衣褲、鞋襪及輔具支架，並扣好扣子。' },
    ]
  },
  {
    id: 'bowel',
    name: '9. 大便控制 (Bowels)',
    category: '生理功能',
    options: [
      { score: 0, text: '失禁', description: '經常失禁，或需他人完全代為塞劑處理/通便。' },
      { score: 5, text: '偶爾失禁', description: '每週失禁一次以下，或需他人協助塞劑、灌腸操作。' },
      { score: 10, text: '完全控制', description: '無失禁現象，能自行正常控制，或能自主管理造口灌洗。' },
    ]
  },
  {
    id: 'bladder',
    name: '10. 小便控制 (Bladder)',
    category: '生理功能',
    options: [
      { score: 0, text: '失禁', description: '經常尿失禁，或留置導尿管無法自行倒尿引流。' },
      { score: 5, text: '偶爾失禁', description: '每週失禁一次以下，或需他人協助集尿器或導尿管管路。' },
      { score: 10, text: '完全控制', description: '日夜皆能自主控制小便，或能獨立倒排尿袋且無外溢。' },
    ]
  }
];

export const IADL_ITEMS: IADLItem[] = [
  {
    id: 'phone',
    name: '1. 使用電話的能力 (Telephone)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能獨立查號、撥號並完成通話。' },
      { score: 1, text: '能撥少數熟悉電話號碼。' },
      { score: 1, text: '會接電話，但不會主動撥號。' },
      { score: 0, text: '完全不會使用電話。' }
    ]
  },
  {
    id: 'shopping',
    name: '2. 上街購物 (Shopping)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能獨立完成所有日常採購。' },
      { score: 0, text: '能獨立採買少數小件物品。' },
      { score: 0, text: '每次購物皆需他人陪同。' },
      { score: 0, text: '完全無法外出購物。' }
    ]
  },
  {
    id: 'food_prep',
    name: '3. 備餐能力 (Food Preparation)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能獨立規劃、備料並烹煮適當餐點。' },
      { score: 0, text: '在他人備好食材下，能烹煮簡易餐點。' },
      { score: 0, text: '能將現成飯菜加熱，但無法調煮完整餐點。' },
      { score: 0, text: '完全需他人備餐與端送。' }
    ]
  },
  {
    id: 'housekeeping',
    name: '4. 家務維持 (Housekeeping)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能獨立維持日常家務或僅偶爾需要粗重協助。' },
      { score: 1, text: '能完成輕度家務，如洗碗、鋪床、擦桌子。' },
      { score: 1, text: '能做簡易家務，但無法維持整潔標準。' },
      { score: 0, text: '需要他人協助所有家務。' },
      { score: 0, text: '完全無法參與任何家務。' }
    ]
  },
  {
    id: 'laundry',
    name: '5. 洗衣能力 (Laundry)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能獨立完成個人所有衣物清洗、晾乾。' },
      { score: 1, text: '能清洗小件衣物（如手帕、襪子、內褲）。' },
      { score: 0, text: '所有衣物清洗皆需他人代勞。' }
    ]
  },
  {
    id: 'transport',
    name: '6. 外出交通能力 (Mode of Transportation)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能獨立搭乘大眾運輸工具或自行駕車/騎車。' },
      { score: 1, text: '能自行搭乘計程車，但不會搭公車捷運。' },
      { score: 1, text: '在他人陪同下能搭乘大眾交通工具。' },
      { score: 0, text: '僅能在專車接送且有人陪伴下移動。' },
      { score: 0, text: '完全無法出門。' }
    ]
  },
  {
    id: 'medication',
    name: '7. 服用藥物管理 (Responsibility for Own Medication)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能自行負責在正確時間服用正確劑量藥物。' },
      { score: 0, text: '若他人預先分裝於藥盒，能自行按時服用。' },
      { score: 0, text: '完全無法自行管理或服藥，需他人按時餵藥。' }
    ]
  },
  {
    id: 'finances',
    name: '8. 財務處理能力 (Ability to Handle Finances)',
    genderApplicability: 'all',
    options: [
      { score: 1, text: '能獨立處理個人財務、記帳、上銀行及繳納帳單。' },
      { score: 1, text: '能處理日常小額金錢開銷，但重大財務需協助。' },
      { score: 0, text: '完全無法處理金錢與計算零錢。' }
    ]
  }
];

export function interpretBarthel(score: number): {
  level: string;
  badgeColor: string;
  disabilityGrade: string;
  ltcImplication: string;
  reablementFocus: string;
} {
  if (score <= 20) {
    return {
      level: '完全依賴 (0-20分)',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      disabilityGrade: '極重度失能',
      ltcImplication: '長照等級 CMS 7~8 級高照護需求，通常符合外籍看護或機構住宿式補助資格。',
      reablementFocus: '重點在於臥床併發症預防（壓瘡防範、良肢位擺位、被動關節活動度維持）與主要照護者移位省力防受傷衛教。'
    };
  }
  if (score <= 60) {
    return {
      level: '嚴重依賴 (21-60分)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      disabilityGrade: '重度失能',
      ltcImplication: '長照等級 CMS 4~6 級，高度依賴日間照顧中心、居家服務或 CA01 居家復能介入。',
      reablementFocus: '復能黃金介入期！聚焦轉移位自立、床緣坐姿平衡、輔具湯匙獨立進食、輔具輔助如廁，減輕家庭照顧負荷達40%以上。'
    };
  }
  if (score <= 90) {
    return {
      level: '中度依賴 (61-90分)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      disabilityGrade: '中度失能',
      ltcImplication: '長照等級 CMS 2~4 級，具備高度復原潛力，生活部分項目需提醒或微度協助。',
      reablementFocus: '著重沐浴防跌、單手穿衣扣鈕扣技巧、室內平地動線無障礙與步態穩定度，朝向日常生活完全自立邁進。'
    };
  }
  if (score <= 99) {
    return {
      level: '輕度依賴 (91-99分)',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      disabilityGrade: '輕度失能',
      ltcImplication: '長照等級 CMS 1~2 級，或屬於衰弱前期長輩。',
      reablementFocus: '上下樓梯耐力、戶外跨越水溝蓋/凹凸路面平衡，加強 IADL 工具性生活自理與社區活動參與。'
    };
  }
  return {
    level: '完全獨立 (100分)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    disabilityGrade: '無失能 / 正常自立',
    ltcImplication: 'ADL 完全獨立，可參與社區長照 C 級巷弄站或銀髮健身俱樂部維持活力。',
    reablementFocus: '肌力維持、認知防退化活動、預防跌倒與自主健康管理。'
  };
}

export function interpretTUG(seconds: number): {
  riskLevel: string;
  badgeColor: string;
  mobilityStatus: string;
  recommendation: string;
} {
  if (seconds < 10) {
    return {
      riskLevel: '正常行動能力 (< 10秒)',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      mobilityStatus: '自立行走良好，下肢肌力與動態平衡佳。',
      recommendation: '維持定期規律快走與下肢伸展即可。'
    };
  }
  if (seconds <= 20) {
    return {
      riskLevel: '輕微功能受限 (10-20秒)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      mobilityStatus: '行動速度稍緩，多數能獨立外出，但遇突發重心不穩反應時間拉長。',
      recommendation: '建議加強下肢股四頭肌坐站訓練與單腳站立平衡練習；外出時評估攜帶輕便手杖。'
    };
  }
  if (seconds <= 30) {
    return {
      riskLevel: '中高度跌倒風險 (20-30秒)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      mobilityStatus: '需要拐杖或助行器輔助，行走步幅變小、轉彎時步態不穩。',
      recommendation: '高度警訊！建議職能治療師進行居家防跌動線改造 (CA03) 及處方配置四腳拐或助行架。'
    };
  }
  return {
    riskLevel: '極高跌倒風險 (> 30秒)',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    mobilityStatus: '無法安全獨立行走，室內移動極易絆倒，需一人近距離攙扶或依賴輪椅。',
    recommendation: '室內移動必須全程有人看顧；建議轉介居家復能 (CA01) 強化核心重心轉移能力並評估輪椅適配。'
  };
}
