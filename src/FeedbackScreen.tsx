import { RefreshCw } from "lucide-react";
import {
  pallorInvestigationOptions,
  type PallorInvestigationId,
} from "./PallorInvestigationSelection";
import type { ScoreBreakdown, SimulationCase } from "./types";

type FeedbackScreenProps = {
  currentCase: SimulationCase;
  score: ScoreBreakdown;
  selectedInvestigations: Set<PallorInvestigationId>;
  onRestart: () => void;
};

export function FeedbackScreen({
  currentCase,
  score,
  selectedInvestigations,
  onRestart,
}: FeedbackScreenProps) {
  const capturedDomains = [...score.generalHits, ...score.caseHits, ...score.problemHits];
  const selectedInvestigationLabels = pallorInvestigationOptions
    .filter((option) => selectedInvestigations.has(option.id))
    .map((option) => option.label);

  return (
    <section className="feedback-layout">
      <div className="score-hero">
        <div>
          <p>Diagnosis category</p>
          <h2>{currentCase.finalImpression}</h2>
          <span>{score.interpretation}</span>
        </div>
        <div className="score-circle">
          <strong>{score.totalScore}</strong>
          <span>/100</span>
        </div>
      </div>

      <div className="score-grid">
        <ScoreCard label="Communication skill score" value={score.communicationScore} total={10} />
        <ScoreCard label="General history-taking score" value={score.generalScore} total={55} />
        <ScoreCard label="Case-specific history score" value={score.caseSpecificScore} total={20} />
        <ScoreCard label="Problem list score" value={score.problemScore} total={15} />
        <ScoreCard label="Total score" value={score.totalScore} total={100} />
      </div>

      <div className="two-column">
        <FeedbackCard
          title="Feedback on communication skills"
          items={[
            ...(score.communicationStrengths.length ? score.communicationStrengths : ["ยังไม่ได้แสดงพฤติกรรมการสื่อสารช่วงต้นที่ได้คะแนน"]),
            ...score.communicationMisses,
          ]}
        />
        <FeedbackCard title="Missed clinical questions" items={score.missedQuestions.length ? score.missedQuestions : ["ครอบคลุมประเด็นสำคัญครบถ้วนดี"]} />
      </div>

      <div className="two-column">
        <FeedbackCard title="Strengths" items={score.strengths.length ? score.strengths : ["ยังมีโอกาสฝึกถามคำถามสำคัญเพิ่มเติม"]} />
        <FeedbackCard title="Clinical domains captured" items={capturedDomains.length ? capturedDomains : ["ยังไม่มี domain ที่ระบบตรวจพบ"]} />
      </div>

      <div className="two-column">
        <FindingCard title="Pertinent positive findings" items={currentCase.physicalExam.positives} tone="positive" />
        <FindingCard title="Pertinent negative findings" items={currentCase.physicalExam.negatives} tone="negative" />
      </div>

      <FeedbackCard title="Model problem list" items={currentCase.modelProblemList} />
      <div className="two-column">
        <FeedbackCard
          title="การส่งตรวจที่เลือก"
          items={selectedInvestigationLabels.length ? selectedInvestigationLabels : ["ไม่ได้เลือกการส่งตรวจ"]}
        />
        <FeedbackCard title="การส่งตรวจที่แนะนำ" items={currentCase.suggestedInvestigations} />
      </div>
      <article className="teaching-card">
        <h3>Teaching summary</h3>
        <p>{currentCase.teachingSummary}</p>
      </article>

      <button className="primary-button restart" type="button" onClick={onRestart}>
        <RefreshCw size={18} />
        เริ่มเคสใหม่
      </button>
    </section>
  );
}

export function FindingCard({ title, items, tone }: { title: string; items: string[]; tone: "positive" | "negative" }) {
  return (
    <article className={`finding-card ${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function ScoreCard({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <article className="score-card">
      <p>{label}</p>
      <strong>
        {value}
        <span>/{total}</span>
      </strong>
    </article>
  );
}

function FeedbackCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="feedback-card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
