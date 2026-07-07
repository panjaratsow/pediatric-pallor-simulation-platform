import { scoreCommunication } from "./communicationScoring";
import { hasAnyKeyword } from "./keywordUtils";
import type { CommunicationFlags, Message, ScoreBreakdown, SimulationCase } from "./types";

type GeneralDomain = {
  id: string;
  label: string;
  points: number;
  keywords: string[];
  strength: string;
  missed: string;
};

export const generalDomains: GeneralDomain[] = [
  {
    id: "duration",
    label: "ระยะเวลาเริ่มซีด",
    points: 7,
    keywords: ["นาน", "กี่วัน", "กี่สัปดาห์", "กี่เดือน", "เริ่ม", "ตั้งแต่เมื่อไหร่", "ซีดมานาน"],
    strength: "ซักประวัติระยะเวลาของอาการซีดได้ดี",
    missed: "ควรถามว่าเริ่มซีดตั้งแต่เมื่อไหร่ หรือซีดมานานเท่าไร",
  },
  {
    id: "progression",
    label: "การดำเนินโรคและความรุนแรง",
    points: 5,
    keywords: ["มากขึ้น", "แย่ลง", "ซีดขึ้น", "รุนแรง", "เป็นมาก", "ค่อย ๆ", "เฉียบพลัน"],
    strength: "ถามการดำเนินโรคและความรุนแรงของอาการซีดได้เหมาะสม",
    missed: "ควรถามว่าอาการซีดค่อย ๆ เป็นมากขึ้นหรือเกิดแบบเฉียบพลัน",
  },
  {
    id: "fatigue",
    label: "อ่อนเพลียและกิจกรรม",
    points: 6,
    keywords: ["เหนื่อย", "อ่อนเพลีย", "เพลีย", "ไม่มีแรง", "เล่นได้น้อย", "กิจกรรม", "ซึม"],
    strength: "ถามอาการเพลีย เหนื่อยง่าย หรือกิจกรรมที่ลดลงได้ดี",
    missed: "ควรถามอ่อนเพลีย เหนื่อยง่าย เล่นได้น้อย หรือซึมลง",
  },
  {
    id: "bleeding",
    label: "เลือดออกผิดปกติ",
    points: 7,
    keywords: ["เลือดออก", "เลือดกำเดา", "เลือดออกตามไรฟัน", "จ้ำเลือด", "จุดเลือด", "ฟกช้ำ", "ถ่ายดำ", "ถ่ายเลือด", "อุจจาระมีเลือด", "ปัสสาวะเป็นเลือด"],
    strength: "ถามประวัติเลือดออกผิดปกติได้ครอบคลุม",
    missed: "ควรถามเลือดกำเดา เลือดออกตามไรฟัน จ้ำเลือด จุดเลือด ถ่ายดำ หรือถ่ายเป็นเลือด",
  },
  {
    id: "hemolysis",
    label: "ประวัติ hemolysis",
    points: 8,
    keywords: ["ตัวเหลือง", "ตาเหลือง", "ดีซ่าน", "ปัสสาวะสีเข้ม", "ปัสสาวะดำ", "ปัสสาวะสีชา", "ปัสสาวะแดง", "เหลืองแรกเกิด", "ซีดเป็น ๆ หาย ๆ"],
    strength: "ถามอาการที่ช่วยประเมิน hemolysis ได้เหมาะสม",
    missed: "ควรถามอาการตัวเหลือง ตาเหลือง ปัสสาวะสีเข้ม และตัวเหลืองแรกเกิด",
  },
  {
    id: "fever",
    label: "ไข้และการติดเชื้อ",
    points: 5,
    keywords: ["ไข้", "ติดเชื้อ", "ไอ", "หวัด", "เจ็บคอ", "ท้องเสีย", "ป่วยก่อนหน้า"],
    strength: "ถามไข้ การติดเชื้อ หรืออาการป่วยก่อนหน้าได้ดี",
    missed: "ควรถามไข้ อาการติดเชื้อ ไอ เจ็บคอ ท้องเสีย หรือการป่วยก่อนหน้า",
  },
  {
    id: "malignancy",
    label: "Red flags ของ malignancy",
    points: 7,
    keywords: ["น้ำหนักลด", "เบื่ออาหาร", "ปวดกระดูก", "ปวดขา", "ปวดกลางคืน", "ต่อมน้ำเหลือง", "ก้อน", "ท้องโต", "ตับ", "ม้าม", "เหงื่อกลางคืน"],
    strength: "ถาม red flags เช่น น้ำหนักลด ปวดกระดูก ต่อมน้ำเหลือง หรือท้องโตได้เหมาะสม",
    missed: "ควรถาม red flags เช่น ไข้ น้ำหนักลด ปวดกระดูก ต่อมน้ำเหลืองโต และท้องโต",
  },
  {
    id: "diet",
    label: "ประวัติอาหาร",
    points: 6,
    keywords: ["กินอะไร", "อาหาร", "เนื้อ", "หมู", "ไก่", "ปลา", "ตับ", "เครื่องใน", "ไข่", "ไข่แดง", "ไข่ขาว", "นม", "uht", "เลือกกิน", "pica", "กินดิน", "กินน้ำแข็ง"],
    strength: "ถามประวัติอาหารได้ครอบคลุม",
    missed: "ควรถามประวัติอาหารที่มีธาตุเหล็ก เช่น เนื้อสัตว์ เครื่องใน ไข่แดง และปริมาณนม",
  },
  {
    id: "past",
    label: "โรคเดิมและการตรวจเดิม",
    points: 4,
    keywords: ["โรคประจำตัว", "เคยเจาะเลือด", "เคยได้เลือด", "เคยได้รับเลือด", "นอนโรงพยาบาล", "กินยา", "ยาเรื้อรัง"],
    strength: "ถามโรคประจำตัว ประวัติเคยตรวจเลือด หรือเคยได้รับเลือดได้ดี",
    missed: "ควรถามโรคประจำตัว ประวัติเคยเจาะเลือด เคยได้รับเลือด นอนโรงพยาบาล หรือยาประจำ",
  },
];

