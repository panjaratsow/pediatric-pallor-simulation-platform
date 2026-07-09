import { useEffect, useRef, type FormEvent } from "react";
import { ClipboardCheck, Send } from "lucide-react";
import type { Message } from "./types";

type Props = {
  messages: Message[];
  patientSummary: string;
  question: string;
  setQuestion: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onEnd: () => void;
};

export function BleedingChatSimulation({
  messages,
  patientSummary,
  question,
  setQuestion,
  onSubmit,
  onEnd,
}: Props) {
  const logRef = useRef<HTMLDivElement>(null);
  const questionCount = messages.filter((message) => message.speaker === "student").length;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <section className="history-layout">
      <aside className="case-sidebar bleeding-sidebar">
        <p className="section-kicker">ห้องตรวจผู้ป่วยนอก</p>
        <h2>เริ่มจากสิ่งที่ผู้ปกครองเล่า</h2>
        <dl>
          <div>
            <dt>ผู้ป่วย</dt>
            <dd>{patientSummary} กรุณาถามชื่อและข้อมูลระบุตัวตนจากผู้ให้ประวัติ</dd>
          </div>
          <div>
            <dt>ผู้ให้ประวัติ</dt>
            <dd>ผู้ปกครองของผู้ป่วย</dd>
          </div>
          <div>
            <dt>หลักการซักประวัติ</dt>
            <dd>ผู้ปกครองจะตอบเฉพาะสิ่งที่ถาม และจะไม่เปิดเผยการวินิจฉัย</dd>
          </div>
        </dl>
        <button className="secondary-button wide" type="button" onClick={onEnd}>
          <ClipboardCheck size={18} />
          จบการซักประวัติ
        </button>
      </aside>

      <section className="chat-panel">
        <div className="section-head">
          <div>
            <p className="section-kicker">การสนทนา</p>
            <h2>ซักประวัติผู้ปกครอง</h2>
          </div>
          <span>{questionCount} คำถาม</span>
        </div>
        <div className="chat-log" ref={logRef} aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`bubble ${message.speaker}`}>
              <span>{message.speaker === "student" ? "นักศึกษาแพทย์" : "ผู้ปกครอง"}</span>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="bleeding-question">
            คำถามซักประวัติ
          </label>
          <input
            id="bleeding-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="พิมพ์คำถามที่ต้องการถามผู้ปกครอง"
            autoFocus
          />
          <button type="submit" aria-label="ส่งคำถาม">
            <Send size={18} />
            ส่ง
          </button>
        </form>
      </section>
    </section>
  );
}
