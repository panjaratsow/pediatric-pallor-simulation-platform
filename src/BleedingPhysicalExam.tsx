import { Eye, Stethoscope } from "lucide-react";
import { examDomains } from "./scoringEngineBleeding";
import type { BleedingCase, ExamDomainId } from "./bleedingTypes";

type Props = {
  currentCase: BleedingCase;
  selected: Set<ExamDomainId>;
  onToggle: (id: ExamDomainId) => void;
  revealed: boolean;
  onReveal: () => void;
  onContinue: () => void;
};

export function BleedingPhysicalExam({
  currentCase,
  selected,
  onToggle,
  revealed,
  onReveal,
  onContinue,
}: Props) {
  return (
    <section className="content-panel exam-workspace">
      <div className="section-head">
        <div>
          <p className="section-kicker">การให้เหตุผลก่อนตรวจ</p>
          <h2>เลือกหัวข้อการตรวจร่างกาย</h2>
        </div>
        <span>{selected.size}/5 หัวข้อ</span>
      </div>

      <p className="section-intro">
        เลือกสิ่งที่ต้องการตรวจในผู้ป่วยรายนี้ แล้วจึงเปิดผลตรวจร่างกาย
      </p>
      <fieldset className="choice-grid exam-choice-grid" disabled={revealed}>
        <legend className="sr-only">หัวข้อการตรวจร่างกาย</legend>
        {examDomains.map((domain) => (
          <label className={`choice-row ${selected.has(domain.id) ? "selected" : ""}`} key={domain.id}>
            <input
              type="checkbox"
              checked={selected.has(domain.id)}
              onChange={() => onToggle(domain.id)}
            />
            <span className="choice-check" aria-hidden="true" />
            <span>
              <strong>{domain.label}</strong>
              <small>{domain.points} คะแนน</small>
            </span>
          </label>
        ))}
      </fieldset>

      {!revealed ? (
        <button
          className="primary-button"
          type="button"
          disabled={selected.size === 0}
          onClick={onReveal}
        >
          <Eye size={18} />
          เปิดผลตรวจร่างกาย
        </button>
      ) : (
        <>
          <div className="result-divider">
            <Stethoscope size={19} />
            <span>ผลตรวจร่างกายที่ได้รับ</span>
          </div>
          <div className="two-column">
            <FindingPanel
              title="สิ่งตรวจพบที่สำคัญ"
              items={currentCase.physicalExam.positives}
              tone="positive"
            />
            <FindingPanel
              title="สิ่งที่ตรวจไม่พบ"
              items={currentCase.physicalExam.negatives}
              tone="negative"
            />
          </div>
          <button className="primary-button continue-button" type="button" onClick={onContinue}>
            ไปเลือกการส่งตรวจ
          </button>
        </>
      )}
    </section>
  );
}

export function FindingPanel({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "positive" | "negative" | "neutral";
}) {
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
