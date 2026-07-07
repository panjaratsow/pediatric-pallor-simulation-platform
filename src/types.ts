export type Stage = "start" | "history" | "exam" | "problem" | "feedback";

export type Message = {
  id: string;
  speaker: "student" | "mother";
  text: string;
};

export type ResponseRule = {
  id: string;
  domainIds: string[];
  keywords: string[];
  answer: string;
};

export type PatientIdentity = {
  childName: string;
  childSurname: string;
  childNickname: string;
  childAge: string;
  childSex: string;
  motherName: string;
  motherSurname: string;
  relationship: "มารดา";
};

export type CommunicationFlags = {
  greeted: boolean;
  introducedSelf: boolean;
  askedPermission: boolean;
  confirmedChildIdentity: boolean;
  confirmedInformantIdentity: boolean;
};

export type CaseSpecificRubricItem = {
  id: string;
  label: string;
  points: number;
  keywords: string[];
  missedPrompt: string;
};

export type ProblemRubricItem = {
  id: string;
  label: string;
  points: number;
  keywords: string[];
};

export type SimulationCase = {
  id: string;
  diagnosis: string;
  age: string;
  patientIdentity: PatientIdentity;
  openingStatement: string;
  broadAnswer: string;
  responseRules: ResponseRule[];
  physicalExam: {
    positives: string[];
    negatives: string[];
  };
  caseSpecificRubric: CaseSpecificRubricItem[];
  problemRubric: ProblemRubricItem[];
  modelProblemList: string[];
  finalImpression: string;
  suggestedInvestigations: string[];
  teachingSummary: string;
};

export type ScoreBreakdown = {
  communicationScore: number;
  generalScore: number;
  caseSpecificScore: number;
  problemScore: number;
  totalScore: number;
  communicationStrengths: string[];
  communicationMisses: string[];
  strengths: string[];
  missedQuestions: string[];
  generalHits: string[];
  caseHits: string[];
  problemHits: string[];
  interpretation: string;
};

export type ResponseEngineResult = {
  answer: string;
  domainIds: string[];
  communicationFlags: CommunicationFlags;
  ruleId?: string;
};
