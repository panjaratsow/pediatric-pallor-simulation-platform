import { updateCommunicationFlags } from "./communicationScoring";
import { hasAnyKeyword } from "./keywordUtils";
import type { BleedingCase, BleedingResponseResult } from "./bleedingTypes";
import type { CommunicationFlags } from "./types";

const greetingKeywords = ["สวัสดี", "หวัดดี"];
const introductionKeywords = [
  "ผมเป็นนักศึกษาแพทย์",
  "หนูเป็นนักศึกษาแพทย์",
  "ดิฉันเป็นนักศึกษาแพทย์",
  "ผมเป็นหมอ",
  "ดิฉันเป็นหมอ",
  "นักศึกษาแพทย์",
];
const permissionKeywords = ["ขออนุญาตซักประวัติ", "ขอซักประวัติ", "ขอถามประวัติ", "ขอคุยด้วย", "อนุญาต"];
const childNameKeywords = ["น้องชื่อ", "ลูกชื่อ", "ผู้ป่วยชื่อ", "ชื่ออะไร", "ชื่อ-นามสกุล"];
const parentNameKeywords = ["คุณแม่ชื่อ", "คุณพ่อชื่อ", "ผู้ปกครองชื่อ", "ผู้ให้ประวัติชื่อ", "แม่ชื่อ", "พ่อชื่อ"];
const ageKeywords = ["อายุเท่าไหร่", "น้องอายุ", "ลูกอายุ", "ผู้ป่วยอายุ", "กี่ขวบ", "กี่ปี"];
const sexKeywords = ["เพศอะไร", "ผู้ชายหรือผู้หญิง", "เด็กชายหรือเด็กหญิง", "ลูกชายหรือลูกสาว", "เพศชาย", "เพศหญิง"];
const relationshipKeywords = [
  "เป็นอะไรกับผู้ป่วย",
  "เกี่ยวข้องอย่างไร",
  "ใครเป็นคนให้ประวัติ",
  "มากับใคร",
  "เป็นแม่ใช่ไหม",
  "เป็นพ่อใช่ไหม",
  "ใครพามา",
  "ผู้ให้ประวัติเป็นใคร",
];
const chiefComplaintKeywords = [
  "วันนี้มาด้วยเรื่องอะไร",
  "พามาเพราะอะไร",
  "อาการสำคัญ",
  "มีปัญหาอะไร",
  "มาหาหมอเรื่องอะไร",
  "กังวลเรื่องอะไร",
];
const broadQuestionKeywords = [
  "มีอาการอะไรอีก",
  "เล่าอาการทั้งหมด",
  "เล่าให้ฟังหน่อย",
  "อาการอื่น",
  "อาการร่วม",
];
const fallbackResponses = [
  "ขอโทษค่ะ หมายถึงอาการส่วนไหนคะ",
  "เรื่องนี้แม่ไม่แน่ใจค่ะ รบกวนถามให้เจาะจงอีกนิดได้ไหมคะ",
  "ขอถามอีกครั้งให้ชัดเจนหน่อยได้ไหมคะ",
];

export function answerBleedingQuestion(
  currentCase: BleedingCase,
  question: string,
  currentCommunicationFlags: CommunicationFlags,
): BleedingResponseResult {
  const communicationFlags = updateCommunicationFlags(question, currentCommunicationFlags);
  const identity = currentCase.identity;
  const hasGreeting = hasAnyKeyword(question, greetingKeywords);
  const hasIntroduction = hasAnyKeyword(question, introductionKeywords);
  const hasPermission = hasAnyKeyword(question, permissionKeywords);

  if (hasGreeting || hasIntroduction || hasPermission) {
    const answer = hasGreeting && hasPermission ? "สวัสดีค่ะ ได้ค่ะ" : hasPermission ? "ได้ค่ะ" : "สวัสดีค่ะ";
    return { answer, domainIds: [], communicationFlags, ruleId: "communication" };
  }

  if (hasAnyKeyword(question, childNameKeywords) && !hasAnyKeyword(question, parentNameKeywords)) {
    return {
      answer: `ลูกชื่อ${identity.childName} ${identity.childSurname}ค่ะ ชื่อเล่นว่า${identity.childNickname}`,
      domainIds: [],
      communicationFlags,
      ruleId: "identity-child",
    };
  }

  if (hasAnyKeyword(question, parentNameKeywords)) {
    return {
      answer: `ชื่อ ${identity.parentName} ${identity.parentSurname}ค่ะ เป็น${identity.informantRelationship}ของน้องค่ะ`,
      domainIds: [],
      communicationFlags,
      ruleId: "identity-parent",
    };
  }

  if (hasAnyKeyword(question, ageKeywords)) {
    return {
      answer: `น้องอายุ ${identity.childAge} ค่ะ`,
      domainIds: [],
      communicationFlags,
      ruleId: "identity-age",
    };
  }

  if (hasAnyKeyword(question, sexKeywords)) {
    return {
      answer: identity.childSex === "ชาย" ? "เป็นเด็กผู้ชายค่ะ" : "เป็นเด็กผู้หญิงค่ะ",
      domainIds: [],
      communicationFlags,
      ruleId: "identity-sex",
    };
  }

  if (hasAnyKeyword(question, relationshipKeywords)) {
    return {
      answer: `เป็น${identity.informantRelationship}ของน้องค่ะ`,
      domainIds: [],
      communicationFlags,
      ruleId: "identity-relationship",
    };
  }

  if (hasAnyKeyword(question, chiefComplaintKeywords)) {
    return {
      answer: currentCase.openingStatement,
      domainIds: [],
      communicationFlags,
      ruleId: "chief-complaint",
    };
  }

  if (hasAnyKeyword(question, broadQuestionKeywords)) {
    return {
      answer: currentCase.broadAnswer,
      domainIds: [],
      communicationFlags,
      ruleId: "broad-question",
    };
  }

  const matchedRule = currentCase.responseRules.find((rule) => hasAnyKeyword(question, rule.keywords));
  if (matchedRule) {
    return {
      answer: matchedRule.answer,
      domainIds: matchedRule.domainIds,
      communicationFlags,
      ruleId: matchedRule.id,
    };
  }

  return {
    answer: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
    domainIds: [],
    communicationFlags,
  };
}
