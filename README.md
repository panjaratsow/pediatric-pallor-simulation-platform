# แพลตฟอร์มฝึกซักประวัติเด็กซีดสำหรับนักศึกษาแพทย์ปี 4

Pediatric Pallor Clinical Simulation Platform

เว็บแอปภาษาไทยสำหรับให้นักศึกษาแพทย์ปี 4 ฝึกซักประวัติผู้ป่วยเด็กที่มาด้วยอาการซีด โดยจำลองการซักประวัติจากมารดาของผู้ป่วย ใช้ rule-based Thai keyword matching และไม่ใช้ backend หรือ external AI API

## ความสามารถหลัก

- สุ่มเคสจาก case bank 4 เคส
- ฝึกทักทาย แนะนำตัว ขออนุญาต และยืนยันตัวผู้ป่วย/ผู้ให้ประวัติ
- ฝึกซักประวัติเด็กซีดผ่าน chat simulation
- แสดงผลตรวจร่างกายหลังจบการซักประวัติ
- ให้ผู้เรียนเขียน problem list
- ประเมินคะแนนอัตโนมัติรวม 100 คะแนน
- ให้ feedback ด้าน clinical history taking และ communication skills
- เฉลย diagnosis หลังส่ง problem list เท่านั้น

## เคสที่มีในระบบ

- Iron deficiency anemia
- Thalassemia disease
- Acute leukemia presenting with anemia
- Acute hemolytic anemia, suspected G6PD deficiency

## การรันในเครื่อง

```bash
npm install
npm run dev
```

จากนั้นเปิด URL ที่ Vite แสดง เช่น `http://localhost:5173/`

## การ build

```bash
npm run build
```

ไฟล์ production จะถูกสร้างในโฟลเดอร์ `dist/`

## การเผยแพร่ผ่าน GitHub Pages

repo นี้มี GitHub Actions workflow สำหรับ deploy ไปยัง GitHub Pages อยู่ที่ `.github/workflows/deploy.yml`

หลัง push ขึ้น GitHub แล้ว ให้เปิด GitHub Pages ในหน้า repository:

1. ไปที่ `Settings`
2. ไปที่ `Pages`
3. เลือก source เป็น `GitHub Actions`
4. รอ workflow `Deploy to GitHub Pages` ทำงานสำเร็จ

## หมายเหตุด้านข้อมูลผู้ป่วย

เคสทั้งหมดเป็นข้อมูลสมมติ ไม่ใช่ข้อมูลผู้ป่วยจริง
