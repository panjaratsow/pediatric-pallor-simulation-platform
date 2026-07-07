import { updateCommunicationFlags } from "./communicationScoring";
import { hasAnyKeyword } from "./keywordUtils";
import type { CommunicationFlags, ResponseEngineResult, SimulationCase } from "./types";

const greetingKeywords = [
  "สวัสดี",
  "สวัสดีครับ",
  "สวัสดีค่ะ",
  "หวัดดี",
  "ขออนุญาต",
  "ขอซักประวัติ",
  "ขอถามประวัติ",
  "ขอคุยด้วย",
  "ผมเป็นนักศึกษาแพทย์",
  "หนูเป็นนักศึกษาแพทย์",
  "ดิฉันเป็นนักศึกษาแพทย์",
  "ผมเป็นแพทย์",
  "ดิฉันเป็นแพทย์",
  "นักศึกษาแพทย์ปี 4",
  "ขออนุญาตซักประวัตินะครับ",
  "ขออนุญาตซักประวัตินะคะ",
];

const permissionKeywords = ["ขออนุญาต", "ขอซักประวัติ", "ขอถามประวัติ", "ขอคุยด้วย", "อนุญาตให้ซักประวัติ"];
const childNameKeywords = ["น้องชื่ออะไร", "ลูกชื่ออะไร", "ผู้ป่วยชื่ออะไร", "ชื่อผู้ป่วย", "ชื่อ-นามสกุล", "ชื่อจริง", "นามสกุล", "ขอทราบชื่อ", "ชื่ออะไรครับ", "ชื่ออะไรคะ"];
const motherNameKeywords = ["คุณแม่ชื่ออะไร", "แม่ชื่ออะไร", "ผู้ปกครองชื่ออะไร", "ผู้ให้ประวัติชื่ออะไร", "คนพามาชื่ออะไร", "ขอทราบชื่อคุณแม่", "คุณแม่ชื่อ"];
const ageKeywords = ["อายุเท่าไหร่", "น้องอายุ", "ลูกอายุ", "ผู้ป่วยอายุ", "กี่ขวบ", "กี่ปี"];
const sexKeywords = ["เพศอะไร", "ผู้ชายหรือผู้หญิง", "เด็กชายหรือเด็กหญิง", "ลูกชายหรือลูกสาว", "เพศชาย", "เพศหญิง"];
const relationshipKeywords = ["เป็นอะไรกับผู้ป่วย", "เกี่ยวข้องอย่างไร", "ใครเป็นคนให้ประวัติ", "มากับใคร", "เป็นแม่ใช่ไหม", "ใครพามา", "ผู้ให้ประวัติเป็นใคร"];
const chiefComplaintKeywords = [
  "วันนี้มาด้วยเรื่องอะไร",
  "มาด้วยเรื่องอะไร",
  "มาด้วยอาการอะไร",
  "พามาเพราะอะไร",
  "พาน้องมาเพราะอะไร",
  "พาน้องมาด้วยเรื่องอะไร",
  "อาการสำคัญ",
  "มีปัญหาอะไร",
  "เป็นอะไรมา",
  "มาหาหมอเรื่องอะไร",
  "กังวลเรื่องอะไร",
];
const broadQuestionKeywords = ["มีอาการอะไรอีก", "เล่าอาการทั้งหมด", "นอกจากซีด", "อาการอื่น", "อาการร่วม"];
const fallbackResponses = ["ขอโทษค่ะ คุณหมอหมายถึงเรื่องไหนคะ", "อันนี้แม่ไม่แน่ใจค่ะ", "รบกวนถามอีกครั้งได้ไหมคะ"];

export function answerQuestion(
  currentCase: SimulationCase,
  question: string,
  currentCommunicationFlags: CommunicationFlags,
): ResponseEngineResult {
  const communicationFlags = updateCommunicationFlags(question, currentCommunicationFlags);
  const identity = currentCase.patientIdentity;
  const hasGreeting = hasAnyKeyword(question, ["สวัสดี", "หวัดดี"]);
  const hasPermission = hasAnyKeyword(question, permissionKeywords);

  if (hasAnyKeyword(question, greetingKeywords)) {
    const answer = hasGreeting && hasPermission ? "สวัสดีค่ะ ได้ค่ะ" : hasPermission ? "ได้ค่ะ" : "สวัสดีค่ะ";
    return {
      answer,
      domainIds: [],
      communicationFlags,
      ruleId: "communication-greeting",
    };
  }

  if (hasAnyKeyword(question, childNameKeywords) && !hasAnyKeyword(question, motherNameKeywords)) {
    return {
      answer: `ลูกชื่อ${identity.childName} ${identity.childSurname}ค่ะ ชื่อเล่นว่า${identity.childNickname}`,
      domainIds: [],
      communicationFlags,
      ruleId: "identity-child-name",
    };
  }

  if (hasAnyKeyword(question, motherNameKeywords)) {
    return {
      answer: `แม่ชื่อ ${identity.motherName} ${identity.motherSurname}ค่ะ เป็นคุณแม่ของน้องค่ะ`,
      domainIds: [],
      communicationFlags,
      ruleId: "identity-mother-name",
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
      answer: "เป็นคุณแม่ของน้องค่ะ",
      domainIds: [],
      communicationFlags,
      ruleId: "identity-relationship",
    };
  }

  if (hasAnyKeyword(question, chiefComplaintKeywords)) {
    return {
      answer: "สังเกตว่าลูกดูซีดค่ะ",
      domainIds: [],
      communicationFlags,
      ruleId: "chief-complaint",
    };
  }

  if (hasAnyKeyword(question, broadQuestionKeywords)) {
    return { answer: currentCase.broadAnswer, domainIds: [], communicationFlags, ruleId: "broad-question" };
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

  const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return { answer: fallback, domainIds: [], communicationFlags };
}
