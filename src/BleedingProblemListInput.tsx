import { Send } from "lucide-react";

type Props = {
  problemList: string;
  differential: string;
  finalImpression: string;
  setProblemList: (value: string) => void;
  setDifferential: (value: string) => void;
  setFinalImpression: (value: string) => void;
  onSubmit: () => void;
};

export function BleedingProblemListInput({
  problemList,
  differential,
  finalImpression,
  setProblemList,
  setDifferential,
  setFinalImpression,
  onSubmit,
}: Props) {
  const canSubmit = problemList.trim() && differential.trim() && finalImpression.trim();

  return (
    <section className="content-panel reasoning-workspace">
      <div className="section-head">
        <div>
          <p className="section-kicker">สังเคราะห์ข้อมูล</p>
          <h2>สรุปปัญหาและวินิจฉัยแยกโรค</h2>
        </div>
      </div>
      <p className="section-intro">
        สรุป bleeding pattern, pertinent positives, pertinent negatives และเชื่อมโยงข้อมูลเป็นการวินิจฉัย
      </p>

      <div className="reasoning-fields">
        <label>
          <span>รายการปัญหา (Problem list)</span>
          <small>สรุปอาการสำคัญ ระยะเวลา รูปแบบเลือดออก และข้อมูลจากการตรวจร่างกาย</small>
          <textarea
            value={problemList}
            onChange={(event) => setProblemList(event.target.value)}
            placeholder="1. เด็ก... มีเลือดออกลักษณะ...
2. มีข้อมูลสนับสนุน...
3. ไม่มี..."
          />
        </label>
        <label>
          <span>การวินิจฉัยแยกโรค</span>
          <small>ระบุโรคที่คิดถึงและเหตุผลสั้น ๆ</small>
          <textarea
            className="compact-textarea"
            value={differential}
            onChange={(event) => setDifferential(event.target.value)}
            placeholder="1. ...
2. ..."
          />
        </label>
        <label>
          <span>การวินิจฉัยที่คิดถึงมากที่สุด</span>
          <small>ระบุการวินิจฉัยที่คิดถึงมากที่สุด</small>
          <input
            value={finalImpression}
            onChange={(event) => setFinalImpression(event.target.value)}
            placeholder="สงสัย..."
          />
        </label>
      </div>

      <button
        className="primary-button"
        type="button"
        disabled={!canSubmit}
        onClick={onSubmit}
      >
        <Send size={18} />
        ส่งคำตอบและรับ feedback
      </button>
    </section>
  );
}
