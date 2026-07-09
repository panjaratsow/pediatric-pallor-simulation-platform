# แพลตฟอร์มจำลองกุมารโลหิตวิทยาสำหรับนักศึกษาแพทย์ปี 4

Pediatric Hematology Clinical Simulation Platform

เว็บแอปภาษาไทยสำหรับให้นักศึกษาแพทย์ปี 4 ฝึกประเมินผู้ป่วยเด็กแบบ self-directed learning ใช้ rule-based Thai keyword matching, local state และไม่ใช้ backend หรือ external AI API

## โมดูลภาวะเลือดออกผิดปกติ

- สุ่มเคส ITP, Hemophilia A, von Willebrand disease และ APDE
- ฝึกทักทาย แนะนำตัว ขออนุญาต และยืนยันตัวผู้ป่วย/ผู้ให้ประวัติ
- ฝึกซักประวัติและแยก mucocutaneous bleeding จาก deep/joint bleeding
- เลือกหัวข้อการตรวจร่างกายก่อนเปิดผลตรวจ
- เลือก laboratory investigations จากรายการตรวจเบื้องต้นและการตรวจจำเพาะ
- เขียน problem list, differential diagnosis และ final impression
- รับคะแนนและ feedback 5 ด้านรวม 100 คะแนน
- เปิด diagnosis, expected laboratory pattern และ model answer หลังส่งคำตอบ

## โมดูลภาวะซีด

โมดูลเดิมยังใช้งานได้ครบ 4 เคส ได้แก่ iron deficiency anemia, thalassemia, acute leukemia และ acute hemolysis จาก G6PD deficiency

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
