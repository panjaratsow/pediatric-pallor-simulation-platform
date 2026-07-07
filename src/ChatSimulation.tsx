import type { FormEvent } from "react";
import { ClipboardCheck, Send } from "lucide-react";
import type { Message } from "./types";

type ChatSimulationProps = {
  messages: Message[];
  question: string;
  setQuestion: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onEnd: () => void;
};

export function ChatSimulation({ messages, question, setQuestion, onSubmit, onEnd }: ChatSimulationProps) {
  return (
    <section className="history-layout">
      <aside className="case-sidebar">
        <h2>ข้อมูลตั้งต้น</h2>
        <dl>
          <div>
            <dt>ผู้ป่วย</dt>
            <dd>เด็กหนึ่งราย ข้อมูลระบุตัวตนต้องถามจากมารดา</dd>
          </div>
          <div>
            <dt>ผู้ให้ประวัติ</dt>
            <dd>มารดาของผู้ป่วย</dd>
          </div>
          <div>
            <dt>ข้อควรจำ</dt>
            <dd>มารดาจะตอบเฉพาะสิ่งที่ถาม และยังไม่เปิดเผย diagnosis</dd>
          </div>
        </dl>
        <button className="secondary-button wide" type="button" onClick={onEnd}>
          <ClipboardCheck size={18} />
          จบการซักประวัติ
        </button>
      </aside>
      <section className="chat-panel">
        <div className="section-head">
          <h2>บทสนทนาซักประวัติ</h2>
          <span>{messages.filter((message) => message.speaker === "student").length} คำถาม</span>
        </div>
        <div className="chat-log" aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`bubble ${message.speaker}`}>
              <span>{message.speaker === "student" ? "นักศึกษา" : "มารดา"}</span>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={onSubmit}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="พิมพ์คำถามซักประวัติ เช่น ซีดมานานแค่ไหน"
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
