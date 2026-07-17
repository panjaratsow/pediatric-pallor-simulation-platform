import { useMemo, useState, type FormEvent } from "react";
import { ArrowRightLeft, Stethoscope } from "lucide-react";
import { ChatSimulation } from "./ChatSimulation";
import { FeedbackScreen, FindingCard } from "./FeedbackScreen";
import {
  PallorInvestigationSelection,
  type PallorInvestigationId,
} from "./PallorInvestigationSelection";
import { selectRandomCase } from "./caseBank";
import { initialCommunicationFlags } from "./communicationScoring";
import { answerQuestion } from "./responseEngine";
import { calculateScore } from "./scoringEngine";
import clinicConsultation from "../assets/clinic-consultation.png";
import type {
  CommunicationFlags,
  Message,
  ScoreBreakdown,
  SimulationCase,
  Stage,
} from "./types";

const stageLabels: { id: Stage; label: string }[] = [
  { id: "start", label: "เริ่มต้น" },
  { id: "history", label: "ซักประวัติ" },
  { id: "exam", label: "ตรวจร่างกาย" },
  { id: "investigation", label: "ส่งตรวจ" },
  { id: "problem", label: "สรุปปัญหา" },
  { id: "feedback", label: "ผลประเมิน" },
];

export function PallorApp({ onSwitchToBleeding }: { onSwitchToBleeding: () => void }) {
  const [stage, setStage] = useState<Stage>("start");
  const [currentCase, setCurrentCase] = useState<SimulationCase | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [problemList, setProblemList] = useState("");
  const [selectedInvestigations, setSelectedInvestigations] = useState<
    Set<PallorInvestigationId>
  >(new Set());
  const [trackedDomains, setTrackedDomains] = useState<Set<string>>(new Set());
  const [communicationFlags, setCommunicationFlags] =
    useState<CommunicationFlags>(initialCommunicationFlags);
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const activeIndex = stageLabels.findIndex((item) => item.id === stage);

  function startNewCase() {
    const nextCase = selectRandomCase();
    setCurrentCase(nextCase);
    setMessages([{ id: crypto.randomUUID(), speaker: "mother", text: nextCase.openingStatement }]);
    setTrackedDomains(new Set());
    setCommunicationFlags(initialCommunicationFlags);
    setQuestion("");
    setProblemList("");
    setSelectedInvestigations(new Set());
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
    const response = answerQuestion(currentCase, question, communicationFlags);
    const motherMessage: Message = {
      id: crypto.randomUUID(),
      speaker: "mother",
      text: response.answer,
    };
    setMessages((items) => [...items, studentMessage, motherMessage]);
    setCommunicationFlags(response.communicationFlags);
    setTrackedDomains((items) => {
      const next = new Set(items);
      response.domainIds.forEach((domainId) => next.add(domainId));
      return next;
    });
    setQuestion("");
  }

  function submitProblemList() {
    if (!currentCase || !problemList.trim()) return;
    setScore(
      calculateScore(currentCase, messages, trackedDomains, communicationFlags, problemList),
    );
    setStage("feedback");
  }

  function toggleInvestigation(id: PallorInvestigationId) {
    setSelectedInvestigations((items) => {
      const next = new Set(items);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const progressTitle = useMemo(() => {
    if (stage === "start") return "ยังไม่ได้เริ่มเคส";
    if (stage === "history") return "กำลังซักประวัติ";
    if (stage === "exam") return "ทบทวนผลตรวจร่างกาย";
    if (stage === "investigation") return "กำลังเลือกการส่งตรวจ";
    if (stage === "problem") return "กำลังสรุปปัญหา";
    return "รับผลประเมินและทบทวนเฉลย";
  }, [stage]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Pediatric Pallor Clinical Simulation Platform</p>
          <h1>แพลตฟอร์มฝึกซักประวัติเด็กซีดสำหรับนักศึกษาแพทย์ปี 4</h1>
        </div>
        <div className="header-actions">
          <div className="privacy-note">เคสทั้งหมดเป็นข้อมูลสมมติ</div>
          <button className="text-button" type="button" onClick={onSwitchToBleeding}>
            <ArrowRightLeft size={17} />
            โมดูลเลือดออกผิดปกติ
          </button>
        </div>
      </header>

      <nav className="progress pallor-progress" aria-label="ความคืบหน้าเคส">
        {stageLabels.map((item, index) => (
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

      <section className="status-band">
        <div>
          <p>อาการสำคัญ</p>
          <strong>“สังเกตว่าลูกดูซีด”</strong>
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

      {stage === "start" && <PallorStartScreen onStart={startNewCase} />}
      {stage === "history" && currentCase && (
        <ChatSimulation
          messages={messages}
          patientSummary={`เด็ก${currentCase.patientIdentity.childSex === "ชาย" ? "ชาย" : "หญิง"} อายุ ${currentCase.patientIdentity.childAge}`}
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
        <PallorExamScreen
          currentCase={currentCase}
          onContinue={() => {
            setStage("investigation");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {stage === "investigation" && (
        <PallorInvestigationSelection
          selected={selectedInvestigations}
          onToggle={toggleInvestigation}
          onContinue={() => {
            setStage("problem");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {stage === "problem" && (
        <PallorProblemScreen
          problemList={problemList}
          setProblemList={setProblemList}
          onSubmit={submitProblemList}
        />
      )}
      {stage === "feedback" && currentCase && score && (
        <FeedbackScreen
          currentCase={currentCase}
          score={score}
          selectedInvestigations={selectedInvestigations}
          onRestart={startNewCase}
        />
      )}
    </main>
  );
}

function PallorStartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="start-grid">
      <div className="start-panel">
        <p className="eyebrow">ฝึกทักษะด้วยตนเอง</p>
        <h2>เด็กอายุหนึ่งรายมาด้วยอาการซีด</h2>
        <ul className="objective-list">
          <li>ซักประวัติเด็กที่มาด้วยอาการซีดได้อย่างเป็นระบบ</li>
          <li>แยกกลุ่มสาเหตุสำคัญของภาวะซีดในเด็กจากประวัติ</li>
          <li>ระบุ pertinent positive และ pertinent negative findings</li>
          <li>สร้าง problem list ได้อย่างเหมาะสม</li>
          <li>ประเมิน differential diagnosis เบื้องต้นได้</li>
          <li>ฝึกการทักทาย แนะนำตัว ขออนุญาต และยืนยันตัวผู้ป่วย</li>
        </ul>
        <button className="primary-button" type="button" onClick={onStart}>
          <Stethoscope size={19} />
          เริ่มเคส
        </button>
      </div>
      <div className="illustration-panel pediatric-image-panel">
        <img
          src={clinicConsultation}
          alt="แพทย์กำลังพูดคุยกับมารดาที่อุ้มลูกในคลินิกเด็ก"
        />
        <div className="image-caption">
          <p>ผู้ให้ประวัติ: มารดาของผู้ป่วยเด็ก</p>
          <span>ระบบจะสุ่ม 1 เคสจาก case bank ที่ซ่อนการวินิจฉัยไว้</span>
        </div>
      </div>
    </section>
  );
}

function PallorExamScreen({
  currentCase,
  onContinue,
}: {
  currentCase: SimulationCase;
  onContinue: () => void;
}) {
  return (
    <section className="content-panel">
      <div className="section-head">
        <h2>ผลตรวจร่างกาย</h2>
        <button className="primary-button compact" type="button" onClick={onContinue}>
          ไปเลือกการส่งตรวจ
        </button>
      </div>
      <div className="two-column">
        <FindingCard
          title="Pertinent positive findings"
          items={currentCase.physicalExam.positives}
          tone="positive"
        />
        <FindingCard
          title="Pertinent negative findings"
          items={currentCase.physicalExam.negatives}
          tone="negative"
        />
      </div>
    </section>
  );
}

function PallorProblemScreen({
  problemList,
  setProblemList,
  onSubmit,
}: {
  problemList: string;
  setProblemList: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="content-panel">
      <div className="section-head">
        <h2>เขียน problem list</h2>
      </div>
      <textarea
        className="problem-textarea"
        value={problemList}
        onChange={(event) => setProblemList(event.target.value)}
        placeholder="เขียน problem list โดยรวมอาการสำคัญ ประเด็นจากประวัติ ผลตรวจร่างกาย และ differential diagnosis"
      />
      <button
        className="primary-button"
        type="button"
        disabled={!problemList.trim()}
        onClick={onSubmit}
      >
        ส่งคำตอบเพื่อประเมิน
      </button>
    </section>
  );
}
