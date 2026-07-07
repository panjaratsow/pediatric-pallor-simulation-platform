import type { CommunicationFlags } from "./types";
import { hasAnyKeyword } from "./keywordUtils";

export const initialCommunicationFlags: CommunicationFlags = {
  greeted: false,
  introducedSelf: false,
  askedPermission: false,
  confirmedChildIdentity: false,
  confirmedInformantIdentity: false,
};

const communicationKeywordGroups: Record<keyof CommunicationFlags, string[]> = {
  greeted: ["สวัสดี", "หวัดดี"],
  introducedSelf: ["ผมเป็น", "ดิฉันเป็น", "หนูเป็น", "นักศึกษาแพทย์", "ผมเป็นแพทย์", "ดิฉันเป็นแพทย์", "เป็นหมอ"],
  askedPermission: ["ขออนุญาต", "ขอซักประวัติ", "ขอถามประวัติ", "ขอคุยด้วย", "อนุญาตให้ซักประวัติ"],
  confirmedChildIdentity: ["น้องชื่อ", "ลูกชื่อ", "ผู้ป่วยชื่อ", "ชื่อ-นามสกุล", "ชื่อผู้ป่วย", "อายุ", "กี่ขวบ", "เพศ", "เด็กชาย", "เด็กหญิง"],
  confirmedInformantIdentity: ["คุณแม่ชื่อ", "แม่ชื่อ", "ผู้ให้ประวัติ", "ผู้ปกครอง", "เป็นอะไรกับผู้ป่วย", "เกี่ยวข้องอย่างไร", "ใครพามา", "มากับใคร"],
};

const feedbackCopy: Record<keyof CommunicationFlags, { positive: string; missed: string }> = {
  greeted: {
    positive: "ทักทายผู้ป่วย/ผู้ปกครองได้เหมาะสม",
    missed: "ควรเริ่มต้นด้วยการทักทายผู้ป่วยหรือผู้ปกครอง",
  },
  introducedSelf: {
    positive: "มีการแนะนำตัวก่อนซักประวัติ",
    missed: "ควรแนะนำตัว เช่น 'ผม/ดิฉันเป็นนักศึกษาแพทย์ ขออนุญาตซักประวัติ'",
  },
  askedPermission: {
    positive: "ขออนุญาตก่อนเริ่มซักประวัติได้ดี",
    missed: "ควรขออนุญาตก่อนเริ่มซักประวัติ",
  },
  confirmedChildIdentity: {
    positive: "มีการยืนยันข้อมูลผู้ป่วย เช่น ชื่อ อายุ หรือเพศ",
    missed: "ควรถามชื่อ-นามสกุล อายุ หรือเพศของผู้ป่วย เพื่อยืนยันตัวตนก่อนซักประวัติ",
  },
  confirmedInformantIdentity: {
    positive: "มีการยืนยันผู้ให้ประวัติและความสัมพันธ์กับผู้ป่วย",
    missed: "ควรถามว่าผู้ให้ประวัติเป็นใครและเกี่ยวข้องอย่างไรกับผู้ป่วย",
  },
};

export function updateCommunicationFlags(question: string, currentFlags: CommunicationFlags): CommunicationFlags {
  return {
    greeted: currentFlags.greeted || hasAnyKeyword(question, communicationKeywordGroups.greeted),
    introducedSelf: currentFlags.introducedSelf || hasAnyKeyword(question, communicationKeywordGroups.introducedSelf),
    askedPermission: currentFlags.askedPermission || hasAnyKeyword(question, communicationKeywordGroups.askedPermission),
    confirmedChildIdentity: currentFlags.confirmedChildIdentity || hasAnyKeyword(question, communicationKeywordGroups.confirmedChildIdentity),
    confirmedInformantIdentity: currentFlags.confirmedInformantIdentity || hasAnyKeyword(question, communicationKeywordGroups.confirmedInformantIdentity),
  };
}

export function scoreCommunication(flags: CommunicationFlags): {
  communicationScore: number;
  communicationStrengths: string[];
  communicationMisses: string[];
} {
  const keys = Object.keys(flags) as (keyof CommunicationFlags)[];
  const communicationScore = keys.reduce((sum, key) => sum + (flags[key] ? 2 : 0), 0);
  return {
    communicationScore,
    communicationStrengths: keys.filter((key) => flags[key]).map((key) => feedbackCopy[key].positive),
    communicationMisses: keys.filter((key) => !flags[key]).map((key) => feedbackCopy[key].missed),
  };
}
