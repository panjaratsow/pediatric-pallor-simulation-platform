import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { BleedingChatSimulation } from "./BleedingChatSimulation";
import { BleedingFeedbackScreen } from "./BleedingFeedbackScreen";
import { BleedingInvestigationSelection } from "./BleedingInvestigationSelection";
import { BleedingPhysicalExam } from "./BleedingPhysicalExam";
import { BleedingProblemListInput } from "./BleedingProblemListInput";
import { selectRandomBleedingCase } from "./caseBankBleeding";
import { initialCommunicationFlags } from "./communicationScoring";
import { answerBleedingQuestion } from "./responseEngineBleeding";
import { calculateBleedingScore } from "./scoringEngineBleeding";
import clinicConsultation from "../assets/clinic-consultation.png";
import type {
  BleedingCase,
  BleedingScoreBreakdown,
  BleedingStage,
  ExamDomainId,
  InvestigationId,
} from "./bleedingTypes";
import type { CommunicationFlags, Message } from "./types";

const stages: { id: BleedingStage; label: string }[] = [
  { id: "start", label: "เริ่มต้น" },
  { id: "history", label: "ซักประวัติ" },
  { id: "exam", label: "ตรวจร่างกาย" },
  { id: "investigation", label: "ส่งตรวจ" },
  { id: "problem", label: "สรุปปัญหา" },
  { id: "feedback", label: "ผลประเมิน" },
];