export function detectGeneralDomains(messages: Message[]): Set<string> {
  const askedText = messages
    .filter((message) => message.speaker === "student")
    .map((message) => message.text)
    .join(" ");
  return new Set(generalDomains.filter((domain) => hasAnyKeyword(askedText, domain.keywords)).map((domain) => domain.id));
}

export function calculateScore(
  currentCase: SimulationCase,
  messages: Message[],
  trackedDomainIds: Set<string>,
  communicationFlags: CommunicationFlags,
  problemList: string,
): ScoreBreakdown {
  const detectedDomains = detectGeneralDomains(messages);
  trackedDomainIds.forEach((domainId) => detectedDomains.add(domainId));

  const generalHits = generalDomains.filter((domain) => detectedDomains.has(domain.id));
  const generalScore = generalHits.reduce((sum, domain) => sum + domain.points, 0);

  const questionText = messages
    .filter((message) => message.speaker === "student")
    .map((message) => message.text)
    .join(" ");

  const caseHits = currentCase.caseSpecificRubric.filter((item) => hasAnyKeyword(questionText, item.keywords));
  const caseSpecificScore = caseHits.reduce((sum, item) => sum + item.points, 0);

  const problemHits = currentCase.problemRubric.filter((item) => hasAnyKeyword(problemList, item.keywords));
  const problemScore = problemHits.reduce((sum, item) => sum + item.points, 0);
  const communicationResult = scoreCommunication(communicationFlags);

  const totalScore = communicationResult.communicationScore + generalScore + caseSpecificScore + problemScore;
  const missedGeneral = generalDomains.filter((domain) => !detectedDomains.has(domain.id)).map((domain) => domain.missed);
  const missedCase = currentCase.caseSpecificRubric.filter((item) => !caseHits.includes(item)).map((item) => item.missedPrompt);

  return {
    communicationScore: communicationResult.communicationScore,
    generalScore,
    caseSpecificScore,
    problemScore,
    totalScore,
    communicationStrengths: communicationResult.communicationStrengths,
    communicationMisses: communicationResult.communicationMisses,
    strengths: [...generalHits.map((domain) => domain.strength), ...caseHits.map((item) => `ถาม${item.label.replace("ถาม", "")}ได้ตรงกับเคสนี้`)].slice(0, 8),
    missedQuestions: [...missedCase, ...missedGeneral].slice(0, 10),
    generalHits: generalHits.map((domain) => domain.label),
    caseHits: caseHits.map((item) => item.label),
    problemHits: problemHits.map((item) => item.label),
    interpretation: interpretScore(totalScore),
  };
}

function interpretScore(total: number): string {
  if (total >= 85) return "ดีมาก ซักประวัติได้ครอบคลุม มี clinical reasoning และ communication skill ดี";
  if (total >= 70) return "ดี ซักประวัติได้หลายประเด็นสำคัญ แต่ยังขาดบาง domain";
  if (total >= 50) return "พอใช้ ควรซักประวัติให้เป็นระบบมากขึ้น และควรปรับการสื่อสารช่วงเริ่มต้น";
  return "ควรฝึกซักประวัติภาวะซีดอย่างเป็นระบบเพิ่มเติม รวมถึงการเปิดการสนทนาและยืนยันตัวผู้ป่วย";
}
