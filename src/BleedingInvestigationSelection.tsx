import { FlaskConical, ListChecks } from "lucide-react";
import { bleedingInvestigationOptions } from "./caseBankBleeding";
import type { InvestigationId } from "./bleedingTypes";

type Props = {
  selected: Set<InvestigationId>;
  onToggle: (id: InvestigationId) => void;
  onContinue: () => void;
};

const groups = ["เบื้องต้น", "จำเพาะ", "เพิ่มเติม"] as const;

export function BleedingInvestigationSelection({ selected, onToggle, onContinue }: Props) {
  return (
    <section className="content-panel investigation-workspace">
      <div className="section-head">
        <div>
          <p className="section-kicker">วางแผนตรวจทางห้องปฏิบัติการ</p>
          <h2>เลือกการส่งตรวจที่เหมาะสม</h2>
        </div>
        <span>{selected.size} รายการ</span>
      </div>
      <p className="section-intro">
        เลือกเฉพาะการตรวจที่มีเหตุผลจากประวัติและผลตรวจร่างกาย ผลตรวจจะเปิดพร้อม feedback หลังส่งคำตอบทั้งหมด
      </p>

      <div className="investigation-groups">
        {groups.map((group) => (
          <fieldset key={group} className="investigation-group">
            <legend>{group}</legend>
            <div className="choice-grid investigation-grid">
              {bleedingInvestigationOptions
                .filter((option) => option.group === group)
                .map((option) => (
                  <label
                    className={`choice-row ${selected.has(option.id) ? "selected" : ""}`}
                    key={option.id}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(option.id)}
                      onChange={() => onToggle(option.id)}
                    />
                    <span className="choice-check" aria-hidden="true" />
                    <span>
                      <strong>{option.label}</strong>
                    </span>
                  </label>
                ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="selection-footer">
        <span>
          <FlaskConical size={17} />
          เลือกแล้ว {selected.size} รายการ
        </span>
        <button
          className="primary-button"
          type="button"
          disabled={selected.size === 0}
          onClick={onContinue}
        >
          <ListChecks size={18} />
          ยืนยันการส่งตรวจ
        </button>
      </div>
    </section>
  );
}
