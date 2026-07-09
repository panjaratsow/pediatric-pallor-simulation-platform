import { scoreCommunication } from "./communicationScoring";
import { scoreInvestigations } from "./investigationScoring";
import { hasAnyKeyword, normalize } from "./keywordUtils";
import type {
  BleedingCase,
  BleedingScoreBreakdown,
  ExamDomainId,
  InvestigationId,
} from "./bleedingTypes";
import type { CommunicationFlags, Message } from "./types";

type HistoryDomain = {
  id: string;
  label: string;
  points: number;
  keywords: string[];
  missed: string;
};

export const bleedingHistoryDomains: HistoryDomain[] = [
  {
    id: "onset",
    label: "ถามการเริ่มอาการและระยะเวลา",
    points: 4,
    keywords: ["เริ่ม", "นาน", "กี่วัน", "กี่สัปดาห์", "กี่เดือน", "ตั้งแต่เมื่อไหร่"],
    missed: "ควรถามว่าเลือดออกเริ่มเมื่อใดและเป็นมานานเท่าไร",
  },
  {
    id: "site",
    label: "ถามตำแหน่งและรูปแบบของเลือดออก",
    points: 6,
    keywords: ["เลือดออกที่ไหน", "ตำแหน่ง", "จ้ำเลือด", "จุดเลือด", "กำเดา", "ไรฟัน", "ประจำเดือน", "ถ่ายดำ", "ปัสสาวะ", "ข้อบวม", "กล้ามเนื้อ"],
    missed: "ควรถามตำแหน่ง ลักษณะ ความถี่ และความรุนแรงของเลือดออก",
  },
  {
    id: "mucocutaneous",
    label: "ประเมิน mucocutaneous bleeding",
    points: 5,
    keywords: ["จุดเลือด", "petechiae", "จ้ำเลือด", "ecchymosis", "กำเดา", "ไรฟัน", "เหงือก", "ประจำเดือน", "เลือดหยุดยาก"],
    missed: "ควรถาม petechiae, ecchymoses, epistaxis, gum bleeding และ menorrhagia ตามวัย",
  },
  {
    id: "deep",
    label: "ประเมิน deep tissue หรือ joint bleeding",
    points: 5,
    keywords: ["ข้อบวม", "ปวดข้อ", "เข่าบวม", "ข้อเท้าบวม", "เลือดออกในข้อ", "กล้ามเนื้อบวม", "ช้ำลึก", "หลังฉีดยาแล้วบวม"],
    missed: "ควรถามข้อบวม ปวดข้อ เลือดออกในข้อ กล้ามเนื้อบวม หรือช้ำลึก",
  },
  {
    id: "trauma",
    label: "ถามเลือดออกหลัง trauma หรือหัตถการ",
    points: 4,
    keywords: ["อุบัติเหตุ", "กระแทก", "ล้ม", "ถอนฟัน", "ผ่าตัด", "ขลิบ", "ฉีดยา", "วัคซีน", "แผล", "เลือดหยุดยาก"],
    missed: "ควรถามเลือดออกหลังอุบัติเหตุ ถอนฟัน ผ่าตัด ขลิบ ฉีดยา หรือแผลเล็ก",
  },
  {
    id: "infection",
    label: "ถามการติดเชื้อหรืออาการป่วยก่อนหน้า",
    points: 4,
    keywords: ["ไข้", "หวัด", "ไอ", "เจ็บคอ", "ท้องเสีย", "ติดเชื้อ", "ป่วยก่อน", "หลังเป็นหวัด"],
    missed: "ควรถามไข้ หวัด หรือการติดเชื้อก่อนเริ่มมีเลือดออก",
  },
  {
    id: "medication",
    label: "ทบทวนยาและผลิตภัณฑ์ที่มีผลต่อการห้ามเลือด",
    points: 3,
    keywords: ["ยา", "แอสไพริน", "aspirin", "nsaid", "ibuprofen", "ยาลดไข้", "ยาแก้อักเสบ", "สมุนไพร", "อาหารเสริม"],
    missed: "ควรถาม aspirin, NSAID, ยาแก้อักเสบ สมุนไพร และอาหารเสริม",
  },
  {
    id: "redflags",
    label: "คัดกรอง systemic red flags",
    points: 5,
    keywords: ["ซีด", "ไข้เรื้อรัง", "น้ำหนักลด", "เบื่ออาหาร", "ปวดกระดูก", "ต่อมน้ำเหลือง", "ตับ", "ม้าม", "ท้องโต", "เหงื่อกลางคืน"],
    missed: "ควรถามซีด ไข้เรื้อรัง น้ำหนักลด ปวดกระดูก ต่อมน้ำเหลืองโต และท้องโต",
  },
  {
    id: "family",
    label: "ถามประวัติเลือดออกในครอบครัว",
    points: 4,
    keywords: ["ครอบครัว", "เลือดออกง่าย", "เลือดหยุดยาก", "ผู้ชายในครอบครัว", "น้า", "ลุง", "พี่น้อง", "hemophilia", "ฮีโมฟีเลีย", "von willebrand", "ประจำเดือนมากในครอบครัว"],
    missed: "ควรถามญาติที่เลือดออกง่าย ผู้ชายฝ่ายแม่ และประจำเดือนมากในครอบครัว",
  },
];

