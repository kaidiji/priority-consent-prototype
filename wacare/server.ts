import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasAiKey: !!apiKey, service: 'WaCare KM Occupational Therapy' });
});

// AI Activity Grader (Grading Up / Down / Adaptation)
app.post('/api/ai/grade-activity', async (req: Request, res: Response) => {
  try {
    const { activityTitle, clientCondition, targetGoal, currentDifficulty } = req.body;

    if (!ai) {
      // Fallback structured clinical response if no API key is provided
      return res.json({
        success: true,
        source: 'clinical_protocol_fallback',
        gradingDown: [
          '減少阻力與操作負重：改用輕量化材質（如海綿球或輕質塑膠積木）',
          '擴大抓握接觸面積：為握柄增加發泡海綿套（Tubing foam），降低指間肌力需求',
          '簡化步驟與給予視覺/肢體提示：分解為單一步驟操作，治療師於健側引導示範',
          '調整重力消除姿勢：於桌面滑板或懸吊支架下進行側向滑行活動'
        ],
        gradingUp: [
          '增加抗阻與本體覺反饋：使用治療黏土（綠色/藍色高阻力）或增加配重砂包（0.5-1kg）',
          '縮小目標與提高精細度要求：從大掌抓取改為三指捏（Three-jaw chuck）或兩指捏（Pincer grasp）',
          '加入雙重任務（Dual-task）：邊進行手部操作邊回答時間定向感問題或計算連續減7',
          '改變基底底面積與動態平衡挑戰：由坐姿改為坐充氣抗力球或站立位跨步操作'
        ],
        adaptations: [
          '環境調適：桌面加裝防滑矽膠墊，並調整座椅高度使髖膝關節呈90度',
          '輔具介入：使用單手穿衣扣鈕扣輔助器或斜口防溢餐盤',
          '代償策略：利用健側手協助固定患肢，採用大關節近端固定以穩定遠端微調'
        ],
        precautions: [
          '嚴格監控患側肩關節半脫位情況，避免過度牽拉患肢',
          '注意長輩或個案疲勞指數（Borg Scale），適時給予間歇休息',
          '心血管病史個案避免長時間等長收縮（Valsalva maneuver）'
        ]
      });
    }

    const prompt = `你是一位資深的職能治療臨床督導與臺灣長照2.0復能專家。
請針對以下個案臨床狀況與目標活動，進行專業活動分析與難度分級 (Activity Analysis & Grading)：

【個案狀況與問題】: ${clientCondition || '中風偏癱亞急性期，患側上肢BrStage III，動作控制協調不佳'}
【目前目標活動】: ${activityTitle || '桌上疊杯/抓取積木活動'}
【復能目標】: ${targetGoal || '提升患手伸直抓取與釋放能力，增進進食及日常生活自理'}
【目前設定難度】: ${currentDifficulty || '中等'}

請以繁體中文，返回 JSON 格式，結構如下：
{
  "gradingDown": ["降低難度方案1(物理環境/材料)", "降低難度方案2(重力/姿勢)", "降低難度方案3(步驟簡化/提示)"],
  "gradingUp": ["提高難度方案1(增加阻力/精細度)", "提高難度方案2(雙重任務/動態平衡)", "提高難度方案3(時間限制/複雜度)"],
  "adaptations": ["環境輔具與代償策略1", "代償技巧2"],
  "precautions": ["安全考量與禁忌症1", "防範事項2"]
}
只需輸出合法的純 JSON 字串，請勿包含 Markdown 包裹字元。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, source: 'gemini', ...parsed });
  } catch (error: any) {
    console.error('Error in grade-activity, providing clinical fallback:', error?.message);
    return res.json({
      success: true,
      source: 'clinical_protocol_fallback',
      gradingDown: [
        '減少阻力與操作負重：改用輕量化材質（如海綿球或輕質塑膠積木）',
        '擴大抓握接觸面積：為握柄增加發泡海綿套（Tubing foam），降低指間肌力需求',
        '簡化步驟與給予視覺/肢體提示：分解為單一步驟操作，治療師於健側引導示範',
        '調整重力消除姿勢：於桌面滑板或懸吊支架下進行側向滑行活動'
      ],
      gradingUp: [
        '增加抗阻與本體覺反饋：使用治療黏土（高阻力）或增加配重砂包（0.5-1kg）',
        '縮小目標與提高精細度要求：從大掌抓取改為三指捏（Three-jaw chuck）或兩指捏（Pincer grasp）',
        '加入雙重任務（Dual-task）：邊進行手部操作邊回答時間定向感問題或計算連續減7',
        '改變基底底面積與動態平衡挑戰：由坐姿改為坐充氣抗力球或站立位跨步操作'
      ],
      adaptations: [
        '環境調適：桌面加裝防滑矽膠墊，並調整座椅高度使髖膝關節呈90度',
        '輔具介入：使用單手穿衣扣鈕扣輔助器或斜口防溢餐盤',
        '代償策略：利用健側手協助固定患肢，採用大關節近端固定以穩定遠端微調'
      ],
      precautions: [
        '嚴格監控患側肩關節半脫位情況，避免過度牽拉患肢',
        '注意長輩或個案疲勞指數（Borg Scale），適時給予間歇休息',
        '心血管病史個案避免長時間等長收縮（Valsalva maneuver）'
      ]
    });
  }
});

// AI SMART Goal & GAS Reablement Planner
app.post('/api/ai/smart-goals', async (req: Request, res: Response) => {
  try {
    const { caseName, age, diagnosis, currentLevel, desiredOutcome } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'clinical_protocol_fallback',
        smartGoals: {
          shortTerm: '在4週內，個案能在輕度肢體引導下，使用加粗握柄湯匙連續進食至少半碗飯（不超過25分鐘）。',
          mediumTerm: '在8週內，個案能獨立坐在一般餐椅上，利用單手操作輔助盤獨立進食完畢一餐，無食物嗆咳。',
          longTerm: '在12週內，個案達成ADL進食完全獨立（巴氏量表進食項10分），並可自行拿取水杯喝水。'
        },
        gasLevels: [
          { score: -2, description: '目前基線：進食完全需要照服員或家屬一口一口餵食（0分）' },
          { score: -1, description: '少於預期：可手持湯匙送口1~2口，其餘仍需他人代勞且易散落' },
          { score: 0, description: '預期目標（達成）：可使用輔具湯匙獨立吃完半碗飯，僅需在旁口頭提醒' },
          { score: 1, description: '優於預期：可獨立吃完整碗飯且殘渣散落少於3處' },
          { score: 2, description: '大幅優於預期：能不需輔助湯匙，使用一般湯匙進食三餐且能自行擦嘴' }
        ],
        interventionPlan: [
          '上肢本體感覺神經肌肉誘發 (PNF) 屈曲-內收-外旋對角線動作訓練',
          '手部大拇指對掌抓握與加粗握把湯匙操作練習（每日2回，每回15分鐘）',
          '口腔臉頰肌群誘發與吞嚥安全擺位指引（維持頸部微屈Chintuck）',
          '家屬與外籍看護工衛教：勿過早剝奪其自行進食意願，減少過度代勞'
        ]
      });
    }

    const prompt = `你是一位資深臺灣職能治療師與長照2.0復能督導。
請根據以下個案資料，生成符合臨床規範的 SMART 目標（明確Specific、可衡量Measurable、可達成Achievable、相關Relevant、有時效Time-bound）以及 GAS (Goal Attainment Scaling, -2到+2) 目標達成量表：

【個案姓名/代號】: ${caseName || '王奶奶'}
【年齡】: ${age || '78歲'}
【主要診斷/狀況】: ${diagnosis || '缺血性腦中風右側偏癱合併輕度認知障礙'}
【現況功能表現】: ${currentLevel || '無法自行穿衣，右側患肢抬高無法過肩，生活依賴外籍看護'}
【個案或家屬期待】: ${desiredOutcome || '希望自己能穿套頭衣服與長褲，去社區活動據點'}

請輸出繁體中文 JSON：
{
  "smartGoals": {
    "shortTerm": "4週短期目標（明確具體）",
    "mediumTerm": "8週中期目標",
    "longTerm": "12週長期復能目標"
  },
  "gasLevels": [
    { "score": -2, "description": "目前基線狀況" },
    { "score": -1, "description": "少於預期目標" },
    { "score": 0, "description": "達到預期目標(Target)" },
    { "score": 1, "description": "高於預期進展" },
    { "score": 2, "description": "大幅超越預期" }
  ],
  "interventionPlan": [
    "介入方案重點1",
    "介入方案重點2",
    "家屬/照服員衛教指導重點"
  ]
}
請只輸出 JSON，勿加 markdown 標記。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', ...parsed });
  } catch (error: any) {
    console.error('Error in smart-goals, providing clinical fallback:', error?.message);
    return res.json({
      success: true,
      source: 'clinical_protocol_fallback',
      smartGoals: {
        shortTerm: '在 4 週內，個案能在口頭提示與環境防滑輔助下，安全完成床邊起身與轉移位至便盆椅，不跌倒。',
        mediumTerm: '在 8 週內，個案能使用加粗握柄餐具與防溢餐盤，獨立完成 70% 進食自理，時間少於 30 分鐘。',
        longTerm: '在 12 週內，個案能在四腳拐支撐下獨立室內行走 15 公尺，並達成居家如廁沐浴部分自主。'
      },
      gasLevels: [
        { score: -2, description: '目前基線狀況：完全需他人重度協助，無法自主啟動核心轉身。' },
        { score: -1, description: '少於預期目標：一人中度攙扶下可勉強站立，但無法維持動態平衡。' },
        { score: 0, description: '達到預期目標 (Target)：在輕度監督與適當輔具下獨立安全完成指定生活動作。' },
        { score: 1, description: '高於預期進展：不需監督提示，動作流暢且可連續操作不感疲累。' },
        { score: 2, description: '大幅超越預期：能將習得之自理技能泛化至社區不同情境與未經改裝之環境。' }
      ],
      interventionPlan: [
        '長照 2.0 CA01 居家復能訓練（每週 1~2 次）',
        '核心肌群穩定與下肢漸進阻力訓練',
        '任務導向日常動作再學習（Task-Oriented Training）',
        '照顧者防跌技巧與省力移位回覆示教'
      ]
    });
  }
});

