# 🎮 AlgoKids - ตะลุยโลกอัลกอริทึมและการคิดเชิงคำนวณ

เว็บแอปพลิเคชันเพื่อการเรียนรู้วิทยาการคำนวณและอัลกอริทึม สำหรับเด็กระดับชั้นประถมศึกษา

---

## 🚀 วิธีนำขึ้น GitHub และเปิดแสดงหน้าเว็บบน GitHub Pages

คุณสามารถเปิดใช้งานบน **GitHub Pages** ได้ง่ายๆ 2 วิธี ดังนี้ครับ:

## 🚀 วิธีตั้งค่าเปิดหน้าเว็บบน GitHub Pages ให้แสดงผลได้ทันที

### วิธีที่ 1: ใช้โฟลเดอร์ `/docs` (ง่ายที่สุด ได้ผล 100% ไม่ต้องตั้งค่า Actions) ⭐
ทางโปรเจกต์ได้ทำการ Build หน้าเว็บพร้อมไฟล์ที่จำเป็นใส่ไว้ในโฟลเดอร์ `docs/` ให้เรียบร้อยแล้ว:

1. Push โค้ดทั้งหมดขึ้น GitHub (ตรวจดูให้แน่ใจว่าโฟลเดอร์ `docs/` ถูก push ขึ้นไปด้วย)
2. ไปที่ GitHub Repository ของคุณ -> คลิกแท็บ **Settings**
3. เมนูด้านซ้ายเลือก **Pages**
4. ในหัวข้อ **Build and deployment**:
   - **Source:** เลือก `Deploy from a branch`
   - **Branch:** เลือก `main` (หรือ `master`)
   - **Folder:** เปลี่ยนจาก `/ (root)` เป็น 👉 **`/docs`** 👈 *(สำคัญมาก! ถ้าเลือก root จะหน้าจอขาว)*
5. กดปุ่ม **Save**
6. รอประมาณ 1 นาที รีเฟรชหน้า จะปรากฏลิงก์สีเขียว เช่น:
   `https://<username>.github.io/game-test/`
   สามารถคลิกเข้าใช้งานเว็บได้ทันที!

---

### วิธีที่ 2: ใช้ GitHub Actions อัตโนมัติ (Automated Workflow)
โปรเจกต์มีไฟล์ `.github/workflows/deploy.yml` อยู่แล้ว:

1. Push โค้ดทั้งหมดขึ้น GitHub
2. ไปที่ **Settings** > **Pages**
3. ตรง **Source** ให้เลือกเป็น:
   👉 **GitHub Actions**
4. หากยังไม่ขึ้น ให้ไปที่แท็บ **Actions** ด้านบน และกด **Run workflow**
*(หมายเหตุ: ต้องเปิดสิทธิ์ Workflow Permissions ที่ Settings > Actions > General > Workflow permissions เป็น 'Read and write permissions')*

---

### วิธีที่ 3: สั่ง Deploy ผ่านคำสั่ง Terminal
```bash
npm run deploy
```
จากนั้นใน **Settings** > **Pages** เลือก Branch เป็น `gh-pages`

---

## ⚠️ แก้ปัญหาที่พบบ่อย (ทำไมยังไม่ได้?)

1. **หน้าจอขาว หรือโหลดไม่ขึ้น (Blank Screen):**
   - **สาเหตุ:** ไปเลือก Folder เป็น `/ (root)` แทนที่จะเป็น `/docs`
   - **วิธีแก้:** ไปที่ **Settings** > **Pages** แล้วเปลี่ยน Folder ให้เป็น **`/docs`** แล้วกด Save

2. **ขึ้นหน้า 404 Not Found:**
   - **สาเหตุ 1:** เพิ่งกดบันทึก ให้รอ 1-2 นาทีเพื่อให้ GitHub สร้างระบบเสร็จ
   - **สาเหตุ 2:** ตรวจสอบว่าชื่อ Repository คือ `game-test` หรือไม่ หากตั้งชื่ออื่น ให้เปลี่ยนใน `vite.config.ts` บรรทัด `base: '/ชื่อ-repo/'` แล้วรัน `npm run build:docs` ใหม่

3. **อยาก Build ไฟล์ใน `docs` ใหม่หลังแก้ไขโค้ด:**
   ```bash
   npm run build:docs
   ```

---

## 💻 วิธีเปิดรันในเครื่อง (Local Development)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้นระบบทดสอบ
npm run dev

# 3. เปิดเบราว์เซอร์ที่ http://localhost:3000
```