export const examDomains: {
  id: ExamDomainId;
  label: string;
  points: number;
  missed: string;
}[] = [
  { id: "general", label: "ลักษณะทั่วไปและสัญญาณชีพ", points: 2, missed: "ควรประเมินลักษณะทั่วไปและสัญญาณชีพ" },
  { id: "skin", label: "ผิวหนัง: petechiae และ ecchymoses", points: 2, missed: "ควรตรวจผิวหนังหา petechiae และ ecchymoses" },
  { id: "mucosa", label: "เยื่อบุและตำแหน่งเลือดออก", points: 2, missed: "ควรตรวจช่องปาก เหงือก จมูก และเยื่อบุ" },
  { id: "organ", label: "ต่อมน้ำเหลือง ตับ และม้าม", points: 2, missed: "ควรตรวจต่อมน้ำเหลือง ตับ และม้ามเพื่อค้นหา red flags" },
  { id: "deep", label: "ข้อและกล้ามเนื้อ", points: 2, missed: "ควรตรวจข้อและกล้ามเนื้อเพื่อค้นหา deep bleeding" },
];

function scoreProblem(
  currentCase: BleedingCase,
  problemList: string,
  differential: string,
  finalImpression: string,
) {
  const combined = `${problemList} ${differential}`;
  const positiveHits = countKeywordHits(problemList, currentCase.problemScoring.positiveKeywords);
  const negativeHits = countKeywordHits(problemList, currentCase.problemScoring.negativeKeywords);
  const differentialHits = countKeywordHits(
    differential,
    currentCase.problemScoring.differentialKeywords,
  );
  const sections: { label: string; points: number; earned: number; advice: string }[] = [
    {
      label: "จำแนก bleeding pattern ได้",
      points: 5,
      earned: hasAnyKeyword(combined, currentCase.problemScoring.patternKeywords) ? 5 : 0,
      advice: "ควรระบุให้ชัดว่าเป็น mucocutaneous bleeding หรือ deep/joint bleeding",
    },
    {
      label: "สรุป pertinent positives สำคัญ",
      points: 5,
      earned: positiveHits >= 3 ? 5 : positiveHits === 2 ? 3 : positiveHits === 1 ? 1 : 0,
      advice: "ควรใส่อาการสำคัญ ระยะเวลา และข้อมูลสนับสนุนโรคใน problem list",
    },
    {
      label: "สรุป pertinent negatives สำคัญ",
      points: 4,
      earned: negativeHits >= 2 ? 4 : negativeHits === 1 ? 2 : 0,
      advice: "ควรใส่ pertinent negatives ที่ช่วยแยก platelet disorder, factor deficiency และ malignancy",
    },
    {
      label: "เสนอ differential diagnosis ที่เหมาะสม",
      points: 4,
      earned: differentialHits >= 2 ? 4 : differentialHits === 1 ? 2 : 0,
      advice: "ควรเสนอ differential diagnosis มากกว่าหนึ่งกลุ่มและเชื่อมกับ bleeding pattern",
    },
    {
      label: "สรุป final impression สอดคล้องกับเคส",
      points: 2,
      earned: hasAnyKeyword(finalImpression, currentCase.problemScoring.impressionKeywords) ? 2 : 0,
      advice: "ควรระบุ final impression ที่สอดคล้องกับข้อมูลสนับสนุน",
    },
  ];

  return {
    score: sections.reduce((total, item) => total + item.earned, 0),
    strengths: sections
      .filter((item) => item.earned > 0)
      .map((item) => `${item.label} (+${item.earned})`),
    advice: sections
      .filter((item) => item.earned < item.points)
      .map((item) =>
        item.earned > 0
          ? `${item.advice} ขณะนี้ได้ ${item.earned}/${item.points} คะแนน`
          : item.advice,
      ),
  };
}