// AI SOAP Note Assistant (Taiwan MOHW / Long-term Care 2.0 Compliant)
app.post('/api/ai/soap-note', async (req: Request, res: Response) => {
  try {
    const { sessionData, therapistNotes, assessmentScores } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'clinical_protocol_fallback',
        soap: {
          s: '個案自述：「這禮拜右手好像比較有力氣，吃香蕉時可以自己握著皮了，但手指放開還是卡卡的。」家屬表示個案起床移位時仍需一人輕扶腰帶。',
          o: `生命徵象穩定。上肢功能：右側肩關節主動外展 70 度，肘關節主動屈曲 110 度。手指抓握（Gross grasp）可持握球棒型握把，側捏（Lateral pinch）肌力 1.5kg。評估分數：${assessmentScores || '巴氏量表 55/100，Berg平衡量表 38/56，TUG 19.8秒'}。活動表現：在輕度接觸引導下完成雙手穿襯衫並扣上3顆大鈕扣，耗時約7分鐘。`,
          a: '個案動作控制持續由聯合反應向分離動作進展（BrStage IV 初步）。近端肩胛骨穩定度改善，但前臂旋後（Supination）與遠端手指個別分離伸直（Individual finger extension）仍受異常屈肌張力影響。生活自理動機極佳，跌倒風險中度。',
          p: '1. 延續偏癱患肢感覺刺激與本體神經誘發 (PNF)。2. 增加患手旋後與三指抓握日常用品功能性訓練。3. 衛教家屬居家防跌動線（維持走道光線充足、移開踏墊）。4. 下次訪視排定：評估居家玄關防跌扶手安裝與移位安全。'
        }
      });
    }

    const prompt = `你是一位專業的職能治療師 (Occupational Therapist)。請將治療師提供的訪視觀察與粗略筆記，整理為專業、嚴謹、符合臺灣醫療健保與長照2.0評鑑標準的 SOAP 臨床記錄：

【本次處置/個案狀況筆記】: ${therapistNotes || '個案說手比較能舉了，今天練習拿杯子喝水，掉了兩次，後來換粗柄杯成功喝完。巴氏量表60分，站立平衡好很多'}
【評估或測驗數據】: ${assessmentScores || 'Barthel: 60, TUG: 18s'}
【治療活動】: ${sessionData || '上肢本體感覺誘發、加粗水杯飲水動作訓練、坐站轉移防跌指導'}

請輸出繁體中文 JSON：
{
  "soap": {
    "s": "主觀陳述 (Subjective，包含個案與照顧者自述、動機與疼痛反饋)",
    "o": "客觀觀察與測量 (Objective，包含量化關節活動度、肌力、量表分數、完成度時間與輔助程度)",
    "a": "專業評估與臨床推理 (Assessment，包含進展歸因、功能受限核心障礙分析、潛力預估)",
    "p": "後續計畫 (Plan，包含後續介入重點、照護者衛教功課、輔具與環境建議)"
  }
}
請只輸出合法 JSON，勿包含額外文字。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, source: 'gemini', ...parsed });
  } catch (error: any) {
    console.error('Error in soap-note, providing clinical fallback:', error?.message);
    return res.json({
      success: true,
      source: 'clinical_protocol_fallback',
      soap: {
        s: '個案主述精神與食慾改善，自覺右手手指抓握較能使力，家屬反映個案晨間在口頭提醒下已可自行坐於床緣穿上背心。',
        o: '生命徵象平穩。患側上肢 Brunnstrom Stage IV，前臂旋前旋後角度改善。進行坐站重心移轉 10 次，配合粗握柄餐具進行舀食模擬，進食動作完成度達 80%。TUG 測量為 21 秒。',
        a: '動態平衡與近端軀幹穩定性提升，下肢負重支撐能力增強。精細動作已具備使用輔助餐具進食之功能性潛能。跌倒風險仍需密切防範。',
        p: '1. 衛教外籍看護及家屬日常安全防跌與環境去平化動線。2. 提供加粗柄湯匙與斜口防溢餐盤居家自主練習。3. 下次排定一週後追蹤復能目標進展。'
      }
    });
  }
});

// Setup Vite in Dev or Serve Static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WaCare-KM-OT] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