export function BleedingApp({ onSwitchToPallor }: { onSwitchToPallor: () => void }) {
  const [stage, setStage] = useState<BleedingStage>("start");
  const [currentCase, setCurrentCase] = useState<BleedingCase | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [trackedDomains, setTrackedDomains] = useState<Set<string>>(new Set());
  const [communicationFlags, setCommunicationFlags] =
    useState<CommunicationFlags>(initialCommunicationFlags);
  const [examDomains, setExamDomains] = useState<Set<ExamDomainId>>(new Set());
  const [examRevealed, setExamRevealed] = useState(false);
  const [selectedInvestigations, setSelectedInvestigations] = useState<
    Set<InvestigationId>
  >(new Set());
  const [problemList, setProblemList] = useState("");
  const [differential, setDifferential] = useState("");
  const [finalImpression, setFinalImpression] = useState("");
  const [score, setScore] = useState<BleedingScoreBreakdown | null>(null);

  const activeIndex = stages.findIndex((item) => item.id === stage);
  const progressTitle = useMemo(() => {
    const labels: Record<BleedingStage, string> = {
      start: "พร้อมเริ่มบทเรียน",
      history: "กำลังซักประวัติผู้ปกครอง",
      exam: examRevealed ? "กำลังทบทวนผลตรวจร่างกาย" : "กำลังวางแผนตรวจร่างกาย",
      investigation: "กำลังเลือกการส่งตรวจ",
      problem: "กำลังสรุปข้อมูลและวินิจฉัย",
      feedback: "รับคะแนนและทบทวนเฉลย",
    };
    return labels[stage];
  }, [examRevealed, stage]);

  function startNewCase() {
    const nextCase = selectRandomBleedingCase(currentCase?.id);
    setCurrentCase(nextCase);
    setMessages([
      {
        id: crypto.randomUUID(),
        speaker: "mother",
        text: nextCase.openingStatement,
      },
    ]);
    setQuestion("");
    setTrackedDomains(new Set());
    setCommunicationFlags(initialCommunicationFlags);
    setExamDomains(new Set());
    setExamRevealed(false);
    setSelectedInvestigations(new Set());
    setProblemList("");
    setDifferential("");
    setFinalImpression("");
    setScore(null);
    setStage("history");
  }

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (!currentCase || !question.trim()) return;

    const studentMessage: Message = {
      id: crypto.randomUUID(),
      speaker: "student",
      text: question.trim(),
    };
    const response = answerBleedingQuestion(currentCase, question, communicationFlags);
    const parentMessage: Message = {
      id: crypto.randomUUID(),
      speaker: "mother",
      text: response.answer,
    };

    setMessages((items) => [...items, studentMessage, parentMessage]);
    setCommunicationFlags(response.communicationFlags);
    setTrackedDomains((items) => {
      const next = new Set(items);
      response.domainIds.forEach((domainId) => next.add(domainId));
      return next;
    });
    setQuestion("");
  }

  function toggleExamDomain(id: ExamDomainId) {
    setExamDomains((items) => toggleSetItem(items, id));
  }

  function toggleInvestigation(id: InvestigationId) {
    setSelectedInvestigations((items) => toggleSetItem(items, id));
  }

  function submitReasoning() {
    if (
      !currentCase ||
      !problemList.trim() ||
      !differential.trim() ||
      !finalImpression.trim()
    ) {
      return;
    }
    setScore(
      calculateBleedingScore(
        currentCase,
        messages,
        trackedDomains,
        communicationFlags,
        examDomains,
        selectedInvestigations,
        problemList,
        differential,
        finalImpression,
      ),
    );
    setStage("feedback");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell bleeding-app">
      <header className="topbar bleeding-topbar">
        <div>
          <p className="eyebrow">Pediatric Bleeding Disorder Simulation</p>
          <h1>ฝึกประเมินภาวะเลือดออกผิดปกติในเด็ก</h1>
        </div>
        <div className="header-actions">
          <span className="privacy-note">
            <ShieldCheck size={16} />
            เคสสมมติ
          </span>
          <button className="text-button" type="button" onClick={onSwitchToPallor}>
            <ChevronLeft size={17} />
            โมดูลภาวะซีด
          </button>
        </div>
      </header>

      <nav className="progress bleeding-progress" aria-label="ความคืบหน้าของเคส">
        {stages.map((item, index) => (
          <div
            key={item.id}
            className={`progress-step ${index <= activeIndex ? "active" : ""} ${
              index === activeIndex ? "current" : ""
            }`}
            aria-current={index === activeIndex ? "step" : undefined}
          >
            <span>{index + 1}</span>
            <p>{item.label}</p>
          </div>
        ))}
      </nav>

      <section className="status-band bleeding-status">
        <div>
          <p>อาการสำคัญ</p>
          <strong>
            {currentCase && stage !== "start"
              ? `“${currentCase.openingStatement.replace(/ค่ะ$|ครับ$/, "")}”`
              : "รอเริ่มเคส"}
          </strong>
        </div>
        <div>
          <p>สถานะ</p>
          <strong>{progressTitle}</strong>
        </div>
        <div>
          <p>การวินิจฉัย</p>
          <strong>
            {stage === "feedback" && currentCase
              ? currentCase.diagnosis
              : "ซ่อนอยู่ระหว่างทำเคส"}
          </strong>
        </div>
      </section>

      {stage === "start" && <BleedingStartScreen onStart={startNewCase} />}
      {stage === "history" && currentCase && (
        <BleedingChatSimulation
          messages={messages}
          question={question}
          setQuestion={setQuestion}
          onSubmit={submitQuestion}
          onEnd={() => {
            setStage("exam");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {stage === "exam" && currentCase && (
        <BleedingPhysicalExam
          currentCase={currentCase}
          selected={examDomains}
          onToggle={toggleExamDomain}
          revealed={examRevealed}
          onReveal={() => setExamRevealed(true)}
          onContinue={() => {
            setStage("investigation");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {stage === "investigation" && (
        <BleedingInvestigationSelection
          selected={selectedInvestigations}
          onToggle={toggleInvestigation}
          onContinue={() => {
            setStage("problem");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {stage === "problem" && (
        <BleedingProblemListInput
          problemList={problemList}
          differential={differential}
          finalImpression={finalImpression}
          setProblemList={setProblemList}
          setDifferential={setDifferential}
          setFinalImpression={setFinalImpression}
          onSubmit={submitReasoning}
        />
      )}
      {stage === "feedback" && currentCase && score && (
        <BleedingFeedbackScreen
          currentCase={currentCase}
          score={score}
          selectedInvestigations={selectedInvestigations}
          onRestart={startNewCase}
          onBackToModules={onSwitchToPallor}
        />
      )}
    </main>
  );
}

function BleedingStartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="bleeding-start">
      <img
        src={clinicConsultation}
        alt=""
        aria-hidden="true"
      />
      <div className="bleeding-start-overlay" />
      <div className="bleeding-start-content">
        <p className="section-kicker">บทเรียนสำหรับนักศึกษาแพทย์ชั้นปีที่ 4</p>
        <h2>ฝึกซักประวัติผู้ป่วยเด็กที่มาด้วยเลือดออกผิดปกติ</h2>
        <div className="learning-objectives">
          <div>
            <Activity size={20} />
            <span>แยก mucocutaneous bleeding จาก deep tissue หรือ joint bleeding</span>
          </div>
          <div>
            <Stethoscope size={20} />
            <span>ซักประวัติ วางแผนตรวจร่างกาย และเลือกส่งตรวจอย่างเป็นระบบ</span>
          </div>
          <div>
            <BookOpen size={20} />
            <span>สร้าง problem list, differential diagnosis และค้นหา red flags</span>
          </div>
        </div>
        <p className="case-bank-note">
          ระบบจะสุ่มเคส ITP, Hemophilia A, von Willebrand disease หรือ APDE
        </p>
        <button className="primary-button start-case-button" type="button" onClick={onStart}>
          <Stethoscope size={19} />
          เริ่มเคส
        </button>
      </div>
    </section>
  );
}

function toggleSetItem<T>(items: Set<T>, id: T): Set<T> {
  const next = new Set(items);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}
