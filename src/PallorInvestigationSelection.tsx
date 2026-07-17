import { FlaskConical, ListChecks } from "lucide-react";

export type PallorInvestigationId =
  | "cbc"
  | "reticulocyte"
  | "smear"
  | "iron"
  | "hemoglobin-typing"
  | "hemolysis"
  | "dat"
  | "g6pd"
  | "urinalysis"
  | "stool-occult-blood"
  | "bone-marrow"
  | "flow-cytometry"
  | "tumor-lysis"
  | "coagulation"
  | "chest-xray"
  | "genetic-testing";

type InvestigationOption = {
  id: PallorInvestigationId;
  label: string;
  group: "เบื้องต้น" | "จำเพาะตามสาเหตุ" | "เพิ่มเติม";
};

export const pallorInvestigationOptions: InvestigationOption[] = [
  { id: "cbc", label: "CBC with red cell indices", group: "เบื้องต้น" },
  { id: "reticulocyte", label: "Reticulocyte count", group: "เบื้องต้น" },
  { id: "smear", label: "Peripheral blood smear", group: "เบื้องต้น" },
  { id: "iron", label: "Serum ferritin และ iron studies", group: "จำเพาะตามสาเหตุ" },
  { id: "hemoglobin-typing", label: "Hemoglobin typing", group: "จำเพาะตามสาเหตุ" },
  { id: "hemolysis", label: "Bilirubin, LDH และ haptoglobin", group: "จำเพาะตามสาเหตุ" },
  { id: "dat", label: "Direct antiglobulin test (DAT)", group: "จำเพาะตามสาเหตุ" },
  { id: "g6pd", label: "G6PD enzyme assay", group: "จำเพาะตามสาเหตุ" },
  { id: "urinalysis", label: "Urinalysis for hemoglobinuria", group: "จำเพาะตามสาเหตุ" },
  { id: "stool-occult-blood", label: "Stool occult blood", group: "จำเพาะตามสาเหตุ" },
  { id: "bone-marrow", label: "Bone marrow aspiration and biopsy", group: "เพิ่มเติม" },
  { id: "flow-cytometry", label: "Flow cytometry และ cytogenetic studies", group: "เพิ่มเติม" },
  { id: "tumor-lysis", label: "Uric acid, renal และ liver function tests", group: "เพิ่มเติม" },
  { id: "coagulation", label: "Coagulation profile", group: "เพิ่มเติม" },
  { id: "chest-xray", label: "Chest X-ray", group: "เพิ่มเติม" },
  { id: "genetic-testing", label: "Alpha/beta-globin genetic testing", group: "เพิ่มเติม" },
];

type Props = {
  selected: Set<PallorInvestigationId>;
  onToggle: (id: PallorInvestigationId) => void;
  onContinue: () => void;
};

const groups = ["เบื้องต้น", "จำเพาะตามสาเหตุ", "เพิ่มเติม"] as const;

export function PallorInvestigationSelection({ selected, onToggle, onContinue }: Props) {
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
        เลือกเฉพาะการตรวจที่มีเหตุผลจากประวัติและผลตรวจร่างกาย ระบบจะแสดงรายการตรวจที่แนะนำในผลประเมิน
      </p>

      <div className="investigation-groups">
        {groups.map((group) => (
          <fieldset key={group} className="investigation-group">
            <legend>{group}</legend>
            <div className="choice-grid investigation-grid">
              {pallorInvestigationOptions
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
