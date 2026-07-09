import {
  BookOpenCheck,
  CheckCircle2,
  FlaskConical,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { bleedingInvestigationOptions } from "./caseBankBleeding";
import { FindingPanel } from "./BleedingPhysicalExam";
import type {
  BleedingCase,
  BleedingScoreBreakdown,
  InvestigationId,
} from "./bleedingTypes";

type Props = {
  currentCase: BleedingCase;
  score: BleedingScoreBreakdown;
  selectedInvestigations: Set<InvestigationId>;
  onRestart: () => void;
  onBackToModules: () => void;
};

export function BleedingFeedbackScreen({
  currentCase,
  score,
  selectedInvestigations,
  onRestart,
  onBackToModules,
}: Props) {
  const selectedLabels = bleedingInvestigationOptions
    .filter((option) => selectedInvestigations.has(option.id))
    .map((option) => option.label);

  return (
    <section className="feedback-layout bleeding-feedback">
      <div className="score-hero bleeding-score-hero">
        <div>
          <p>การวินิจฉัยของเคส</p>
          <h2>{currentCase.finalImpression}</h2>
          <span>{currentCase.diagnosisCategory}</span>
          <strong className="performance-copy">{score.interpretation}</strong>
        </div>
        <div className="score-circle" aria-label={`คะแนนรวม ${score.totalScore} จาก 100`}>
          <strong>{score.totalScore}</strong>
          <span>/100</span>
        </div>
      </div>

      <div className="score-grid bleeding-score-grid">
        <ScoreCard label="การสื่อสาร" value={score.communicationScore} total={10} />
        <ScoreCard label="การซักประวัติ" value={score.historyScore} total={40} />
        <ScoreCard label="ตรวจร่างกาย" value={score.examScore} total={10} />
        <ScoreCard label="การส่งตรวจ" value={score.investigationScore} total={20} />
        <ScoreCard label="การสรุปปัญหา" value={score.problemScore} total={20} />
      </div>

      <section className="feedback-section">
        <div className="feedback-section-head">
          <CheckCircle2 size={20} />
          <div>
            <p>ทบทวนการปฏิบัติ</p>
            <h2>จุดแข็งและประเด็นที่ควรเก็บเพิ่ม</h2>
          </div>
        </div>
        <div className="two-column">
          <FeedbackPanel
            title="การสื่อสารกับผู้ปกครอง"
            strengths={score.communicationStrengths}
            improvements={score.communicationMisses}
          />
          <FeedbackPanel
            title="การซักประวัติ"
            strengths={score.historyStrengths}
            improvements={score.missedHistory}
          />
          <FeedbackPanel
            title="การวางแผนตรวจร่างกาย"
            strengths={score.examStrengths}
            improvements={score.missedExam}
          />
          <FeedbackPanel
            title="การสรุปปัญหาและวินิจฉัยแยกโรค"
            strengths={score.problemStrengths}
            improvements={score.problemAdvice}
          />
        </div>
      </section>

      <section className="feedback-section">
        <div className="feedback-section-head">
          <FlaskConical size={20} />
          <div>
            <p>การตรวจทางห้องปฏิบัติการ</p>
            <h2>ความเหมาะสมของการส่งตรวจ</h2>
          </div>
        </div>
        <div className="two-column">
          <ListPanel
            title="รายการที่ผู้เรียนเลือก"
            items={selectedLabels.length ? selectedLabels : ["ไม่ได้เลือกการส่งตรวจ"]}
          />
          <FeedbackPanel
            title="เหตุผลและข้อเสนอแนะ"
            strengths={score.investigationStrengths}
            improvements={score.investigationAdvice}
          />
        </div>
        <FindingPanel
          title="รูปแบบผลตรวจที่คาดหมาย"
          items={currentCase.expectedLabPattern}
          tone="neutral"
        />
      </section>

      <section className="feedback-section">
        <div className="feedback-section-head">
          <BookOpenCheck size={20} />
          <div>
            <p>เฉลยสำหรับทบทวน</p>
            <h2>แนวคิดของเคส</h2>
          </div>
        </div>
        <div className="two-column">
          <ListPanel title="ตัวอย่างรายการปัญหา" items={currentCase.modelProblemList} ordered />
          <ListPanel title="การวินิจฉัยแยกโรค" items={currentCase.differentialDiagnosis} ordered />
        </div>
        <ListPanel title="การส่งตรวจที่แนะนำ" items={currentCase.suggestedInvestigations} />
        <article className="teaching-card bleeding-teaching-card">
          <p className="section-kicker">สาระสำคัญ</p>
          <h3>สรุปบทเรียน</h3>
          <p>{currentCase.teachingSummary}</p>
        </article>
      </section>

      <div className="feedback-actions">
        <button className="primary-button" type="button" onClick={onRestart}>
          <RefreshCw size={18} />
          เริ่มเคสใหม่
        </button>
        <button className="secondary-button" type="button" onClick={onBackToModules}>
          <RotateCcw size={18} />
          กลับไปฝึกภาวะซีด
        </button>
      </div>
    </section>
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

function FeedbackPanel({
  title,
  strengths,
  improvements,
}: {
  title: string;
  strengths: string[];
  improvements: string[];
}) {
  return (
    <article className="feedback-card structured-feedback">
      <h3>{title}</h3>
      <div>
        <strong className="feedback-label success-label">ทำได้ดี</strong>
        <ul>
          {(strengths.length ? strengths : ["ยังไม่มีหัวข้อที่ได้คะแนนในส่วนนี้"]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong className="feedback-label improve-label">ควรเพิ่มเติม</strong>
        <ul>
          {(improvements.length ? improvements : ["ครอบคลุมหัวข้อสำคัญในส่วนนี้แล้ว"]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ListPanel({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <article className="feedback-card">
      <h3>{title}</h3>
      <List>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </article>
  );
}
