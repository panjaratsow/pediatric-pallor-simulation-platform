import React, { FormEvent, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { MessageCircle, Stethoscope } from "lucide-react";
import { ChatSimulation } from "./ChatSimulation";
import { FeedbackScreen, FindingCard } from "./FeedbackScreen";
import { selectRandomCase } from "./caseBank";
import { initialCommunicationFlags } from "./communicationScoring";
import { answerQuestion } from "./responseEngine";
import { calculateScore } from "./scoringEngine";
import type { CommunicationFlags, Message, ScoreBreakdown, SimulationCase, Stage } from "./types";
import "./styles.css";

const stageLabels: { id: Stage; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "history", label: "History taking" },
  { id: "exam", label: "Physical examination" },
  { id: "problem", label: "Problem list" },
  { id: "feedback", label: "Feedback" },
];

function App() {
  const [stage, setStage] = useState<Stage>("start");
  const [currentCase, setCurrentCase] = useState<SimulationCase | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [problemList, setProblemList] = useState("");
  const [trackedDomains, setTrackedDomains] = useState<Set<string>>(new Set());
  const [communicationFlags, setCommunicationFlags] = useState<CommunicationFlags>(initialCommunicationFlags);
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
    setScore(null);
    setStage("history");
  }

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (!currentCase || !question.trim()) return;

    const studentMessage: Message = { id: crypto.randomUUID(), speaker: "student", text: question.trim() };
    const response = answerQuestion(currentCase, question, communicationFlags);
    const motherMessage: Message = { id: crypto.randomUUID(), speaker: "mother", text: response.answer };

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
    setScore(calculateScore(currentCase, messages, trackedDomains, communicationFlags, problemList));
    setStage("feedback");
  }

  const progressTitle = useMemo(() => {
    if (stage === "start") return "ยังไม่ได้เริ่มเคส";
    if (stage === "history") return "กำลังซักประวัติ";
    if (stage === "exam") return "ทบทวนผลตรวจร่างกาย";
    if (stage === "problem") return "เขียน problem list";
    return "รับ feedback และเฉลย";
  }, [stage]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Pediatric Pallor Clinical Simulation Platform</p>
          <h1>แพลตฟอร์มฝึกซักประวัติเด็กซีดสำหรับนักศึกษาแพทย์ปี 4</h1>
        </div>
        <div className="privacy-note">เคสทั้งหมดเป็นข้อมูลสมมติ</div>
      </header>

      <nav className="progress" aria-label="ความคืบหน้าเคส">
        {stageLabels.map((item, index) => (
          <div key={item.id} className={`progress-step ${index <= activeIndex ? "active" : ""}`}>
            <span>{index + 1}</span>
            <p>{item.label}</p>
          </div>
        ))}
      </nav>

      <section className="status-band">
        <div>
          <p>Chief complaint</p>
          <strong>“สังเกตว่าลูกดูซีด”</strong>
        </div>
        <div>
          <p>สถานะ</p>
          <strong>{progressTitle}</strong>
        </div>
        <div>
          <p>Diagnosis</p>
          <strong>{stage === "feedback" && currentCase ? currentCase.diagnosis : "ซ่อนอยู่ระหว่างทำเคส"}</strong>
        </div>
      </section>

      {stage === "start" && <StartScreen onStart={startNewCase} />}
      {stage === "history" && currentCase && (
        <ChatSimulation
          messages={messages}
          question={question}
          setQuestion={setQuestion}
          onSubmit={submitQuestion}
          onEnd={() => setStage("exam")}
        />
      )}
      {stage === "exam" && currentCase && <ExamScreen currentCase={currentCase} onContinue={() => setStage("problem")} />}
      {stage === "problem" && (
        <ProblemScreen problemList={problemList} setProblemList={setProblemList} onSubmit={submitProblemList} />
      )}
      {stage === "feedback" && currentCase && score && (
        <FeedbackScreen currentCase={currentCase} score={score} onRestart={startNewCase} />
      )}
    </main>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="start-grid">
      <div className="start-panel">
        <p className="eyebrow">Self-directed clinical practice</p>
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
      <div className="illustration-panel" aria-hidden="true">
        <div className="patient-icon">
          <MessageCircle size={58} />
        </div>
        <p>ผู้ให้ประวัติ: มารดาของผู้ป่วยเด็ก</p>
        <span>ระบบจะสุ่ม 1 เคสจาก case bank ที่ซ่อน diagnosis ไว้</span>
      </div>
    </section>
  );
}

function ExamScreen({ currentCase, onContinue }: { currentCase: SimulationCase; onContinue: () => void }) {
  return (
    <section className="content-panel">
      <div className="section-head">
        <h2>ผลตรวจร่างกาย</h2>
        <button className="primary-button compact" type="button" onClick={onContinue}>
          ไปเขียน problem list
        </button>
      </div>
      <div className="two-column">
        <FindingCard title="Pertinent positive findings" items={currentCase.physicalExam.positives} tone="positive" />
        <FindingCard title="Pertinent negative findings" items={currentCase.physicalExam.negatives} tone="negative" />
      </div>
    </section>
  );
}

function ProblemScreen({
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
        placeholder="กรุณาเขียน problem list ของผู้ป่วยรายนี้ โดยรวมอาการสำคัญ ประเด็นจากประวัติ ประเด็นจากตรวจร่างกาย และ differential diagnosis ที่คิดถึง"
      />
      <button className="primary-button" type="button" disabled={!problemList.trim()} onClick={onSubmit}>
        ส่งคำตอบเพื่อประเมิน
      </button>
    </section>
  );
}


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