function countKeywordHits(text: string, keywords: string[]): number {
  const normalizedText = normalize(text);
  return new Set(
    keywords.filter((keyword) => normalizedText.includes(normalize(keyword))),
  ).size;
}

export function calculateBleedingScore(
  currentCase: BleedingCase,
  messages: Message[],
  trackedDomainIds: Set<string>,
  communicationFlags: CommunicationFlags,
  selectedExamDomains: Set<ExamDomainId>,
  selectedInvestigations: Set<InvestigationId>,
  problemList: string,
  differential: string,
  finalImpression: string,
): BleedingScoreBreakdown {
  const studentText = messages
    .filter((message) => message.speaker === "student")
    .map((message) => message.text)
    .join(" ");
  const detectedDomains = new Set(
    bleedingHistoryDomains
      .filter((domain) => hasAnyKeyword(studentText, domain.keywords))
      .map((domain) => domain.id),
  );
  trackedDomainIds.forEach((domainId) => detectedDomains.add(domainId));

  const historyHits = bleedingHistoryDomains.filter((domain) => detectedDomains.has(domain.id));
  const historyScore = historyHits.reduce((total, domain) => total + domain.points, 0);
  const examHits = examDomains.filter((domain) => selectedExamDomains.has(domain.id));
  const examScore = examHits.reduce((total, domain) => total + domain.points, 0);
  const communication = scoreCommunication(communicationFlags);
  const investigation = scoreInvestigations(currentCase, selectedInvestigations);
  const problem = scoreProblem(currentCase, problemList, differential, finalImpression);
  const totalScore =
    communication.communicationScore +
    historyScore +
    examScore +
    investigation.score +
    problem.score;

  return {
    communicationScore: communication.communicationScore,
    historyScore,
    examScore,
    investigationScore: investigation.score,
    problemScore: problem.score,
    totalScore,
    interpretation: interpretBleedingScore(totalScore),
    communicationStrengths: communication.communicationStrengths,
    communicationMisses: communication.communicationMisses,
    historyStrengths: historyHits.map((domain) => `${domain.label} (+${domain.points})`),
    missedHistory: bleedingHistoryDomains
      .filter((domain) => !detectedDomains.has(domain.id))
      .map((domain) => domain.missed),
    examStrengths: examHits.map((domain) => `${domain.label} (+${domain.points})`),
    missedExam: examDomains
      .filter((domain) => !selectedExamDomains.has(domain.id))
      .map((domain) => domain.missed),
    investigationStrengths: investigation.strengths,
    investigationAdvice: investigation.advice,
    problemStrengths: problem.strengths,
    problemAdvice: problem.advice,
  };
}

function interpretBleedingScore(total: number): string {
  if (total >= 85) return "ดีมาก ซักประวัติ ตรวจร่างกาย เลือกส่งตรวจ และวางแผนวินิจฉัยได้ครอบคลุม";
  if (total >= 70) return "ดี มี clinical reasoning ที่เหมาะสม แต่ยังขาดบางประเด็นสำคัญ";
  if (total >= 50) return "พอใช้ ควรฝึกซักประวัติและเลือกส่งตรวจให้เป็นระบบมากขึ้น";
  return "ควรทบทวนแนวทางประเมินภาวะเลือดออกผิดปกติในเด็ก และฝึกแยก bleeding pattern เพิ่มเติม";
}
