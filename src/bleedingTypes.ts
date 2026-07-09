import type { CommunicationFlags, Message, ResponseRule } from "./types";

export type BleedingStage =
  | "start"
  | "history"
  | "exam"
  | "investigation"
  | "problem"
  | "feedback";

export type BleedingIdentity = {
  childName: string;
  childSurname: string;
  childNickname: string;
  childAge: string;
  childSex: "ชาย" | "หญิง";
  parentName: string;
  parentSurname: string;
  informantRelationship: string;
};

export type ExamDomainId = "general" | "skin" | "mucosa" | "organ" | "deep";

export type InvestigationId =
  | "cbc"
  | "smear"
  | "pt"
  | "aptt"
  | "fibrinogen"
  | "dDimer"
  | "reticulocyte"
  | "crossmatch"
  | "factor8"
  | "factor9"
  | "vwfAntigen"
  | "vwfActivity"
  | "plateletFunction"
  | "eosinophil"
  | "stool"
  | "lft"
  | "rft"
  | "boneMarrow"
  | "flowCytometry"
  | "mixingStudy";

export type InvestigationOption = {
  id: InvestigationId;
  label: string;
  group: "เบื้องต้น" | "จำเพาะ" | "เพิ่มเติม";
};

export type InvestigationScoreItem = {
  id: string;
  label: string;
  points: number;
  requiredAll?: InvestigationId[];
  requiredAny?: InvestigationId[];
  avoided?: InvestigationId[];
};

export type ProblemScoring = {
  patternKeywords: string[];
  positiveKeywords: string[];
  negativeKeywords: string[];
  differentialKeywords: string[];
  impressionKeywords: string[];
};

export type BleedingCase = {
  id: "itp" | "hemophilia-a" | "von-willebrand" | "apde";
  diagnosis: string;
  diagnosisCategory: string;
  identity: BleedingIdentity;
  openingStatement: string;
  broadAnswer: string;
  responseRules: ResponseRule[];
  physicalExam: {
    positives: string[];
    negatives: string[];
  };
  expectedLabPattern: string[];
  investigationScores: InvestigationScoreItem[];
  investigationNotes: Partial<Record<InvestigationId, string>>;
  problemScoring: ProblemScoring;
  modelProblemList: string[];
  differentialDiagnosis: string[];
  finalImpression: string;
  suggestedInvestigations: string[];
  teachingSummary: string;
};

export type BleedingScoreBreakdown = {
  communicationScore: number;
  historyScore: number;
  examScore: number;
  investigationScore: number;
  problemScore: number;
  totalScore: number;
  interpretation: string;
  communicationStrengths: string[];
  communicationMisses: string[];
  historyStrengths: string[];
  missedHistory: string[];
  examStrengths: string[];
  missedExam: string[];
  investigationStrengths: string[];
  investigationAdvice: string[];
  problemStrengths: string[];
  problemAdvice: string[];
};

export type BleedingResponseResult = {
  answer: string;
  domainIds: string[];
  communicationFlags: CommunicationFlags;
  ruleId?: string;
};

export type BleedingSession = {
  messages: Message[];
  trackedDomainIds: Set<string>;
  communicationFlags: CommunicationFlags;
  examDomains: Set<ExamDomainId>;
  selectedInvestigations: Set<InvestigationId>;
  problemList: string;
  differential: string;
  finalImpression: string;
};
